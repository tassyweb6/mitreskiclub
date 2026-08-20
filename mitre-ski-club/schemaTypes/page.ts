import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

/** Every block type that can appear in a page's content. */
export const PAGE_BUILDER_BLOCKS = [
  'heroBlock',
  'conditionsStripBlock',
  'richTextBlock',
  'featureGridBlock',
  'quoteBlock',
  'infoSectionsBlock',
  'newsListBlock',
  'galleryGridBlock',
  'gearGridBlock',
  'reviewsBlock',
  'forecastBlock',
  'contactListBlock',
  'linkListBlock',
  'linkCardsBlock',
  'stepsBlock',
  'addressBlock',
  'noticeBlock',
  'ctaBandBlock',
  'youtubeBlock',
  'mapBlock',
  'instagramBlock',
  'iframeBlock',
  'serviceLinkBlock',
  'enquiryFormBlock',
  'loginFormBlock',
]

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'header', title: 'Header'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'File name',
      type: 'slug',
      group: 'content',
      description:
        'Matches the page file, without .html — e.g. "lodge" for lodge.html. Use "index" for the home page.',
      options: {source: 'title', maxLength: 40},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'headerStyle',
      title: 'Header style',
      type: 'string',
      group: 'header',
      options: {
        list: [
          {title: 'Photo banner', value: 'banner'},
          {title: 'None — starts with a hero block', value: 'none'},
        ],
        layout: 'radio',
      },
      initialValue: 'banner',
    }),
    defineField({
      name: 'header',
      title: 'Photo banner',
      type: 'pageHeader',
      group: 'header',
      hidden: ({parent}) => parent?.headerStyle !== 'banner',
    }),
    defineField({
      name: 'breadcrumb',
      title: 'Breadcrumb label',
      type: 'string',
      group: 'header',
      description: 'Shown after "Home /" at the top of the banner.',
      hidden: ({parent}) => parent?.headerStyle !== 'banner',
    }),
    defineField({
      name: 'showConditionsStrip',
      title: 'Show the snow conditions bar',
      type: 'boolean',
      group: 'header',
      initialValue: false,
    }),
    defineField({
      name: 'content',
      title: 'Page content',
      type: 'array',
      group: 'content',
      description: 'Add, reorder and remove sections. Drag by the handle on the left of each row.',
      of: PAGE_BUILDER_BLOCKS.map((type) => defineArrayMember({type})),
    }),
    defineField({
      name: 'showMemberBand',
      title: 'Show the members band above the footer',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', media: 'header.backgroundImage'},
    prepare: ({title, slug, media}) => ({
      title,
      subtitle: slug ? `${slug === 'index' ? 'index' : slug}.html` : 'No file name set',
      media,
    }),
  },
})
