import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Name of the product, e.g. "Game Review & Journal Tracker".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Short blurb shown under the name on the Shop page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priceLabel',
      title: 'Price',
      type: 'string',
      description:
        'How the price is displayed on the card, e.g. "$12", "Free", "From $8". This site never handles checkout itself, so this is just a label, not something charged automatically.',
    }),
    defineField({
      name: 'storefront',
      type: 'string',
      description:
        'Optional. Where this is actually sold, e.g. "Gumroad", "Etsy", "Notion Marketplace", "Shopify". Shown as a small tag on the card.',
    }),
    defineField({
      name: 'image',
      type: 'image',
      description: 'Product image or cover art shown on the Shop page.',
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
      name: 'url',
      title: 'Purchase Link',
      type: 'url',
      description:
        'Where the whole card links out to buy this — this site never sells anything directly, it just points here.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}).required(),
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Controls ordering on the Shop page: lower numbers show first. Leave blank to sort newest first.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'priceLabel',
      media: 'image',
    },
  },
})
