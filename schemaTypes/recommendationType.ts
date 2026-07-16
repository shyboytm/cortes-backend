import {defineField, defineType} from 'sanity'

export const recommendationType = defineType({
  name: 'recommendation',
  title: 'Recommendation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      description: 'Name of the site, tool, book, blog, or whatever else you\'re recommending.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      description: 'Groups recommendations into sections on the Recs page.',
      options: {
        list: [
          {title: 'Resource', value: 'resource'},
          {title: 'Book', value: 'book'},
          {title: 'Podcast', value: 'podcast'},
          {title: 'Video', value: 'video'},
          {title: 'Blog & Article', value: 'blog'},
          {title: 'App', value: 'app'},
          {title: 'Music', value: 'music'},
          {title: 'Gear', value: 'gear'},
          {title: 'Website', value: 'website'},
        ],
        layout: 'radio',
      },
      initialValue: 'resource',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      description: 'Which platform this app is for, shown as a small tag next to the name. Only used for Apps.',
      options: {
        list: [
          {title: 'iOS', value: 'ios'},
          {title: 'iPad', value: 'ipad'},
          {title: 'Mac', value: 'mac'},
          {title: 'Android', value: 'android'},
          {title: 'Web', value: 'web'},
          {title: 'All Platforms', value: 'all'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => (parent as {category?: string})?.category !== 'app',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Why you recommend it, shown under the name on the Recs page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      description: 'Where the name links out to.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}).required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Optional. A logo, icon, or cover image shown alongside this recommendation.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for accessibility and SEO.',
        }),
      ],
    }),
    defineField({
      name: 'hoverPreview',
      title: 'Hover Preview',
      type: 'image',
      description:
        'Optional. Shown in the little browser-window preview card that appears when hovering this recommendation on the Recs page. Leave empty to skip the preview for this item.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for accessibility and SEO.',
        }),
      ],
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Controls ordering within its category: lower numbers show first. Leave blank to sort newest first.',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Incremented by the like button on the site, not meant to be edited by hand.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
})
