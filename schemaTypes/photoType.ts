import {defineField, defineType} from 'sanity'

export const photoType = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Shows up on the Photos page grid and in the lightbox. Any orientation works.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for accessibility and SEO.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional. Shown underneath the image when it\'s open in the lightbox.',
    }),
    defineField({
      name: 'camera',
      title: 'Camera',
      type: 'string',
      description: 'Optional. Camera body used, e.g. "Fujifilm X-M5". Shown in the lightbox.',
    }),
    defineField({
      name: 'lens',
      title: 'Lens',
      type: 'string',
      description: 'Optional. Lens used, e.g. "Fujifilm XF23mmF2.8 R WR". Shown in the lightbox.',
    }),
    defineField({
      name: 'dateTaken',
      title: 'Date Taken',
      type: 'date',
      description: 'Optional. When the photo was actually shot. Shown in the lightbox.',
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Controls ordering on the Photos page: lower numbers show first. Leave blank to sort newest first.',
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
