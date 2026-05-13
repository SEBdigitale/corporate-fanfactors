import type { MetadataRoute } from 'next'

import { getCanonicalUrl, SITE_ORIGIN } from '@/lib/site-url'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
    sitemap: getCanonicalUrl('/sitemap.xml'),
    host: SITE_ORIGIN,
  }
}
