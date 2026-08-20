import {defineType, defineField, defineArrayMember} from 'sanity'
import {iconField} from './objects'

/* ── Home hero ─────────────────────────────────────────────── */
export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', type: 'string', description: 'e.g. "Mt Buller · Est. 1962"'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'headingEmphasis',
      title: 'Heading — italic second line',
      type: 'string',
      description: 'Rendered in italic serif beneath the heading, e.g. "on the mountain."',
    }),
    defineField({name: 'lead', type: 'text', rows: 3}),
    defineField({name: 'ctas', title: 'Buttons', type: 'array', of: [defineArrayMember({type: 'cta'})]}),
    defineField({
      name: 'backgroundVideoUrl',
      title: 'Background video',
      type: 'string',
      description: 'Path to a video in the site assets, e.g. assets/hero1-opt.mp4',
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster / fallback image',
      type: 'figure',
      description: 'Shown while the video loads, and on devices that block autoplay.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sideImage',
      title: 'Card image',
      type: 'figure',
      description: 'The floating card to the right of the heading.',
    }),
    defineField({name: 'sideImageTitle', title: 'Card title', type: 'string'}),
    defineField({name: 'sideImageSubtitle', title: 'Card subtitle', type: 'string'}),
    defineField({name: 'stats', type: 'array', of: [defineArrayMember({type: 'statItem'})]}),
  ],
  preview: {
    select: {title: 'heading', media: 'posterImage'},
    prepare: ({title, media}) => ({title: title || 'Hero', subtitle: 'Hero', media}),
  },
})

/* ── Rich text ─────────────────────────────────────────────── */
export const richTextBlock = defineType({
  name: 'richTextBlock',
  title: 'Text',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({name: 'content', type: 'array', of: [defineArrayMember({type: 'block'})]}),
    defineField({
      name: 'width',
      type: 'string',
      options: {
        list: [
          {title: 'Article width', value: 'article'},
          {title: 'Full width', value: 'wide'},
        ],
        layout: 'radio',
      },
      initialValue: 'article',
    }),
    defineField({name: 'tintedBackground', title: 'Tinted background', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'heading.heading'},
    prepare: ({title}) => ({title: title || 'Text', subtitle: 'Text'}),
  },
})

/* ── Feature grid ──────────────────────────────────────────── */
export const featureGridBlock = defineType({
  name: 'featureGridBlock',
  title: 'Feature grid',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({
      name: 'features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            iconField(),
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'body', type: 'text', rows: 3}),
            defineField({name: 'badge', type: 'string', description: 'Optional chip above the title, e.g. a date'}),
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({name: 'tintedBackground', title: 'Tinted background', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'heading.heading', features: 'features'},
    prepare: ({title, features}) => ({
      title: title || 'Feature grid',
      subtitle: `Feature grid · ${(features || []).length} item(s)`,
    }),
  },
})

/* ── Full-bleed quote ──────────────────────────────────────── */
export const quoteBlock = defineType({
  name: 'quoteBlock',
  title: 'Full-width quote',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'quote', type: 'text', rows: 3, validation: (r) => r.required()}),
    defineField({name: 'attribution', type: 'string'}),
    defineField({name: 'backgroundImage', type: 'figure', validation: (r) => r.required()}),
  ],
  preview: {
    select: {title: 'quote', media: 'backgroundImage'},
    prepare: ({title, media}) => ({title: title || 'Quote', subtitle: 'Full-width quote', media}),
  },
})

/* ── CTA band ──────────────────────────────────────────────── */
export const ctaBandBlock = defineType({
  name: 'ctaBandBlock',
  title: 'Call-to-action band',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'body', type: 'text', rows: 2}),
    defineField({name: 'button', type: 'cta'}),
    defineField({name: 'footnote', type: 'string', description: 'Small line under the button'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'CTA band', subtitle: 'Call-to-action band'}),
  },
})

