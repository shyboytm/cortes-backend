
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
