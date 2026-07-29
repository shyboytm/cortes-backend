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

export const workType = defineType({
  name: 'work',
  title: 'Work',
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
      name: 'dateRange',
      title: 'Date range',
      type: 'string',
      description:
        'Shown under the title on the homepage, e.g. "2024 - Present" or "2022 - 2023". Also shown as "Year" in the case study meta grid.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      description: 'Your role on this project, e.g. "Lead Product Designer". Shown in the case study meta grid.',
    }),
    defineField({
      name: 'scope',
      type: 'string',
      description: 'What the work covered, e.g. "Product Strategy, UX/UI, Design Systems". Shown in the case study meta grid.',
    }),
    defineField({
      name: 'industry',
      type: 'string',
      description: 'The industry or space this project was for, e.g. "Fintech". Shown in the case study meta grid.',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description:
        'Optional one-liner shown as the subtitle on this project\'s case study page, in place of the date range. The homepage and Work index still show the date range regardless.',
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Controls homepage ordering: lower numbers show first. Leave blank to sort newest first.',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Incremented (or decremented) by the like button on this project\'s case study page, not meant to be edited by hand.',
    }),
    defineField({
      name: 'comingSoon',
      title: 'Coming Soon',
      type: 'boolean',
      initialValue: false,
      description:
        'Optional. When on, this project shows a "Coming soon" tag instead of a link on the homepage and Work index, and its case study page isn\'t publicly reachable — so you can keep building it out without it being live yet.',
    }),
    defineField({
      name: 'comingSoonPassword',
      title: 'Preview Password',
      type: 'string',
      hidden: ({parent}) => !parent?.comingSoon,
      description:
        'Optional. If set while Coming Soon is on, anyone who knows this password can open the case study\'s direct link, enter it, and view the full page early. Leave empty to keep the case study fully hidden from everyone.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      description:
        'The thumbnail shown by default for this project on the homepage. Cropped to a consistent 4:3 box (using the hotspot below), so every project\'s thumbnail is the same size regardless of the original image\'s shape.',
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
      name: 'hoverImage',
      title: 'Hover Image',
      type: 'image',
      description:
        'Optional. If set, the homepage thumbnail swaps to this image when hovered, also cropped to the same consistent 4:3 box. Leave empty to keep the main image on hover too.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for accessibility and SEO.',
        }),
      ],
    }),
    defineField({
      name: 'photos',
      title: 'Photos (legacy)',
      type: 'array',
      description:
        'Not currently shown anywhere on the site. The homepage thumbnail now uses Main Image / Hover Image instead. Kept around in case these get used for a project gallery later.',
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
          ],
        },
      ],
    }),
    defineField({
      name: 'caseStudy',
      title: 'Case Study',
      type: 'array',
      description:
        'Optional. Write the full case study for this project here, text and images can be mixed freely. If this has any content, this project\'s homepage thumbnail becomes clickable and links to its case study page. Leave empty to keep it as a static preview.',
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
              description: 'How this image sits in the case study: inset (matches the text column), half '
                + 'or third (pairs with 1 or 2 more images or videos of the same size right after it, '
                + 'side-by-side), wide (breaks past the text column), full (edge-to-edge bleed), or offset '
                + 'left (pins the image in a sticky left column while every block after it, headings and '
                + 'images included, runs alongside it in a right column, until the next offset-left image/'
                + 'video or an "End offset" marker below it ends the pairing).',
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
              description: 'How this video sits in the case study: inset (matches the text column), half '
                + 'or third (pairs with 1 or 2 more images or videos of the same size right after it, '
                + 'side-by-side), wide (breaks past the text column), full (edge-to-edge bleed), or offset '
                + 'left (pins the video in a sticky left column while every block after it, headings and '
                + 'images included, runs alongside it in a right column, until the next offset-left image/'
                + 'video or an "End offset" marker below it ends the pairing).',
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
              description: 'How this video sits in the case study: inset (matches the text column), half '
                + 'or third (pairs with 1 or 2 more images or videos of the same size right after it, '
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
            + 'being pinned, so it doesn\'t stay stuck for the rest of the case study. Everything after '
            + 'this marker goes back to normal full-column flow. Doesn\'t render anything itself.',
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
  preview: {
    select: {
      title: 'title',
      subtitle: 'dateRange',
      media: 'mainImage',
      comingSoon: 'comingSoon',
    },
    prepare({title, subtitle, media, comingSoon}) {
      return {
        title,
        subtitle: comingSoon ? `${subtitle} · Coming soon` : subtitle,
        media,
      }
    },
  },
})
