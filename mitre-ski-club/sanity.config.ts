import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure, singletonTypes} from './structure'

const projectId = '3c10guha'

/** Singletons: no "create new", no "delete" — there is only ever one of each. */
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

const shared = {
  projectId,
  plugins: [structureTool({structure}), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (prev: any[]) => prev.filter((t) => !singletonTypes.has(t.schemaType)),
  },
  document: {
    actions: (prev: any[], {schemaType}: {schemaType: string}) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({action}: any) => action && singletonActions.has(action))
        : prev,
  },
}

export default defineConfig([
  {
    ...shared,
    name: 'production',
    title: 'Mitre Ski Club — Production',
    dataset: 'production',
    basePath: '/production',
  },
  {
    ...shared,
    name: 'staging',
    title: 'Mitre Ski Club — Staging',
    dataset: 'staging',
    basePath: '/staging',
  },
])
