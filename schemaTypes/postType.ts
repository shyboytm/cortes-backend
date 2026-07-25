import {defineField, defineType} from 'sanity'

// Shared by both the image and video body blocks below so their "Layout"
// field stays in lockstep — same options, same default, same radio layout —
// without maintaining two copies of the list.
const mediaLayoutOptions = {
  list: [
    {title: 'Inset (default)', value: 'inset'},
    {title: 'Half width (2 across)', value: 'half'},
    {title: 'Third width (3 across)', value: 'third'},
    {title: 'Wide', value: 'wide'},
    {title: 'Full bleed', value: 'full'},
    {title: 'Offset left (pins it, text runs alongside)', value: 'offsetLeft'},
  ],
  layout: 'radio' as const,
}

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
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'H5', value: 'h5'},
            {title: 'H6', value: 'h6'},
            {title: 'Quote', value: 'blockquote'},
          ],
        },
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
                + 'third (pairs with 1 or 2 more images or videos of the same size right after it, '
                + 'side-by-side), wide (breaks past the text column), full (edge-to-edge bleed), or offset '
                + 'left (pins the image in a sticky left column while every block after it, headings and '
                + 'images included, runs alongside it in a right column, until the next offset-left image/'
                + 'video or an "End offset image" marker below it ends the pairing).',
              options: mediaLayoutOptions,
              initialValue: 'inset',
            }),
          ],
        },
        {
          type: 'file',
          name: 'video',
          title: 'Video',
          options: {accept: 'video/*'},
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional italic caption shown under the video on the site.',
            }),
            defineField({
              name: 'size',
              title: 'Layout',
              type: 'string',
              description: 'How this video sits in the post: inset (matches the text column), half or '
                + 'third (pairs with 1 or 2 more images or videos of the same size right after it, '
                + 'side-by-side), wide (breaks past the text column), full (edge-to-edge bleed), or offset '
                + 'left (pins the video in a sticky left column while every block after it, headings and '
                + 'images included, runs alongside it in a right column, until the next offset-left image/'
                + 'video or an "End offset image" marker below it ends the pairing).',
              options: mediaLayoutOptions,
              initialValue: 'inset',
            }),
          ],
        },
        {
          type: 'object',
          name: 'endOffset',
          title: 'End Offset Media',
          description:
            'Insert this where you want an "Offset left" image or video above to stop being pinned, so '
            + 'it doesn\'t stay stuck for the rest of the post. Everything after this marker goes back to '
            + 'normal full-column flow. Doesn\'t render anything itself.',
          fields: [
            defineField({
              name: 'note',
              type: 'string',
              hidden: true,
              readOnly: true,
              initialValue: 'Ends the sticky offset-left image/video above this point.',
            }),
          ],
          preview: {
            prepare() {
              return {title: 'End offset media', subtitle: 'Stops the pinned image/video above this point'}
            },
          },
        },
      ],
    }),
  ],
})
