import {defineField, defineType} from 'sanity'

export const pressMentionType = defineType({
  name: 'pressMention',
  title: 'Press Mention',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'The headline/piece title, or the award name.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'outlet',
      type: 'string',
      description: 'Who featured you: the publication, channel, or org giving the award.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Article', value: 'article'},
          {title: 'Video', value: 'video'},
          {title: 'Podcast', value: 'podcast'},
          {title: 'Award', value: 'award'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'radio',
      },
      initialValue: 'article',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      description: 'Where this points to. Leave blank for an award with nothing to link to.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'date',
      type: 'date',
      description: 'When this ran/was awarded, shown next to the outlet name.',
    }),
    defineField({
      name: 'image',
      type: 'image',
      description: 'Optional. An article thumbnail, video still, or award badge.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'order',
      type: 'number',
      description:
        'Controls ordering in the In the Press section: lower numbers show first. Leave blank to sort newest first.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'outlet',
      media: 'image',
    },
  },
})
