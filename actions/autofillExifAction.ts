import {useState} from 'react'
import {useClient, useDocumentOperation} from 'sanity'
import type {DocumentActionComponent, DocumentActionProps} from 'sanity'

interface PhotoAssetRef {
  _ref?: string
}

interface PhotoDraftLike {
  image?: {asset?: PhotoAssetRef}
}

// Converts an EXIF "YYYY:MM:DD HH:MM:SS" timestamp into the "YYYY-MM-DD"
// format the dateTaken field expects.
function parseExifDate(raw: string): string | null {
  const match = raw.match(/^(\d{4}):(\d{2}):(\d{2})/)
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null
}

// Custom Studio action on the Photo document type: reads the uploaded
// image's EXIF data (camera make/model, lens, and the date it was shot)
// and fills in the camera/lens/dateTaken fields if they're currently
// empty, so the photographer doesn't have to type them in by hand. Only
// shows up once an image has actually been uploaded, since EXIF lives on
// the image asset rather than the document itself.
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
        const asset = await client.fetch<{exif?: Record<string, unknown>} | null>(
          `*[_id == $assetId][0]{"exif": metadata.exif}`,
          {assetId: assetRef}
        )
        const exif = asset?.exif ?? {}
        const patchSet: Record<string, string> = {}

        const make = typeof exif.Make === 'string' ? exif.Make.trim() : ''
        const model = typeof exif.Model === 'string' ? exif.Model.trim() : ''
        const camera = [make, model].filter(Boolean).join(' ')
        if (camera) patchSet.camera = camera

        const lens = exif.LensModel
        if (typeof lens === 'string' && lens.trim()) patchSet.lens = lens.trim()

        const rawDate = exif.DateTimeOriginal ?? exif.DateTime
        if (typeof rawDate === 'string') {
          const parsed = parseExifDate(rawDate)
          if (parsed) patchSet.dateTaken = parsed
        }

        const filledFields = Object.keys(patchSet)
        if (filledFields.length > 0) {
          // setIfMissing only fills fields that are currently empty, so this
          // never clobbers a value the photographer already typed in by hand.
          patch.execute([{setIfMissing: patchSet}])
          setResultMessage(`Filled in: ${filledFields.join(', ')}.`)
        } else {
          setResultMessage(
            "No camera/lens/date data was found in this image's metadata. If you just uploaded it, Sanity may still be processing it, wait a few seconds and try again. Some images (screenshots, re-saved exports, messaging-app downloads) never carry this data to begin with."
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
