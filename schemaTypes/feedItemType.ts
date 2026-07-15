import {defineField, defineType} from 'sanity'

export const feedItemType = defineType({
  name: 'feedItem',
  title: 'Feed',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description:
        'Shows up on the Feed grid. Any size/shape works — the grid lays itself out around whatever you upload. Leave empty if you\'re uploading a video below instead.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for accessibility and SEO.',
        }),
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const video = (context.document as {video?: unknown} | undefined)?.video
          if (!value && !video) return 'Add an image or a video below.'
          return true
        }),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      description:
        'Alternative to Image above — upload a short video instead. Plays silently on a loop in the Feed grid. Leave empty if this entry is an image.',
      options: {accept: 'video/*'},
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional. Shown small, left-aligned, directly under the image or video on the Feed grid.',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      description:
        'Optional. If set, the whole item becomes clickable and opens this link in a new tab — it also gets the same hover arrow used on Work project cards.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Controls Feed grid ordering — lower numbers show first. Leave blank to sort newest first.',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Incremented by the like button on the site — not meant to be edited by hand.',
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: title || 'Untitled',
        media,
      }
    },
  },
})
