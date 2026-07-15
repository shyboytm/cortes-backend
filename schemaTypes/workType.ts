import {defineField, defineType} from 'sanity'

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
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'dateRange',
      media: 'mainImage',
    },
  },
})
