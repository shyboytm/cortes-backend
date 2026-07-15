import {defineField, defineType} from 'sanity'

export const musicReleaseType = defineType({
  name: 'musicRelease',
  title: 'Music Release',
  type: 'document',
  fields: [
    defineField({
      name: 'artwork',
      title: 'Artwork',
      type: 'image',
      description: 'Cover art for this release — shown in the releases grid on the Music page.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the artwork for accessibility and SEO.',
        }),
      ],
    }),
    defineField({
      name: 'title',
      type: 'string',
      description: 'The release\'s name (album, EP, remix, or single title).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artist',
      type: 'string',
      description: 'Which project this release is under.',
      options: {
        list: [
          {title: 'Cordio', value: 'Cordio'},
          {title: 'HORIZON ✶ RADAR', value: 'HORIZON ✶ RADAR'},
        ],
        layout: 'radio',
      },
      initialValue: 'Cordio',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'releaseType',
      title: 'Release Type',
      type: 'string',
      options: {
        list: [
          {title: 'Album', value: 'album'},
          {title: 'EP', value: 'ep'},
          {title: 'Remix', value: 'remix'},
          {title: 'Single', value: 'single'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'genre',
      type: 'string',
      description: 'e.g. Ambient, Lo-fi, Hip-Hop, Jazz, Electronic.',
    }),
    defineField({
      name: 'releaseYear',
      title: 'Release Year',
      type: 'string',
      description: 'Four-digit year the release came out, e.g. 2024.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^\d{4}$/, {name: 'YYYY', invert: false})
          .error('Enter a four-digit year, e.g. 2024.'),
    }),
    defineField({
      name: 'link',
      title: 'Listen Link',
      type: 'url',
      description: 'Where "listen" points to — Bandcamp, Spotify, or wherever this release lives.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}).required(),
    }),
    defineField({
      name: 'order',
      type: 'number',
      description:
        'Optional — use to fine-tune ordering among releases from the same year. Lower numbers show first. Leave blank to sort by year, newest first.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'artist',
      media: 'artwork',
    },
  },
})
