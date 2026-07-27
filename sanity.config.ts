import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schemaTypes} from './schemaTypes'
import {AutofillExifAction} from './actions/autofillExifAction'

export default defineConfig({
  name: 'default',
  title: 'cortes-backend',

  projectId: 'm83idean',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => (context.schemaType === 'photo' ? [...prev, AutofillExifAction] : prev),
  },
})
