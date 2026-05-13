import type { MetadataRoute } from 'next'

import sitePages from '@/data/site-pages.json'
import {
  getAllBlogClusters,
  getAllPublishedBlogPosts,
  getBlogClusterUrl,
  getBlogPostUrl,
  getMostRecentBlogUpdate,
} from '@/lib/blog'
import { getCanonicalUrl } from '@/lib/site-url'

export const runtime = 'nodejs'

type StaticPage = {
  file: string
  changefreq: MetadataRoute.Sitemap[number]['changeFrequency']
  index?: boolean
  priority: string
}

const STATIC_LAST_MODIFIED = '2026-05-10'

export default function sitemap(): MetadataRoute.Sitemap {
  const clusters = getAllBlogClusters()
  const posts = getAllPublishedBlogPosts()
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
      lastModified: getMostRecentBlogUpdate() ?? STATIC_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...clusters.map((cluster) => ({
      url: getCanonicalUrl(getBlogClusterUrl(cluster)),
      lastModified: getMostRecentBlogUpdate() ?? STATIC_LAST_MODIFIED,
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
