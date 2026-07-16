import {defineField, defineType} from 'sanity'

export const clientType = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: 'Company/client name, used as alt text if the logo itself has none set.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      type: 'image',
      description: 'Shown in the Clients section on the homepage and Info page.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the logo for accessibility and SEO.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Website',
      type: 'url',
      description: 'Optional. Makes the logo link out to the client\'s site.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'order',
      type: 'number',
      description:
        'Controls ordering in the Clients section: lower numbers show first. Leave blank to sort newest first.',
    }),
    defineField({
      name: 'displaySize',
      title: 'Display Size Adjustment',
      type: 'number',
      description:
        'Optional. Logos are all shown at the same height, but some (e.g. dense wordmarks like "Uber") still end up looking visually bigger than others. Nudge this down (e.g. 0.8) to shrink this logo relative to the rest, or up (e.g. 1.2) to grow it. Leave blank to use the default size of 1.',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
