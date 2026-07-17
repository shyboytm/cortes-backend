import {useState} from 'react'
import {useClient, useDocumentOperation} from 'sanity'
import type {DocumentActionComponent, DocumentActionProps} from 'sanity'

interface PhotoAssetRef {
  _ref?: string
}

interface PhotoDraftLike {
  image?: {asset?: PhotoAssetRef}
}

interface AssetMetadata {
  image?: {Make?: string; Model?: string}
  exif?: {LensModel?: string; LensMake?: string; DateTimeOriginal?: string; DateTimeDigitized?: string}
}

// Custom Studio action on the Photo document type: reads the uploaded
// image's camera/lens/date metadata — extracted natively by Sanity at
// upload time, per the `options.metadata` list on the image field in
// photoType.ts — and fills in the camera/lens/dateTaken fields if they're
// currently empty, so the photographer doesn't have to type them in by
// hand. Sanity excludes this data by default (it can contain private info
// like GPS location) and only starts extracting it going forward from
// when the schema opts in, so photos uploaded before that change need to
// be re-uploaded to pick it up. Only shows up once an image has actually
// been uploaded.
// Named in PascalCase (rather than the file's camelCase export name) since
// Sanity renders document actions as React components under the hood, and
// the react-hooks lint rule requires component-shaped names to allow the
// hook calls below.
export const AutofillExifAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {id, type, draft, published, onComplete} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const {patch} = useDocumentOperation(id, type)
  const [isRunning, setIsRunning] = useState(false)
  // Shown in a dialog once the action finishes, since a silent success/no-op
  // is otherwise indistinguishable from the button not doing anything.
  const [resultMessage, setResultMessage] = useState<string | null>(null)

  if (type !== 'photo') return null

  const doc = (draft || published) as PhotoDraftLike | null
  const assetRef = doc?.image?.asset?._ref
  if (!assetRef) return null

  return {
    label: isRunning ? 'Reading photo metadata…' : 'Autofill camera/lens from photo',
    disabled: isRunning,
    onHandle: async () => {
      setIsRunning(true)
      try {
        // Reads Sanity's own extracted metadata rather than re-downloading
        // and re-parsing the file: an earlier version of this action fetched
        // the raw CDN file and parsed it client-side with exifr, but that
        // came back empty even for files with real EXIF, because Sanity's
        // asset pipeline doesn't preserve camera/lens/date data in the
        // stored file unless the schema explicitly asks for it at upload
        // time (see photoType.ts). Asking for it there and reading it back
        // here is the supported, reliable path.
        const asset = await client.fetch<AssetMetadata | null>(
          `*[_id == $assetId][0]{"image": metadata.image, "exif": metadata.exif}`,
          {assetId: assetRef}
        )

        const patchSet: Record<string, string> = {}
        const make = asset?.image?.Make?.trim() ?? ''
        const model = asset?.image?.Model?.trim() ?? ''
        const camera = [make, model].filter(Boolean).join(' ')
        if (camera) patchSet.camera = camera

        const lens = asset?.exif?.LensModel?.trim() || asset?.exif?.LensMake?.trim()
        if (lens) patchSet.lens = lens

        // DateTimeOriginal/DateTimeDigitized come back as ISO date strings
        // (e.g. "2020-03-19T12:25:17.000Z"); dateTaken just wants the date.
        const rawDate = asset?.exif?.DateTimeOriginal ?? asset?.exif?.DateTimeDigitized
        if (typeof rawDate === 'string' && rawDate.length >= 10) {
          patchSet.dateTaken = rawDate.slice(0, 10)
        }

        const filledFields = Object.keys(patchSet)
        const hasAnyMetadata = Boolean(asset?.image || asset?.exif)

        if (filledFields.length > 0) {
          // setIfMissing only fills fields that are currently empty, so this
          // never clobbers a value the photographer already typed in by hand.
          patch.execute([{setIfMissing: patchSet}])
          setResultMessage(`Filled in: ${filledFields.join(', ')}.`)
        } else if (hasAnyMetadata) {
          // Metadata was found, just not under the fields we look for.
          // Surfacing it raw makes it possible to see what to add support
          // for, instead of guessing blind.
          setResultMessage(
            `Found metadata on this file, but none matched camera/lens/date. Raw: ${JSON.stringify(asset)}`
          )
        } else {
          setResultMessage(
            "No camera/lens/date data was found for this photo. Either the file itself never carried it (screenshots, re-saved exports, and messaging-app downloads usually don't), or it was uploaded before camera/lens metadata extraction was turned on for this schema, in which case re-uploading the image will pick it up. Metadata is also generated asynchronously right after upload, so if you just uploaded this photo, wait a few seconds and try again."
          )
        }
      } catch (error) {
        setResultMessage(
          `Something went wrong reading this image's metadata: ${error instanceof Error ? error.message : String(error)}`
        )
      } finally {
        setIsRunning(false)
      }
    },
    // onComplete is deferred to the dialog closing (rather than called
    // right after onHandle) so the result message stays on screen until the
    // photographer has actually seen it.
    dialog: resultMessage
      ? {
          type: 'dialog',
          onClose: () => {
            setResultMessage(null)
            onComplete()
          },
          header: 'Autofill from photo metadata',
          content: resultMessage,
        }
      : undefined,
  }
}
