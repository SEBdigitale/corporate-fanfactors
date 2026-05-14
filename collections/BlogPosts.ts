import type { CollectionConfig } from 'payload'

import { normalizeBlogClusterCategory } from './hooks/normalizeBlogClusterCategory'
import { normalizeBlogPostSlug } from './hooks/normalizeBlogPostSlug'
import { sanitizeBlogPostFields } from './hooks/sanitizeBlogPostFields'
import { syncLegacyStatusWithDraftStatus } from './hooks/syncLegacyStatusWithDraftStatus'
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
    defaultColumns: ['title', 'category', '_status', 'publishedAt', 'updatedAt'],
    useAsTitle: 'title',
  },
  hooks: {
    beforeValidate: [normalizeBlogPostSlug, normalizeBlogClusterCategory, syncLegacyStatusWithDraftStatus, sanitizeBlogPostFields],
  },
  lockDocuments: {
    duration: 30000,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 160,
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        description:
          'Public URL slug, for example fan-owners-direct-pay. Punctuation and spaces are normalized on save.',
      },
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
      maxLength: 320,
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
      label: 'Blog Cluster',
      type: 'text',
      admin: {
        components: {
          Field: '@/components/payload/BlogClusterField#BlogClusterField',
        },
        description:
          'Choose the SEO cluster for this article. This controls /blog/cluster/[clusterSlug] and related posts.',
      },
      defaultValue: 'fanfactors-revolution',
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
          maxLength: 160,
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
          maxLength: 500,
        },
      ],
    },
  ],
  versions: {
    drafts: true,
  },
}
