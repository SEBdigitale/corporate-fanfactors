import type { CollectionConfig } from 'payload'

import { authenticated, publishedOnly } from './access'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOnly,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 80,
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        description: 'Lowercase URL slug, for example fan-owners-direct-pay.',
      },
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
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
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 220,
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'text',
      required: true,
    },
    {
      name: 'source',
      type: 'group',
      admin: {
        description: 'Static launch source metadata retained for the Payload migration.',
      },
      fields: [
        {
          name: 'staticFile',
          type: 'text',
        },
        {
          name: 'featuredImagePath',
          type: 'text',
        },
        {
          name: 'socialImagePath',
          type: 'text',
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
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
          maxLength: 320,
          required: true,
        },
        {
          name: 'aiSummary',
          type: 'textarea',
          maxLength: 300,
        },
      ],
    },
  ],
  versions: {
    drafts: true,
  },
}
