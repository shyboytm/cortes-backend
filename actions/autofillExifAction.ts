import {useState} from 'react'
import {parse as parseExif} from 'exifr'
import {useClient, useDocumentOperation} from 'sanity'
import type {DocumentActionComponent, DocumentActionProps} from 'sanity'

interface PhotoAssetRef {
  _ref?: string
}

interface PhotoDraftLike {
  image?: {asset?: PhotoAssetRef}
}

// Formats a Date (exifr revives EXIF date tags into Date objects by
// default) or a raw EXIF "YYYY:MM:DD HH:MM:SS" string into the "YYYY-MM-DD"
// the dateTaken field expects.
function formatExifDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4}):(\d{2}):(\d{2})/)
    if (match) return `${match[1]}-${match[2]}-${match[3]}`
  }
  return null
}

// Custom Studio action on the Photo document type: reads the uploaded
// image's EXIF data (camera make/model, lens, and the date it was shot)
// and fills in the camera/lens/dateTaken fields if they're currently
// empty, so the photographer doesn't have to type them in by hand. Sanity
// doesn't extract EXIF into its own asset metadata, so this fetches the
// original file's URL and parses it directly with the exifr library
// instead of reading `asset->metadata.exif` (which doesn't exist). Only
// shows up once an image has actually been uploaded.
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
        const asset = await client.fetch<{url?: string} | null>(`*[_id == $assetId][0]{url}`, {
          assetId: assetRef,
        })
        if (!asset?.url) throw new Error("Could not find this photo's file URL.")

        const tags = await parseExif(asset.url, [
          'Make',
          'Model',
          'LensModel',
          'LensMake',
          'DateTimeOriginal',
          'CreateDate',
        ])

        const patchSet: Record<string, string> = {}
        const make = typeof tags?.Make === 'string' ? tags.Make.trim() : ''
        const model = typeof tags?.Model === 'string' ? tags.Model.trim() : ''
        const camera = [make, model].filter(Boolean).join(' ')
        if (camera) patchSet.camera = camera

        const lens = tags?.LensModel
        if (typeof lens === 'string' && lens.trim()) patchSet.lens = lens.trim()

        const dateTaken = formatExifDate(tags?.DateTimeOriginal ?? tags?.CreateDate)
        if (dateTaken) patchSet.dateTaken = dateTaken

        const filledFields = Object.keys(patchSet)
        if (filledFields.length > 0) {
          // setIfMissing only fills fields that are currently empty, so this
          // never clobbers a value the photographer already typed in by hand.
          patch.execute([{setIfMissing: patchSet}])
          setResultMessage(`Filled in: ${filledFields.join(', ')}.`)
        } else {
          setResultMessage(
            "No camera/lens/date data was found in this image's file. Some images (screenshots, re-saved exports, messaging-app downloads) never carry this data to begin with."
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
