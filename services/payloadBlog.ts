import config from '@payload-config'
import { getPayload } from 'payload'

import type { PayloadBlogPost } from '@/types/payload-content'

const BLOG_LIMIT = 24

export async function getPublishedBlogPosts(): Promise<PayloadBlogPost[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'blog-posts',
    depth: 1,
    limit: BLOG_LIMIT,
    overrideAccess: true,
    sort: '-publishedAt',
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  return result.docs
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<PayloadBlogPost | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'blog-posts',
    depth: 1,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  return result.docs[0] ?? null
}

export function getBlogPostImagePath(post: PayloadBlogPost) {
  const uploadUrl = typeof post.featuredImage === 'object' ? post.featuredImage?.url : null
  const sourcePath = post.source?.featuredImagePath

  return normalizePublicPath(uploadUrl || sourcePath || 'assets/images/artist-hiphop-crew.webp')
}

export function getBlogPostTags(post: PayloadBlogPost) {
  return post.tags?.map((item) => item.tag).filter(Boolean) ?? []
}

function normalizePublicPath(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  return path.startsWith('/') ? path : `/${path}`
}
