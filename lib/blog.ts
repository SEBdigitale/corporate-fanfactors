import { blogClusters, type BlogCluster } from '@/content/blogClusters'
import { blogPosts, type BlogPost } from '@/content/blogPosts'
import { normalizeBlogClusterSlug } from '@/lib/blog-clusters'
import type { PayloadBlogPost } from '@/types/payload-content'

export type { BlogCluster, BlogPost }

export const BLOG_HOME_PATH = '/blog'
export const BLOG_ALPHA_CTA_PATH = 'https://staging.fanfactors.com'

export function getAllBlogClusters() {
  return blogClusters
}

export function getBlogClusterBySlug(clusterSlug: string) {
  return blogClusters.find((cluster) => cluster.slug === clusterSlug) ?? null
}

export function getAllPublishedBlogPosts() {
  return blogPosts.filter(isPublished).sort(sortByPublishedDateDesc)
}

export async function getPublishedBlogPostsForRoutes() {
  const payloadBlog = await import('@/services/payloadBlog')
  const payloadPosts = await payloadBlog.getPublishedBlogPosts()
  const dynamicPosts = payloadPosts.map((post) =>
    toBlogPostFromPayload(post, payloadBlog.getBlogPostImagePath, payloadBlog.getBlogPostTags),
  )

  return mergeBlogPosts(getAllPublishedBlogPosts(), dynamicPosts)
}

export function getBlogPostBySlug(slug: string) {
  return getAllPublishedBlogPosts().find((post) => post.slug === slug) ?? null
}

export async function getPublishedBlogPostBySlugForRoutes(slug: string) {
  return (await getPublishedBlogPostsForRoutes()).find((post) => post.slug === decodeSlugParam(slug)) ?? null
}

export function getPostsByCluster(clusterSlug: string) {
  return getAllPublishedBlogPosts().filter((post) => post.clusterSlug === clusterSlug)
}

export function getPostsByClusterFromPosts(posts: BlogPost[], clusterSlug: string) {
  return posts.filter((post) => post.clusterSlug === clusterSlug).sort(sortByPublishedDateDesc)
}

export function getPillarPostForCluster(clusterSlug: string) {
  const cluster = getBlogClusterBySlug(clusterSlug)
  const posts = getPostsByCluster(clusterSlug)

  return posts.find((post) => post.slug === cluster?.pillarSlug) ?? posts.find((post) => post.isPillar) ?? posts[0] ?? null
}

export function getPillarPostForClusterFromPosts(clusterSlug: string, posts: BlogPost[]) {
  const cluster = getBlogClusterBySlug(clusterSlug)
  const clusterPosts = getPostsByClusterFromPosts(posts, clusterSlug)

  return (
    clusterPosts.find((post) => post.slug === cluster?.pillarSlug) ??
    clusterPosts.find((post) => post.isPillar) ??
    clusterPosts[0] ??
    null
  )
}

export function getRelatedPosts(post: BlogPost, limit = 3) {
  return getPostsByCluster(post.clusterSlug)
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, limit)
}

export function getRelatedPostsFromPosts(post: BlogPost, posts: BlogPost[], limit = 3) {
  return getPostsByClusterFromPosts(posts, post.clusterSlug)
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, limit)
}

export function getLatestPosts(limit = 6) {
  return getAllPublishedBlogPosts().slice(0, limit)
}

export function getLatestPostsFromPosts(posts: BlogPost[], limit = 6) {
  return posts.filter(isPublished).sort(sortByPublishedDateDesc).slice(0, limit)
}

export function getFeaturedPillarPost() {
  return getBlogPostBySlug('what-is-fanfactors-taking-music-back') ?? getAllPublishedBlogPosts().find((post) => post.isPillar) ?? null
}

export function getFeaturedPillarPostFromPosts(posts: BlogPost[]) {
  return posts.find((post) => post.slug === 'what-is-fanfactors-taking-music-back') ?? posts.find((post) => post.isPillar) ?? null
}

export function getBlogPostUrl(post: BlogPost) {
  return `${BLOG_HOME_PATH}/${post.slug}`
}

export function getBlogClusterUrl(cluster: BlogCluster) {
  return `${BLOG_HOME_PATH}/cluster/${cluster.slug}`
}

export function getClusterForPost(post: BlogPost) {
  return getBlogClusterBySlug(post.clusterSlug)
}

