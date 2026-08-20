import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {MenuIcon} from '@sanity/icons/Menu'
import {DocumentIcon} from '@sanity/icons/Document'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {TagIcon} from '@sanity/icons/Tag'
import {ImageIcon} from '@sanity/icons/Image'
import {UsersIcon} from '@sanity/icons/Users'

/** Documents that exist exactly once — opened directly rather than as a list. */
const SINGLETONS = [
  {id: 'siteSettings', title: 'Site settings', icon: CogIcon},
  {id: 'navigation', title: 'Navigation', icon: MenuIcon},
  {id: 'memberBand', title: 'Members band', icon: UsersIcon},
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Mitre Ski Club')
    .items([
      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages').defaultOrdering([{field: 'title', direction: 'asc'}])),

      S.divider(),

      S.listItem()
        .title('News posts')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('post')
            .title('News posts')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
        ),
      S.listItem()
        .title('Gear listings')
        .icon(TagIcon)
        .child(
          S.documentTypeList('gearListing')
            .title('Gear listings')
            .defaultOrdering([{field: 'postedAt', direction: 'desc'}])
        ),
      S.listItem()
        .title('Gallery photos')
        .icon(ImageIcon)
        .child(
          S.documentTypeList('galleryPhoto')
            .title('Gallery photos')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
        ),

      S.divider(),

      ...SINGLETONS.map((s) =>
        S.listItem()
          .title(s.title)
          .icon(s.icon)
          .child(S.document().schemaType(s.id).documentId(s.id).title(s.title))
      ),
    ])

/** Singletons should not be creatable or deletable from the Studio UI. */
export const singletonTypes = new Set(SINGLETONS.map((s) => s.id))
