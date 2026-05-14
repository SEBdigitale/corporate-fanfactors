import type { CollectionBeforeValidateHook } from 'payload'

import { normalizeBlogClusterSlug } from '../../lib/blog-clusters'

type DataWithBlogCluster = {
  category?: string | null
  slug?: string | null
  tags?: Array<{ tag?: string | null }> | null
  title?: string | null
}

export const normalizeBlogClusterCategory: CollectionBeforeValidateHook = ({ data }) => {
  const draftData = data as DataWithBlogCluster | undefined

  if (!draftData) {
    return data
  }

  draftData.category = normalizeBlogClusterSlug(draftData.category, buildClusterContext(draftData))

  return draftData
}

function buildClusterContext(data: DataWithBlogCluster) {
  const tags = data.tags?.map((item) => item.tag).filter(Boolean).join(' ') ?? ''

  return [data.title, data.slug, tags].filter(Boolean).join(' ')
}
