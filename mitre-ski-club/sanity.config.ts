import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const projectId = '3c10guha'

export default defineConfig([
  {
    name: 'production',
    title: 'Mitre Ski Club — Production',
    projectId,
    dataset: 'production',
    basePath: '/production',
    plugins: [structureTool(), visionTool()],
    schema: {types: schemaTypes},
  },
  {
    name: 'staging',
    title: 'Mitre Ski Club — Staging',
    projectId,
    dataset: 'staging',
    basePath: '/staging',
    plugins: [structureTool(), visionTool()],
    schema: {types: schemaTypes},
  },
])
