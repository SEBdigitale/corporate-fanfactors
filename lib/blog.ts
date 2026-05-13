import { blogClusters, type BlogCluster } from '@/content/blogClusters'
import { blogPosts, type BlogPost } from '@/content/blogPosts'

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

export function getBlogPostBySlug(slug: string) {
  return getAllPublishedBlogPosts().find((post) => post.slug === slug) ?? null
}

export function getPostsByCluster(clusterSlug: string) {
  return getAllPublishedBlogPosts().filter((post) => post.clusterSlug === clusterSlug)
}

export function getPillarPostForCluster(clusterSlug: string) {
  const cluster = getBlogClusterBySlug(clusterSlug)
  const posts = getPostsByCluster(clusterSlug)

  return posts.find((post) => post.slug === cluster?.pillarSlug) ?? posts.find((post) => post.isPillar) ?? posts[0] ?? null
}

export function getRelatedPosts(post: BlogPost, limit = 3) {
  return getPostsByCluster(post.clusterSlug)
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, limit)
}

export function getLatestPosts(limit = 6) {
  return getAllPublishedBlogPosts().slice(0, limit)
}

export function getFeaturedPillarPost() {
  return getBlogPostBySlug('what-is-fanfactors-taking-music-back') ?? getAllPublishedBlogPosts().find((post) => post.isPillar) ?? null
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

function isPublished(post: BlogPost) {
  return post.status === 'published'
}

function sortByPublishedDateDesc(first: BlogPost, second: BlogPost) {
  return Date.parse(second.publishedAt) - Date.parse(first.publishedAt)
}
