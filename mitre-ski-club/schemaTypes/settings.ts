import {defineType, defineField, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {MenuIcon} from '@sanity/icons/Menu'

/* ── Site settings (singleton) ─────────────────────────────── */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'contact', title: 'Contact'},
    {name: 'social', title: 'Social'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      type: 'string',
      group: 'general',
      initialValue: 'Mitre Ski Club',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'text',
      rows: 2,
      group: 'general',
      description: 'Short description in the footer.',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      group: 'general',
      description: 'Used for any page that has not set its own.',
    }),
    defineField({
      name: 'memberLoginLabel',
      title: 'Member login button label',
      type: 'string',
      group: 'general',
      initialValue: 'Member login',
    }),
    defineField({
      name: 'memberLoginHref',
      title: 'Member login link',
      type: 'string',
      group: 'general',
      initialValue: 'login.html',
    }),
    defineField({
      name: 'organisationName',
      type: 'string',
      group: 'contact',
      initialValue: 'Mitre Lodge',
    }),
    defineField({
      name: 'address',
      type: 'text',
      rows: 3,
      group: 'contact',
      description: 'One line per row.',
    }),
    defineField({
      name: 'email',
      type: 'string',
      group: 'contact',
      validation: (r) => r.email(),
    }),
    defineField({
      name: 'copyright',
      type: 'string',
      group: 'general',
      description: 'The line at the very bottom, e.g. "© 2026 Mitre Ski Club Inc."',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'social',
      of: [defineArrayMember({type: 'link'})],
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})

/* ── Navigation (singleton) ────────────────────────────────── */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'mainNav',
      title: 'Main menu',
      description: 'The links across the top of every page.',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      name: 'mobileExtras',
      title: 'Extra mobile menu links',
      description: 'Shown only in the mobile menu, below the main links.',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      name: 'footerGroups',
      title: 'Footer columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerGroup',
          fields: [
            defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'links', type: 'array', of: [defineArrayMember({type: 'link'})]}),
          ],
          preview: {
            select: {title: 'heading', links: 'links'},
            prepare: ({title, links}) => ({title, subtitle: `${(links || []).length} link(s)`}),
          },
        }),
      ],
      validation: (r) => r.max(4).warning('More than four columns will wrap awkwardly'),
    }),
    defineField({
      name: 'legalLinks',
      title: 'Bottom bar links',
      description: 'Privacy, Terms, etc.',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      name: 'builtByLine',
      title: 'Credit line',
      type: 'string',
      initialValue: 'Built by the Web Committee',
    }),
  ],
  preview: {prepare: () => ({title: 'Navigation'})},
})

/* ── Members band (singleton, appears above the footer) ────── */
export const memberBand = defineType({
  name: 'memberBand',
  title: 'Members band',
  type: 'document',
  icon: CogIcon,
  description: 'The dark blue band above the footer inviting members to log in.',
  fields: [
    defineField({name: 'eyebrow', type: 'string', initialValue: 'Members'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'body', type: 'text', rows: 2}),
    defineField({name: 'button', type: 'cta'}),
    defineField({name: 'footnote', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: 'Members band', subtitle: title}),
  },
})

export const settingsTypes = [siteSettings, navigation, memberBand]
