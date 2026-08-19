import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const galleryPhoto = defineType({
  name: 'galleryPhoto',
  title: 'Gallery Photo',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
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
      name: 'caption',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'context',
      title: 'Context line',
      description: 'e.g. "July 2025" or "Lodge crew"',
      type: 'string',
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          {title: 'On the mountain', value: 'mountain'},
          {title: 'Lodge life', value: 'lodge'},
          {title: 'Working bees', value: 'bee'},
          {title: 'Off-season', value: 'summer'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'caption', subtitle: 'category', media: 'image'},
  },
})
