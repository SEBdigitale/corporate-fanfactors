import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from './access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'alt',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'card',
        width: 800,
      },
      {
        name: 'social',
        height: 630,
        width: 1200,
      },
    ],
    staticDir: 'public/media',
  },
}
