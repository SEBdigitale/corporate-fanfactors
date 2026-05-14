import { blogClusters } from '@/content/blogClusters'

export type BlogClusterSlug =
  | 'free-music-distribution'
  | 'spotify-royalties'
  | 'sell-music-online'
  | 'make-money-as-independent-artist'
  | 'fan-powered-promotion'
  | 'music-royalties'
  | 'music-distribution-platforms'
  | 'music-marketplace'
  | 'music-resale-rights'
  | 'fanfactors-revolution'

export const BLOG_CLUSTER_FALLBACK_SLUG: BlogClusterSlug = 'fanfactors-revolution'

export const blogClusterOptions = blogClusters.map((cluster) => ({
  label: cluster.name,
  value: cluster.slug,
}))

const blogClusterSlugs = new Set<BlogClusterSlug>(blogClusters.map((cluster) => cluster.slug as BlogClusterSlug))

const legacyCategoryMap: Record<string, BlogClusterSlug> = {
  'direct pay': 'sell-music-online',
  direct: 'sell-music-online',
  distribution: 'free-music-distribution',
  fan: 'fan-powered-promotion',
  'fan ownership': 'music-resale-rights',
  fanfactors: 'fanfactors-revolution',
  mission: 'fanfactors-revolution',
  movement: 'fanfactors-revolution',
  ownership: 'music-resale-rights',
  qa: BLOG_CLUSTER_FALLBACK_SLUG,
  royalties: 'music-royalties',
  royalty: 'music-royalties',
  spotify: 'spotify-royalties',
}

export function isBlogClusterSlug(value: unknown): value is BlogClusterSlug {
  return typeof value === 'string' && blogClusterSlugs.has(value as BlogClusterSlug)
}

export function normalizeBlogClusterSlug(value: unknown, context = ''): BlogClusterSlug {
  if (isBlogClusterSlug(value)) {
    return value
  }

  const normalizedValue = normalizeSearchText(value)
  const legacyMatch = legacyCategoryMap[normalizedValue]

  if (legacyMatch) {
    return legacyMatch
  }

  const searchableText = `${normalizedValue} ${normalizeSearchText(context)}`

  if (hasAny(searchableText, ['spotify', 'stream', 'streaming', 'calculator'])) {
    return 'spotify-royalties'
  }

  if (hasAny(searchableText, ['resale', 'resell', 'rights', 'ownership', 'own music'])) {
    return 'music-resale-rights'
  }

  if (hasAny(searchableText, ['royalty', 'royalties', 'publishing', 'payout', 'master'])) {
    return 'music-royalties'
  }

  if (hasAny(searchableText, ['distribution platform', 'distributor', 'best music distribution', 'platforms'])) {
    return 'music-distribution-platforms'
  }

  if (hasAny(searchableText, ['distribution', 'release music', 'upload music'])) {
    return 'free-music-distribution'
  }

  if (hasAny(searchableText, ['sell music', 'direct sale', 'direct pay', 'pricing'])) {
    return 'sell-music-online'
  }

  if (hasAny(searchableText, ['make money', 'income', 'career', 'independent artist'])) {
    return 'make-money-as-independent-artist'
  }

  if (hasAny(searchableText, ['promotion', 'promoting', 'fan-powered', 'playlist'])) {
    return 'fan-powered-promotion'
  }

  if (hasAny(searchableText, ['marketplace', 'market', 'music-tech'])) {
    return 'music-marketplace'
  }

  return BLOG_CLUSTER_FALLBACK_SLUG
}

function hasAny(value: string, candidates: string[]) {
  return candidates.some((candidate) => value.includes(candidate))
}

function normalizeSearchText(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[™®]/g, '')
}
