import {defineField, defineType} from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'company',
      type: 'string',
      description: 'Company name, e.g. "Instagram".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      description: 'Your title there, e.g. "Staff PD, Growth".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'period',
      type: 'string',
      description: 'Shown above the logo, e.g. "2021" or "2012 - 2016".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      type: 'image',
      description: 'Square logo/icon, shown as a circle in the timeline.',
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
      description: "Optional. Makes the entry link out to the company's site.",
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'order',
      type: 'number',
      description:
        'Controls left-to-right ordering in the timeline: lower numbers show first (earliest). Leave blank to sort oldest first.',
    }),
  ],
  preview: {
    select: {
      title: 'company',
      subtitle: 'role',
      media: 'logo',
    },
  },
})
