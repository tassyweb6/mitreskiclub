import {defineType, defineField} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

export const gearListing = defineType({
  name: 'gearListing',
  title: 'Gear Listing',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Skis', value: 'Skis'},
          {title: 'Kids skis', value: 'Kids skis'},
          {title: 'Boots', value: 'Boots'},
          {title: 'Jacket', value: 'Jacket'},
          {title: 'Helmet', value: 'Helmet'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'size',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (AUD)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Reserved', value: 'reserved'},
          {title: 'Sold', value: 'sold'},
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seller',
      title: 'Seller name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'postedAt',
      title: 'Posted date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
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
      name: 'description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'status', media: 'image'},
  },
})