/* ── Notice ────────────────────────────────────────────────── */
export const noticeBlock = defineType({
  name: 'noticeBlock',
  title: 'Notice',
  type: 'object',
  fields: [
    iconField(),
    defineField({name: 'content', type: 'array', of: [defineArrayMember({type: 'block'})], validation: (r) => r.required()}),
  ],
  preview: {prepare: () => ({title: 'Notice', subtitle: 'Highlighted note'})},
})

/* ── Conditions strip ──────────────────────────────────────── */
export const conditionsStripBlock = defineType({
  name: 'conditionsStripBlock',
  title: 'Snow conditions strip',
  type: 'object',
  description: 'The dark bar of current conditions. Update these figures during the season.',
  fields: [
    defineField({
      name: 'updatedLabel',
      title: 'Updated label',
      type: 'string',
      description: 'Free text, e.g. "Updated 7 min ago · 5 May 2026, 7:42 AM"',
    }),
    defineField({name: 'showLiveChip', title: 'Show "Live" chip', type: 'boolean', initialValue: true}),
    defineField({
      name: 'stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'conditionStat',
          fields: [
            iconField(),
            defineField({name: 'value', type: 'string', description: 'e.g. "142 cm"', validation: (r) => r.required()}),
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'detail', type: 'string', description: 'e.g. "Bourke Street"'}),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
    }),
    defineField({name: 'reportLink', title: 'Report link', type: 'link'}),
  ],
  preview: {prepare: () => ({title: 'Snow conditions strip', subtitle: 'Live conditions bar'})},
})

