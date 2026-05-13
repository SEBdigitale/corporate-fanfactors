import type { CollectionConfig } from 'payload'

import { syncLegacyStatusWithDraftStatus } from './hooks/syncLegacyStatusWithDraftStatus'
import { authenticated, publishedOnly } from './access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOnly,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    useAsTitle: 'title',
  },
  hooks: {
    beforeValidate: [syncLegacyStatusWithDraftStatus],
  },
  lockDocuments: {
    duration: 30000,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      required: true,
      unique: true,
    },
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'draft',
      name: 'status',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      required: true,
      type: 'select',
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          maxLength: 70,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 160,
          required: true,
        },
      ],
    },
  ],
  versions: {
    drafts: true,
  },
}
