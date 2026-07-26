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
  exif?: {
    LensModel?: string
    LensMake?: string
    DateTimeOriginal?: string
    DateTimeDigitized?: string
    ExposureTime?: number
    FNumber?: number
    ISO?: number
  }
}

function formatShutterSpeed(exposureTime: number): string | null {
  if (!Number.isFinite(exposureTime) || exposureTime <= 0) return null
  if (exposureTime >= 1) return `${Number(exposureTime.toFixed(1))}s`
  return `1/${Math.round(1 / exposureTime)}s`
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ')
}

function withFStop(value: string): string {
  return value.replace(/f(\/?)(\d+(?:\.\d+)?)\b/gi, 'ƒ$1$2')
}

export const AutofillExifAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {id, type, draft, published, onComplete} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const {patch} = useDocumentOperation(id, type)
  const [isRunning, setIsRunning] = useState(false)
  const [resultMessage, setResultMessage] = useState<string | null>(null)

  if (type !== 'photo') return null

  const doc = (draft || published) as PhotoDraftLike | null
  const assetRef = doc?.image?.asset?._ref
  if (!assetRef) return null

  return {
    label: isRunning ? 'Reading photo metadata…' : 'Autofill camera/lens/settings from photo',
    disabled: isRunning,
    onHandle: async () => {
      setIsRunning(true)
      try {
        const asset = await client.fetch<AssetMetadata | null>(
          `*[_id == $assetId][0]{"image": metadata.image, "exif": metadata.exif}`,
          {assetId: assetRef}
        )

        const patchSet: Record<string, string> = {}
        const make = asset?.image?.Make?.trim() ? toTitleCase(asset.image.Make.trim()) : ''
        const model = asset?.image?.Model?.trim() ?? ''
        const camera = [make, model].filter(Boolean).join(' ')

        if (camera === 'Ricoh Imaging Company, Ltd. RICOH GR IIIx HDF') {
          patchSet.camera = 'Ricoh GR IIIx HDF'
          patchSet.lens = 'Ricoh ƒ2.8 lens'
        } else {
          if (camera) patchSet.camera = camera
          const lens = asset?.exif?.LensModel?.trim() || asset?.exif?.LensMake?.trim()
          if (lens) patchSet.lens = withFStop(lens)
        }

        const rawDate = asset?.exif?.DateTimeOriginal ?? asset?.exif?.DateTimeDigitized
        if (typeof rawDate === 'string' && rawDate.length >= 10) {
          patchSet.dateTaken = rawDate.slice(0, 10)
        }

        const shutterSpeed =
          typeof asset?.exif?.ExposureTime === 'number' ? formatShutterSpeed(asset.exif.ExposureTime) : null
        const aperture =
          typeof asset?.exif?.FNumber === 'number' ? `ƒ/${Number(asset.exif.FNumber.toFixed(1))}` : null
        const iso = typeof asset?.exif?.ISO === 'number' ? `ISO ${asset.exif.ISO}` : null
        const settings = [shutterSpeed, aperture, iso].filter(Boolean).join(' · ')
        if (settings) patchSet.settings = settings

        const filledFields = Object.keys(patchSet)
        const hasAnyMetadata = Boolean(asset?.image || asset?.exif)

        if (filledFields.length > 0) {
          patch.execute([{setIfMissing: patchSet}])
          setResultMessage(`Filled in: ${filledFields.join(', ')}.`)
        } else if (hasAnyMetadata) {
          setResultMessage(
            `Found metadata on this file, but none matched camera/lens/date/settings. Raw: ${JSON.stringify(asset)}`
          )
        } else {
          setResultMessage(
            "No camera/lens/date/settings data was found for this photo. Either the file itself never carried it (screenshots, re-saved exports, and messaging-app downloads usually don't), or it was uploaded before camera/lens metadata extraction was turned on for this schema, in which case re-uploading the image will pick it up. Metadata is also generated asynchronously right after upload, so if you just uploaded this photo, wait a few seconds and try again."
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
