const DEFAULT_SITE_ORIGIN = 'https://corporate.fanfactors.com'

export const SITE_ORIGIN = normalizeSiteOrigin(getSiteOrigin())

export function getCanonicalUrl(pathname = '/') {
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`

  return new URL(normalizedPathname, SITE_ORIGIN).toString()
}

export function getAbsoluteUrl(url: string) {
  return /^https?:\/\//.test(url) ? url : new URL(url, SITE_ORIGIN).toString()
}

function normalizeSiteOrigin(origin: string) {
  return origin.replace(/\/+$/, '')
}

function getSiteOrigin() {
  if (process.env.VERCEL_ENV === 'production') {
    return DEFAULT_SITE_ORIGIN
  }

  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_ORIGIN
}
