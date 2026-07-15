import {defineField, defineType} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      type: 'text',
      rows: 5,
      description: 'The full quote, in the person\'s own words.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      description: 'Who said it, e.g. "Jimmy".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role & Company',
      type: 'string',
      description: 'e.g. "Sr Designer @ Community" — shown after the name.',
    }),
    defineField({
      name: 'order',
      type: 'number',
      description:
        'Controls ordering in the "What Others Say" section — lower numbers show first. Leave blank to sort newest first.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
    },
  },
})
