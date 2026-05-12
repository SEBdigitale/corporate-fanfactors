import config from '@payload-config'
import { getPayload } from 'payload'

import staticBlogPosts from '@/data/blog-posts.json'
import type { PayloadBlogPost } from '@/types/payload-content'

const BLOG_LIMIT = 24

export async function getPublishedBlogPosts(): Promise<PayloadBlogPost[]> {
  try {
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
  } catch (error) {
    console.error('Falling back to static blog posts after Payload read failed.', error)

    return getStaticPublishedBlogPosts()
  }
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<PayloadBlogPost | null> {
  try {
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
  } catch (error) {
    console.error(`Falling back to static blog post "${slug}" after Payload read failed.`, error)

    return getStaticPublishedBlogPostBySlug(slug)
  }
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

function getStaticPublishedBlogPosts(): PayloadBlogPost[] {
  return staticBlogPosts
    .filter((post) => post.status === 'published')
    .sort((first, second) => Date.parse(second.publishedAt) - Date.parse(first.publishedAt))
    .map(toFallbackPayloadPost)
}

function getStaticPublishedBlogPostBySlug(slug: string): PayloadBlogPost | null {
  const post = staticBlogPosts.find((entry) => entry.slug === slug && entry.status === 'published')

  return post ? toFallbackPayloadPost(post) : null
}

function toFallbackPayloadPost(post: (typeof staticBlogPosts)[number]): PayloadBlogPost {
  const fallbackId = staticBlogPosts.findIndex((entry) => entry.slug === post.slug) + 1

  return {
    id: fallbackId,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    status: 'published',
    publishedAt: post.publishedAt,
    tags: post.tags.map((tag) => ({ tag })),
    seo: {
      title: post.seoTitle,
      description: post.seoDescription,
    },
    source: {
      staticFile: post.file,
      featuredImagePath: post.featuredImage,
      socialImagePath: post.socialImage,
    },
    body: toFallbackBody(post.excerpt),
    createdAt: post.publishedAt,
    updatedAt: post.publishedAt,
  } as unknown as PayloadBlogPost
}

function toFallbackBody(text: string): PayloadBlogPost['body'] {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
      direction: null,
    },
  }
}
