import {defineField, defineType} from 'sanity'

export const commentType = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: 'The name the commenter entered.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'message',
      type: 'text',
      rows: 4,
      description: 'The comment itself.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'parent',
      type: 'reference',
      to: [{type: 'post'}, {type: 'work'}],
      description: 'The Writing post or Work project this comment was left on.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description:
        'Comments are hidden from the site until this is turned on, so spam and abuse can be screened out before anything goes public.',
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      name: 'name',
      message: 'message',
      approved: 'approved',
      parentTitle: 'parent.title',
    },
    prepare({
      name,
      message,
      approved,
      parentTitle,
    }: {
      name?: string
      message?: string
      approved?: boolean
      parentTitle?: string
    }) {
      return {
        title: `${name || 'Anonymous'}${approved ? '' : ' (pending approval)'}`,
        subtitle: [parentTitle, message].filter(Boolean).join(' — '),
      }
    },
  },
})
