// One-time bulk import for the "testimonial" documents that power the
// "What Others Say" section on the Info page. Safe to delete after you've
// run it once.
//
// testimonials-data.json is populated with the 6 quotes from the screenshot
// you shared (Jimmy, Matt, Risa, John, Karlee, Sam), transcribed as-is.
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
//        pnpm run import:testimonials
//
// Safe to re-run — skips any testimonial whose name already exists.

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
  const dataPath = path.join(__dirname, 'testimonials-data.json')
  const items = JSON.parse(await readFile(dataPath, 'utf-8'))

  console.log(`Loaded ${items.length} testimonials from ${path.basename(dataPath)}`)

  let created = 0
  let skipped = 0

  for (const item of items) {
    const existing = await client.fetch(`*[_type == "testimonial" && name == $name][0]._id`, {
      name: item.name,
    })

    if (existing) {
      console.log(`- skip (already exists): ${item.name}`)
      skipped++
      continue
    }

    await client.create({
      _type: 'testimonial',
      quote: item.quote,
      name: item.name,
      role: item.role,
      order: item.order,
    })

    console.log(`+ created: ${item.name}`)
    created++
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped} (already present).`)
}

main().catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
