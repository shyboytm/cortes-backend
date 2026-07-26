import {defineField, defineType} from 'sanity'

const PAGE_OPTIONS = [
  {title: 'Home', value: 'home'},
  {title: 'Work (index)', value: 'work'},
  {title: 'Music', value: 'music'},
  {title: 'Photos', value: 'photos'},
  {title: 'Writing (index)', value: 'writing'},
  {title: 'Shop', value: 'shop'},
  {title: 'Recs', value: 'recs'},
  {title: 'About', value: 'about'},
]

export const pageMetaType = defineType({
  name: 'pageMeta',
  title: 'Page Metadata',
  type: 'document',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      description: 'Which page this metadata is for. Only create one of these per page — if more than one '
        + 'exists for the same page, the site just uses whichever one Sanity returns first.',
      options: {list: PAGE_OPTIONS},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Browser tab title and link-preview title. Leave blank to use the site\'s default title '
        + 'for this page.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Link-preview description shown by social apps, iMessage, Slack, etc. Leave blank to use '
        + 'the site\'s default description for this page.',
    }),
    defineField({
      name: 'image',
      title: 'Preview Image',
      type: 'image',
      description: 'Link-preview image. 1200x630 (or close to that ratio) works best — most apps crop to '
        + 'that box. Leave blank to use the site\'s default preview image.',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {page: 'page', title: 'title', media: 'image'},
    prepare({page, title, media}) {
      const label = PAGE_OPTIONS.find((option) => option.value === page)?.title || page || 'Untitled'
      return {title: label, subtitle: title, media}
    },
  },
})