export function getMostRecentBlogUpdate() {
  return getAllPublishedBlogPosts()
    .map((post) => post.updatedAt || post.publishedAt)
    .sort()
    .at(-1)
}

export function getMostRecentBlogUpdateFromPosts(posts: BlogPost[]) {
  return posts
    .map((post) => post.updatedAt || post.publishedAt)
    .sort()
    .at(-1)
}

function isPublished(post: BlogPost) {
  return post.status === 'published'
}

function sortByPublishedDateDesc(first: BlogPost, second: BlogPost) {
  return Date.parse(second.publishedAt) - Date.parse(first.publishedAt)
}

function mergeBlogPosts(staticPosts: BlogPost[], dynamicPosts: BlogPost[]) {
  const postsBySlug = new Map(staticPosts.map((post) => [post.slug, post]))

  for (const post of dynamicPosts) {
    postsBySlug.set(post.slug, post)
  }

  return [...postsBySlug.values()].filter(isPublished).sort(sortByPublishedDateDesc)
}

function toBlogPostFromPayload(
  post: PayloadBlogPost,
  getBlogPostImagePath: (post: PayloadBlogPost) => string,
  getBlogPostTags: (post: PayloadBlogPost) => string[],
): BlogPost {
  const tags = getBlogPostTags(post)
  const clusterSlug = normalizeBlogClusterSlug(post.category, [post.title, post.slug, tags.join(' ')].join(' '))
  const cluster = getBlogClusterBySlug(clusterSlug)
  const publishedAt = toDateOnly(post.publishedAt ?? post.createdAt)
  const updatedAt = toDateOnly(post.updatedAt ?? post.publishedAt ?? post.createdAt)
  const body = extractPayloadParagraphs(post.body, post.excerpt)
  const secondaryKeywords = tags.length > 0 ? tags : [cluster?.primaryKeyword ?? 'FanFactors']

  return {
    slug: post.slug,
    title: post.title,
    metaTitle: post.seo?.title || `${post.title} | FanFactors`,
    metaDescription: post.seo?.description || post.excerpt,
    excerpt: post.excerpt,
    clusterSlug,
    primaryKeyword: cluster?.primaryKeyword ?? 'FanFactors',
    secondaryKeywords,
    audience: cluster?.audience ?? 'Artists and fans',
    searchIntent: post.seo?.aiSummary ?? `Learn how ${post.title} connects to FanFactors.`,
    funnelStage: clusterSlug === 'fanfactors-revolution' ? 'awareness' : 'consideration',
    publishedAt,
    updatedAt,
    author: 'FanFactors',
    readingTime: estimateReadingTime([post.title, post.excerpt, ...body].join(' ')),
    featuredImage: getBlogPostImagePath(post),
    ctaType: getCtaTypeForCluster(clusterSlug),
    status: 'published',
    isPillar: post.slug === cluster?.pillarSlug,
    body,
  }
}

function extractPayloadParagraphs(body: PayloadBlogPost['body'], fallback: string) {
  const rootChildren = Array.isArray(body?.root?.children) ? body.root.children : []
  const paragraphs = rootChildren.map(extractNodeText).filter(Boolean)

  return paragraphs.length > 0 ? paragraphs : [fallback]
}

function extractNodeText(node: unknown): string {
  if (!node || typeof node !== 'object') {
    return ''
  }

  const record = node as { children?: unknown[]; text?: unknown }

  if (typeof record.text === 'string') {
    return record.text
  }

  if (Array.isArray(record.children)) {
    return record.children.map(extractNodeText).join(' ').replace(/\s+/g, ' ').trim()
  }

  return ''
}

function estimateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(3, Math.ceil(words / 220))

  return `${minutes} min read`
}

function getCtaTypeForCluster(clusterSlug: string): BlogPost['ctaType'] {
  if (clusterSlug === 'fan-powered-promotion') {
    return 'fan-alpha'
  }

  if (clusterSlug === 'fanfactors-revolution' || clusterSlug === 'music-marketplace') {
    return 'learn-more'
  }

  return 'artist-alpha'
}

function toDateOnly(value?: null | string) {
  if (!value) {
    return new Date().toISOString().slice(0, 10)
  }

  const timestamp = Date.parse(value)

  if (Number.isFinite(timestamp)) {
    return new Date(timestamp).toISOString().slice(0, 10)
  }

  return value.slice(0, 10)
}

function decodeSlugParam(slug: string) {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}
