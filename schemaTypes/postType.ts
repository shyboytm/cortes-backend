import {defineField, defineType} from 'sanity'

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

const imageAspectRatioOptions = {
  list: [
    {title: 'Original', value: 'original'},
    {title: 'Square (1:1)', value: '1:1'},
    {title: 'Standard (4:3)', value: '4:3'},
    {title: 'Classic (3:2)', value: '3:2'},
    {title: 'Widescreen (16:9)', value: '16:9'},
    {title: 'Portrait (9:16)', value: '9:16'},
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
            defineField({
              name: 'ratio',
              title: 'Aspect Ratio',
              type: 'string',
              description: 'Crop the image to this ratio, or leave as Original to use the image\'s natural ratio.',
              options: imageAspectRatioOptions,
              initialValue: 'original',
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
          name: 'videoEmbed',
          title: 'Video Embed (YouTube/Vimeo link)',
          fields: [
            defineField({
              name: 'url',
              title: 'Video URL',
              type: 'url',
              description:
                'Paste a YouTube or Vimeo link — the watch page, a share link, or a youtu.be short '
                + 'link all work. Anything else renders as a plain "Watch video" link instead of an '
                + 'embedded player.',
              validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
            }),
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
                + 'video or an "End offset" marker below it ends the pairing).',
              options: mediaLayoutOptions,
              initialValue: 'inset',
            }),
          ],
          preview: {
            select: {url: 'url', caption: 'caption'},
            prepare({url, caption}: {url?: string; caption?: string}) {
              return {title: caption || 'Video embed', subtitle: url}
            },
          },
        },
        {
          type: 'code',
          title: 'Code Block',
          options: {
            withFilename: true,
          },
        },
        {
          type: 'object',
          name: 'imageCarousel',
          title: 'Image Carousel',
          description:
            'A full-width, swipeable image carousel with next/previous controls. Add 2 or more images, '
            + 'each with an optional caption shown under it while it\'s active.',
          fields: [
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [
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
                      description: 'Optional caption shown under this image while it\'s active in the carousel.',
                    }),
                  ],
                },
              ],
              validation: (rule) => rule.min(2).error('Add at least 2 images to make a carousel.'),
            }),
          ],
          preview: {
            select: {images: 'images'},
            prepare({images}: {images?: unknown[]}) {
              const count = images?.length ?? 0
              return {
                title: 'Image Carousel',
                subtitle: `${count} image${count === 1 ? '' : 's'}`,
              }
            },
          },
        },
        {
          type: 'object',
          name: 'divider',
          title: 'Divider',
          description: 'Renders a horizontal rule to visually separate sections.',
          fields: [
            defineField({
              name: 'note',
              type: 'string',
              hidden: true,
              readOnly: true,
              initialValue: 'Renders a horizontal rule divider.',
            }),
          ],
          preview: {
            prepare() {
              return {title: 'Divider', subtitle: '—————————'}
            },
          },
        },
        {
          type: 'object',
          name: 'endOffset',
          title: 'End Offset Media',
          description:
            'Insert this where you want an "Offset left" image, video, or video embed above to stop '
            + 'being pinned, so it doesn\'t stay stuck for the rest of the post. Everything after this '
            + 'marker goes back to normal full-column flow. Doesn\'t render anything itself.',
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
