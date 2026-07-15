// One-time bulk import for the "recommendation" documents that power the
// /recs page on cortes-frontend. Safe to delete after you've run it once.
//
// Setup (run these yourself — never share the token with anyone, including Claude):
//   1. Go to https://www.sanity.io/manage, pick this project (m83idean),
//      then API -> Tokens -> Add API token. Give it "Editor" permissions.
//   2. Copy the token and export it in your terminal (don't put it in a file
//      that gets committed):
//        export SANITY_WRITE_TOKEN="sk..."
//   3. Install the new dependency this script needs:
//        pnpm install
//   4. Run the import:
//        pnpm run import:recs
//
// The script is idempotent-ish: it checks for an existing recommendation
// with the same title+url before creating a new one, so it's safe to re-run
// if it fails partway through.

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

async function main() {
  const dataPath = path.join(__dirname, 'recs-data.json')
  const items = JSON.parse(await readFile(dataPath, 'utf-8'))

  console.log(`Loaded ${items.length} recommendations from ${path.basename(dataPath)}`)

  let created = 0
  let skipped = 0

  for (const item of items) {
    const existing = await client.fetch(
      `*[_type == "recommendation" && title == $title && url == $url][0]._id`,
      {title: item.title, url: item.url},
    )

    if (existing) {
      console.log(`- skip (already exists): ${item.title}`)
      skipped++
      continue
    }

    await client.create({
      _type: 'recommendation',
      title: item.title,
      category: item.category,
      description: item.description,
      url: item.url,
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
