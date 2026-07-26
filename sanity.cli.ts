import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'm83idean',
    dataset: 'production'
  },
  deployment: {
    autoUpdates: true,
  }
})
