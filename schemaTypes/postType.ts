import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Incremented by the like button on the site, not meant to be edited by hand.',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Describe the image for accessibility and SEO.',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional italic caption shown under the image on the site.',
            }),
            defineField({
              name: 'size',
              title: 'Layout',
              type: 'string',
              description: 'How this image sits in the post: inset (matches the text column), half or '
                + 'third (pairs with 1 or 2 more images of the same size right after it, side-by-side), '
                + 'wide (breaks past the text column), full (edge-to-edge bleed), or offset left (pins the '
                + 'image in a sticky left column while every block after it, headings and images included, '
                + 'runs alongside it in a right column, until the next offset-left image starts a new pair).',
              options: {
                list: [
                  {title: 'Inset (default)', value: 'inset'},
                  {title: 'Half width (2 across)', value: 'half'},
                  {title: 'Third width (3 across)', value: 'third'},
                  {title: 'Wide', value: 'wide'},
                  {title: 'Full bleed', value: 'full'},
                  {title: 'Offset left (pins image, text runs alongside)', value: 'offsetLeft'},
                ],
                layout: 'radio',
              },
              initialValue: 'inset',
            }),
          ],
        },
      ],
    }),
  ],
})
