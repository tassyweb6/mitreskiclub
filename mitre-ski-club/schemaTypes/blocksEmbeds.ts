import {defineType, defineField, defineArrayMember} from 'sanity'
import {iconField} from './objects'

/* ── YouTube / live snow cam ───────────────────────────────── */
export const youtubeBlock = defineType({
  name: 'youtubeBlock',
  title: 'YouTube video / live cam',
  type: 'object',
  description: 'Embeds a YouTube video or live stream — used for the Mt Buller snow cams.',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description:
        'Paste any YouTube link — watch, youtu.be, live or embed. e.g. https://www.youtube.com/live/0OtVlfDj2w8',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Accessible title',
      type: 'string',
      description: 'Describes the video for screen readers, e.g. "Mt Buller live snow cam"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'height',
      title: 'Player height (px)',
      type: 'number',
      initialValue: 520,
      validation: (r) => r.min(200).max(900),
    }),
    defineField({name: 'moreLink', title: '"More" link', type: 'link'}),
    defineField({name: 'tintedBackground', title: 'Tinted background', type: 'boolean', initialValue: true}),
  ],
  preview: {
    select: {title: 'heading.heading', subtitle: 'url'},
    prepare: ({title, subtitle}) => ({title: title || 'YouTube / live cam', subtitle}),
  },
})

/* ── Google Map ────────────────────────────────────────────── */
export const mapBlock = defineType({
  name: 'mapBlock',
  title: 'Map',
  type: 'object',
  description: 'Embeds a Google Map. In Google Maps: Share → Embed a map → copy the src URL.',
  fields: [
    defineField({
      name: 'embedUrl',
      title: 'Google Maps embed URL',
      type: 'url',
      description: 'The src="…" value from the Google Maps embed code (starts with https://www.google.com/maps/embed)',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Accessible title',
      type: 'string',
      initialValue: 'Mitre Ski Club location',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'grayscale',
      title: 'Black and white',
      type: 'boolean',
      description: 'Desaturates the map to match the site palette.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'Map', subtitle: 'Google Maps embed'}),
  },
})

/* ── Instagram CTA ─────────────────────────────────────────── */
export const instagramBlock = defineType({
  name: 'instagramBlock',
  title: 'Instagram callout',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', initialValue: 'Follow us on Instagram'}),
    defineField({name: 'body', type: 'text', rows: 3}),
    defineField({
      name: 'handle',
      type: 'string',
      description: 'Without the @, e.g. mitreskiclub',
      validation: (r) => r.required(),
    }),
    defineField({name: 'footnote', type: 'array', of: [defineArrayMember({type: 'block'})]}),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'handle'},
    prepare: ({title, subtitle}) => ({title: title || 'Instagram callout', subtitle: subtitle && '@' + subtitle}),
  },
})

/* ── Generic iframe ────────────────────────────────────────── */
export const iframeBlock = defineType({
  name: 'iframeBlock',
  title: 'Embed (other)',
  type: 'object',
  description:
    'Embeds any third-party page in a frame — booking widgets, forms, weather services. Some sites block being embedded.',
  fields: [
    defineField({name: 'heading', type: 'sectionHeading'}),
    defineField({name: 'url', title: 'URL to embed', type: 'url', validation: (r) => r.required()}),
    defineField({
      name: 'title',
      title: 'Accessible title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'height',
      title: 'Height (px)',
      type: 'number',
      initialValue: 520,
      validation: (r) => r.min(200).max(1200),
    }),
    defineField({
      name: 'fallbackLink',
      title: 'Fallback link',
      description: 'Shown if the site refuses to be embedded.',
      type: 'link',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'url'},
    prepare: ({title, subtitle}) => ({title: title || 'Embed', subtitle}),
  },
})

/* ── Booking / external service callout ────────────────────── */
export const serviceLinkBlock = defineType({
  name: 'serviceLinkBlock',
  title: 'External service callout',
  type: 'object',
  description:
    'A panel that sends members to an external system — the bookings portal, a payment page, a form.',
  fields: [
    iconField(),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'body', type: 'text', rows: 2}),
    defineField({name: 'button', type: 'cta'}),
    defineField({name: 'footnote', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Service callout', subtitle: 'External service'}),
  },
})

export const embedBlockTypes = [youtubeBlock, mapBlock, instagramBlock, iframeBlock, serviceLinkBlock]
