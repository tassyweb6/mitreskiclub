import {defineType, defineField, defineArrayMember} from 'sanity'

/* ── News list ─────────────────────────────────────────────── */
export const newsListBlock = defineType({
  name: 'newsListBlock',
  title: 'News list',
  type: 'object',
  description: 'Pulls News Posts automatically. Edit the posts themselves under "News Posts".',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({
      name: 'layout',
      type: 'string',
      options: {
        list: [
          {title: 'Rail — latest few, side by side', value: 'rail'},
          {title: 'Archive — featured post plus filterable grid', value: 'archive'},
        ],
        layout: 'radio',
      },
      initialValue: 'rail',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'limit',
      title: 'How many to show',
      type: 'number',
      initialValue: 3,
      hidden: ({parent}) => parent?.layout !== 'rail',
      validation: (r) => r.min(1).max(12),
    }),
    defineField({
      name: 'showFilters',
      title: 'Show category filters',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}) => parent?.layout !== 'archive',
    }),
    defineField({name: 'viewAllLink', title: '"View all" link', type: 'link'}),
    defineField({name: 'tintedBackground', title: 'Tinted background', type: 'boolean', initialValue: true}),
  ],
  preview: {
    select: {title: 'heading.heading', layout: 'layout'},
    prepare: ({title, layout}) => ({title: title || 'News list', subtitle: `News · ${layout || 'rail'}`}),
  },
})

/* ── Gallery grid ──────────────────────────────────────────── */
export const galleryGridBlock = defineType({
  name: 'galleryGridBlock',
  title: 'Photo gallery',
  type: 'object',
  description: 'Pulls Gallery Photos automatically. Add photos under "Gallery Photos".',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({name: 'showFilters', title: 'Show category filters', type: 'boolean', initialValue: true}),
    defineField({
      name: 'filters',
      title: 'Filter buttons',
      description: 'Leave empty to show every category.',
      type: 'array',
      hidden: ({parent}) => !parent?.showFilters,
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryFilter',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'category',
              type: 'string',
              options: {
                list: [
                  {title: 'All photos', value: 'all'},
                  {title: 'On the mountain', value: 'mountain'},
                  {title: 'Lodge life', value: 'lodge'},
                  {title: 'Working bees', value: 'bee'},
                  {title: 'Off-season', value: 'summer'},
                ],
              },
              validation: (r) => r.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'category'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Photo gallery', subtitle: 'Gallery Photos'})},
})

/* ── Gear grid ─────────────────────────────────────────────── */
export const gearGridBlock = defineType({
  name: 'gearGridBlock',
  title: 'Used gear listings',
  type: 'object',
  description: 'Pulls Gear Listings automatically. Add items under "Gear Listings".',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({name: 'showFilters', title: 'Show category filters', type: 'boolean', initialValue: true}),
    defineField({
      name: 'filters',
      title: 'Filter buttons',
      description: 'Leave empty to show every category.',
      type: 'array',
      hidden: ({parent}) => !parent?.showFilters,
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: ['All', 'Skis', 'Kids skis', 'Boots', 'Jacket', 'Helmet'],
      },
    }),
    defineField({
      name: 'hideSold',
      title: 'Hide sold items',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'contactButtonLabel',
      type: 'string',
      initialValue: 'Contact seller',
    }),
    defineField({
      name: 'contactButtonHref',
      title: 'Contact button link',
      type: 'string',
      initialValue: 'login.html',
    }),
  ],
  preview: {prepare: () => ({title: 'Used gear listings', subtitle: 'Gear Listings'})},
})

/* ── Enquiry form ──────────────────────────────────────────── */
export const enquiryFormBlock = defineType({
  name: 'enquiryFormBlock',
  title: 'Enquiry form',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', initialValue: 'Send us a note'}),
    defineField({name: 'intro', type: 'string', initialValue: '* required'}),
    defineField({
      name: 'topics',
      title: 'Enquiry topics',
      description: 'The options in the "What\'s this about?" dropdown.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'topic',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'value', type: 'string', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'messagePlaceholder',
      title: 'Message placeholder',
      type: 'text',
      rows: 2,
    }),
    defineField({name: 'consentLabel', type: 'string'}),
    defineField({name: 'submitLabel', type: 'string', initialValue: 'Send enquiry'}),
    defineField({name: 'successHeading', type: 'string', initialValue: 'Thanks — your message is on its way.'}),
    defineField({name: 'successBody', type: 'string', initialValue: "We'll be in touch within a week."}),
    defineField({
      name: 'sidebar',
      title: 'Side column',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'heading', type: 'string'}),
        defineField({name: 'intro', type: 'text', rows: 2}),
        defineField({
          name: 'steps',
          title: 'Numbered steps',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'formStep',
              fields: [
                defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
                defineField({name: 'body', type: 'string'}),
              ],
              preview: {select: {title: 'title', subtitle: 'body'}},
            }),
          ],
        }),
        defineField({name: 'contactsHeading', type: 'string', initialValue: 'Direct contacts'}),
        defineField({
          name: 'contacts',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'formContact',
              fields: [
                defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
                defineField({name: 'value', type: 'string', validation: (r) => r.required()}),
              ],
              preview: {select: {title: 'label', subtitle: 'value'}},
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Enquiry form'})},
})

/* ── Login form ────────────────────────────────────────────── */
export const loginFormBlock = defineType({
  name: 'loginFormBlock',
  title: 'Member login form',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', type: 'string', initialValue: 'Members'}),
    defineField({name: 'heading', type: 'string', initialValue: 'Log in to bookings.'}),
    defineField({name: 'intro', type: 'text', rows: 2}),
    defineField({name: 'submitLabel', type: 'string', initialValue: 'Log in'}),
    defineField({name: 'successMessage', type: 'string'}),
    defineField({name: 'joinPrompt', type: 'string', description: 'Line under the form, e.g. "Not a member?"'}),
    defineField({name: 'joinLink', type: 'link'}),
    defineField({
      name: 'art',
      title: 'Side panel',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'backgroundImage', type: 'figure'}),
        defineField({name: 'welcomeHeading', type: 'string'}),
        defineField({name: 'welcomeEmphasis', title: 'Welcome — italic second line', type: 'string'}),
        defineField({name: 'welcomeBody', type: 'text', rows: 2}),
        defineField({name: 'quote', type: 'text', rows: 2}),
        defineField({name: 'quoteAttribution', type: 'string'}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Member login form'})},
})

export const collectionBlockTypes = [
  newsListBlock,
  galleryGridBlock,
  gearGridBlock,
  enquiryFormBlock,
  loginFormBlock,
]
