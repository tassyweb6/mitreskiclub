import {post} from './post'
import {gearListing} from './gearListing'
import {galleryPhoto} from './galleryPhoto'
import {page} from './page'
import {objectTypes} from './objects'
import {contentBlockTypes} from './blocksContent'
import {embedBlockTypes} from './blocksEmbeds'
import {collectionBlockTypes} from './blocksCollections'
import {settingsTypes} from './settings'

export const schemaTypes = [
  // documents
  page,
  post,
  gearListing,
  galleryPhoto,
  ...settingsTypes,
  // reusable objects
  ...objectTypes,
  // page-builder blocks
  ...contentBlockTypes,
  ...embedBlockTypes,
  ...collectionBlockTypes,
]
