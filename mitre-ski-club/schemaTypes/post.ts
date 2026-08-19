import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const post = defineType({
  name: 'post',
  title: 'News Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Snow report', value: 'Snow report'},
          {title: 'Notice', value: 'Notice'},
          {title: 'Working bee', value: 'Working bee'},
          {title: 'Used gear', value: 'Used gear'},
          {title: 'Season', value: 'Season'},
          {title: 'Off-season', value: 'Off-season'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readingTimeMinutes',
      title: 'Reading time (minutes)',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{type: 'block'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'mainImage'},
  },
})
