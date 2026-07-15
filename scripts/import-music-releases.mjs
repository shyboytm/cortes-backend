// One-time bulk import for the "musicRelease" documents that power the
// releases grid on the Music page. Safe to delete after you've run it once.
//
// music-releases-data.json is populated with all 41 releases from
// cordio.bandcamp.com (title, type, year, Bandcamp link, and an artwork URL
// to download+upload), sorted newest-first with a matching "order" value.
// Each object is shaped like:
//
//   {
//     "title": "HM-09",
//     "artist": "Cordio",                 // or "HORIZON ✶ RADAR"
//     "releaseType": "album",              // album | ep | remix | single
//     "genre": "Ambient",                  // optional — not set on the import
//     "releaseYear": "2024",               // four digits, as a string
//     "link": "https://cordio.bandcamp.com/album/hm-09",
//     "artworkUrl": "https://f4.bcbits.com/img/xxxxx_10.jpg",  // optional
//     "order": 1                           // optional — lower shows first
//   }
//
// Setup (run these yourself — never share the token with anyone, including Claude):
//   1. Go to https://www.sanity.io/manage, pick this project (m83idean),
//      then API -> Tokens -> Add API token. Give it "Editor" permissions.
//   2. Copy the token and export it in your terminal (don't put it in a file
//      that gets committed):
//        export SANITY_WRITE_TOKEN="sk..."
//   3. Install dependencies if you haven't already:
//        pnpm install
//   4. Run the import:
//        pnpm run import:music
//
// The script is idempotent-ish: it checks for an existing release with the
// same title+artist before creating a new one, so it's safe to re-run if it
// fails partway through. If "artworkUrl" is set, the image is downloaded and
// uploaded to Sanity as the release's artwork asset.

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
