import {defineType, defineField, defineArrayMember} from 'sanity'

/** Icons available in the site's <Icon> component. */
export const ICON_OPTIONS = [
  {title: 'Snowflake', value: 'snow'},
  {title: 'Snow cloud', value: 'cloud-snow'},
  {title: 'Thermometer', value: 'thermometer'},
  {title: 'Mountain', value: 'mountain'},
  {title: 'Sun', value: 'sun'},
  {title: 'Map pin', value: 'map-pin'},
  {title: 'Calendar', value: 'calendar'},
  {title: 'People', value: 'users'},
  {title: 'Camera', value: 'camera'},
  {title: 'Car', value: 'car'},
  {title: 'Bus', value: 'bus'},
  {title: 'Info', value: 'info'},
  {title: 'Tag', value: 'tag'},
  {title: 'Shopping bag', value: 'shopping-bag'},
  {title: 'Lock', value: 'lock'},
  {title: 'Tick', value: 'check'},
  {title: 'Star', value: 'star'},
  {title: 'External link', value: 'external'},
  {title: 'Instagram', value: 'instagram'},
  {title: 'Facebook', value: 'facebook'},
]

export const iconField = (name = 'icon') =>
  defineField({
    name,
    title: 'Icon',
    type: 'string',
    options: {list: ICON_OPTIONS},
  })

/** A labelled link. `href` accepts a page file (lodge.html), an anchor, mailto:, tel: or a full URL. */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'href',
      title: 'URL or page',
      type: 'string',
      description: 'A page on this site (e.g. lodge.html), an external https:// URL, mailto: or tel:',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'newTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
    }),
    iconField(),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})

/** A call-to-action button. */
export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'href', title: 'URL or page', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'style',
      type: 'string',
      options: {
        list: [
          {title: 'Amber (primary action)', value: 'cta'},
          {title: 'Navy', value: 'primary'},
          {title: 'Outline — light background', value: 'ghost'},
          {title: 'Outline — dark background', value: 'ghost-light'},
        ],
        layout: 'radio',
      },
      initialValue: 'cta',
    }),
    iconField(),
    defineField({name: 'newTab', title: 'Open in a new tab', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})

/** An image with required alt text. */
export const figure = defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      description: 'Describes the image for screen readers and when the image fails to load.',
      type: 'string',
      validation: (r) => r.required(),
    }),
  ],
})

/** A headline number with a label — used in hero and stat rows. */
export const statItem = defineType({
  name: 'statItem',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({name: 'value', type: 'string', description: 'e.g. "1962" or "40+"', validation: (r) => r.required()}),
    defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
  ],
  preview: {select: {title: 'value', subtitle: 'label'}},
})

/** Section heading used at the top of most blocks. */
export const sectionHeading = defineType({
  name: 'sectionHeading',
  title: 'Section heading',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({name: 'eyebrow', type: 'string', description: 'Small uppercase label above the heading'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'intro', type: 'text', rows: 2}),
  ],
  preview: {select: {title: 'heading', subtitle: 'eyebrow'}},
})

/** The dark photo banner at the top of interior pages. */
export const pageHeader = defineType({
  name: 'pageHeader',
  title: 'Page header',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'lead',
      type: 'text',
      rows: 2,
      description: 'Italic serif line under the heading',
    }),
    defineField({name: 'backgroundImage', type: 'figure', validation: (r) => r.required()}),
    defineField({
      name: 'facts',
      title: 'Fact strip',
      description: 'Optional row of short facts under the heading (used on The Lodge).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'fact',
          fields: [
            defineField({name: 'value', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'detail', type: 'string'}),
          ],
          preview: {select: {title: 'value', subtitle: 'detail'}},
        }),
      ],
    }),
  ],
  preview: {select: {title: 'heading', subtitle: 'eyebrow', media: 'backgroundImage'}},
})

/** Search-engine and social sharing metadata. */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'metaTitle',
      type: 'string',
      description: 'Falls back to the page title. Keep under ~60 characters.',
      validation: (r) => r.max(70).warning('Long titles get truncated in search results'),
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(170).warning('Long descriptions get truncated in search results'),
    }),
    defineField({name: 'shareImage', title: 'Social share image', type: 'figure'}),
  ],
})

export const objectTypes = [link, cta, figure, statItem, sectionHeading, pageHeader, seo]
