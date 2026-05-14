import type { MetadataRoute } from 'next'

import sitePages from '@/data/site-pages.json'
import {
  getAllBlogClusters,
  getBlogClusterUrl,
  getBlogPostUrl,
  getMostRecentBlogUpdateFromPosts,
  getPublishedBlogPostsForRoutes,
} from '@/lib/blog'
import { getCanonicalUrl } from '@/lib/site-url'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type StaticPage = {
  file: string
  changefreq: MetadataRoute.Sitemap[number]['changeFrequency']
  index?: boolean
  priority: string
}

const STATIC_LAST_MODIFIED = '2026-05-10'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const clusters = getAllBlogClusters()
  const posts = await getPublishedBlogPostsForRoutes()
  const mostRecentBlogUpdate = getMostRecentBlogUpdateFromPosts(posts)
  const staticEntries = (sitePages as StaticPage[])
    .filter((page) => page.index !== false && !isLegacyBlogPage(page.file))
    .map((page) => ({
      url: getCanonicalUrl(staticFileToPathname(page.file)),
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: page.changefreq,
      priority: Number(page.priority),
    }))

  return [
    ...staticEntries,
    {
      url: getCanonicalUrl('/blog'),
      lastModified: mostRecentBlogUpdate ?? STATIC_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...clusters.map((cluster) => ({
      url: getCanonicalUrl(getBlogClusterUrl(cluster)),
      lastModified: mostRecentBlogUpdate ?? STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...posts.map((post) => ({
      url: getCanonicalUrl(getBlogPostUrl(post)),
      lastModified: post.updatedAt || post.publishedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}

function staticFileToPathname(file: string) {
  return file === 'index.html' ? '/' : `/${file}`
}

function isLegacyBlogPage(file: string) {
  return file === 'blog.html' || file.startsWith('blog-')
}
