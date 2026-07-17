import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {AutofillExifAction} from './actions/autofillExifAction'

export default defineConfig({
  name: 'default',
  title: 'cortes-backend',

  projectId: 'm83idean',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Adds the EXIF autofill action to Photo documents alongside the
    // framework's default actions (publish, discard, etc).
    actions: (prev, context) => (context.schemaType === 'photo' ? [...prev, AutofillExifAction] : prev),
  },
})
