
import {createClient} from '@sanity/client'
import {readFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error(
    'Missing SANITY_WRITE_TOKEN. Create a write token at sanity.io/manage and\n' +
      'export it in your shell first: export SANITY_WRITE_TOKEN="sk..."',
  )
  process.exit(1)
}

const client = createClient({
  projectId: 'm83idean',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function uploadArtwork(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download artwork (${res.status}): ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const filename = path.basename(new URL(url).pathname) || 'artwork.jpg'
  return client.assets.upload('image', buffer, {filename})
}

async function main() {
  const dataPath = path.join(__dirname, 'music-releases-data.json')
  const items = JSON.parse(await readFile(dataPath, 'utf-8'))

  if (items.length === 0) {
    console.log(
      'music-releases-data.json is empty — nothing to import.\n' +
        'Fill it in (see the comment at the top of this script for the shape), then re-run.',
    )
    return
  }

  console.log(`Loaded ${items.length} releases from ${path.basename(dataPath)}`)

  let created = 0
  let skipped = 0

  for (const item of items) {
    const existing = await client.fetch(
      `*[_type == "musicRelease" && title == $title && artist == $artist][0]._id`,
      {title: item.title, artist: item.artist},
    )

    if (existing) {
      console.log(`- skip (already exists): ${item.title}`)
      skipped++
      continue
    }

    let artwork
    if (item.artworkUrl) {
      console.log(`  uploading artwork for ${item.title}...`)
      const asset = await uploadArtwork(item.artworkUrl)
      artwork = {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
    }

    await client.create({
      _type: 'musicRelease',
      title: item.title,
      artist: item.artist,
      releaseType: item.releaseType,
      genre: item.genre,
      releaseYear: item.releaseYear,
      link: item.link,
      order: item.order,
      ...(artwork ? {artwork} : {}),
    })

    console.log(`+ created: ${item.title}`)
    created++
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped} (already present).`)
}

main().catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