/* ── Forecast ──────────────────────────────────────────────── */
export const forecastBlock = defineType({
  name: 'forecastBlock',
  title: 'Weather forecast',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({
      name: 'days',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'forecastDay',
          fields: [
            defineField({name: 'day', type: 'string', description: 'e.g. "Tue"', validation: (r) => r.required()}),
            defineField({name: 'date', type: 'string', description: 'Day of month, e.g. "5"'}),
            iconField(),
            defineField({name: 'high', type: 'string', description: 'e.g. "−2"'}),
            defineField({name: 'low', type: 'string', description: 'e.g. "−8"'}),
            defineField({name: 'snowCm', title: 'Snow (cm)', type: 'string'}),
          ],
          preview: {select: {title: 'day', subtitle: 'high'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Weather forecast', subtitle: '7-day outlook'})},
})

/* ── Reviews ───────────────────────────────────────────────── */
export const reviewsBlock = defineType({
  name: 'reviewsBlock',
  title: 'Reviews',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({
      name: 'score',
      type: 'string',
      description: 'Headline rating, e.g. "4.8"',
    }),
    defineField({name: 'scoreCaption', type: 'string', description: 'e.g. "Based on Google reviews"'}),
    defineField({name: 'allReviewsLink', title: 'All reviews link', type: 'link'}),
    defineField({
      name: 'reviews',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'review',
          fields: [
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'initials',
              type: 'string',
              description: 'Shown in the avatar circle, e.g. "JT"',
              validation: (r) => r.max(3),
            }),
            defineField({name: 'rating', type: 'number', validation: (r) => r.required().min(1).max(5)}),
            defineField({name: 'date', type: 'string', description: 'e.g. "March 2026"'}),
            defineField({name: 'text', type: 'text', rows: 4, validation: (r) => r.required()}),
            defineField({name: 'attribution', type: 'string', initialValue: 'Verified member'}),
          ],
          preview: {select: {title: 'name', subtitle: 'text'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {score: 'score', reviews: 'reviews'},
    prepare: ({score, reviews}) => ({
      title: 'Reviews',
      subtitle: `${score || '—'} · ${(reviews || []).length} review(s)`,
    }),
  },
})

/* ── Anchored info sections (The Lodge) ────────────────────── */
export const infoSectionsBlock = defineType({
  name: 'infoSectionsBlock',
  title: 'Info sections with sidebar',
  type: 'object',
  description: 'Long-form sections with a sticky "On this page" list beside them.',
  fields: [
    defineField({name: 'sidebarTitle', type: 'string', initialValue: 'On this page'}),
    defineField({
      name: 'sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'infoSection',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'anchor',
              type: 'slug',
              options: {source: 'title', maxLength: 40},
              description: 'Used for the #link in the sidebar.',
              validation: (r) => r.required(),
            }),
            defineField({name: 'content', type: 'array', of: [defineArrayMember({type: 'block'})]}),
            defineField({name: 'image', type: 'figure'}),
            defineField({
              name: 'cards',
              title: 'Small cards',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'infoCard',
                  fields: [
                    defineField({name: 'title', type: 'string'}),
                    defineField({name: 'detail', type: 'string'}),
                  ],
                  preview: {select: {title: 'title', subtitle: 'detail'}},
                }),
              ],
            }),
            defineField({name: 'button', type: 'cta'}),
          ],
          preview: {select: {title: 'title', media: 'image'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {sections: 'sections'},
    prepare: ({sections}) => ({
      title: 'Info sections',
      subtitle: `${(sections || []).length} section(s)`,
    }),
  },
})

/* ── Contact list ──────────────────────────────────────────── */
export const contactListBlock = defineType({
  name: 'contactListBlock',
  title: 'Contact list',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({
      name: 'contacts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contactItem',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'value', type: 'string', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Contact list', subtitle: 'Label / value rows'})},
})

/* ── Link list ─────────────────────────────────────────────── */
export const linkListBlock = defineType({
  name: 'linkListBlock',
  title: 'Link list',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({name: 'links', type: 'array', of: [defineArrayMember({type: 'link'})]}),
  ],
  preview: {
    select: {links: 'links'},
    prepare: ({links}) => ({title: 'Link list', subtitle: `${(links || []).length} link(s)`}),
  },
})

/* ── Useful link cards ─────────────────────────────────────── */
export const linkCardsBlock = defineType({
  name: 'linkCardsBlock',
  title: 'Link cards',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({
      name: 'cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'linkCard',
          fields: [
            iconField(),
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'subtitle', type: 'string'}),
            defineField({name: 'href', title: 'URL', type: 'string', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'title', subtitle: 'subtitle'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {cards: 'cards'},
    prepare: ({cards}) => ({title: 'Link cards', subtitle: `${(cards || []).length} card(s)`}),
  },
})

/* ── Address ───────────────────────────────────────────────── */
export const addressBlock = defineType({
  name: 'addressBlock',
  title: 'Address panel',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', initialValue: 'Address'}),
    defineField({name: 'content', type: 'array', of: [defineArrayMember({type: 'block'})]}),
  ],
  preview: {prepare: () => ({title: 'Address panel'})},
})

/* ── Step-by-step directions ───────────────────────────────── */
export const stepsBlock = defineType({
  name: 'stepsBlock',
  title: 'Step-by-step (tabbed)',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({
      name: 'tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stepTab',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            iconField(),
            defineField({
              name: 'steps',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'step',
                  fields: [
                    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
                    defineField({name: 'body', type: 'text', rows: 3}),
                  ],
                  preview: {select: {title: 'title', subtitle: 'body'}},
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'label', steps: 'steps'},
            prepare: ({title, steps}) => ({title, subtitle: `${(steps || []).length} step(s)`}),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {tabs: 'tabs'},
    prepare: ({tabs}) => ({title: 'Step-by-step', subtitle: `${(tabs || []).length} tab(s)`}),
  },
})

export const contentBlockTypes = [
  heroBlock,
  richTextBlock,
  featureGridBlock,
  quoteBlock,
  ctaBandBlock,
  noticeBlock,
  conditionsStripBlock,
  forecastBlock,
  reviewsBlock,
  infoSectionsBlock,
  contactListBlock,
  linkListBlock,
  linkCardsBlock,
  addressBlock,
  stepsBlock,
]
