import fs from 'node:fs';
import path from 'node:path';
import { loadJsonFile } from './site-data.mjs';

export const SITE_ORIGIN = 'https://corporate.fanfactors.com';
export const DEFAULT_IMAGE = 'assets/images/artist-bassist-vocalist.webp';
export const LAST_MODIFIED = '2026-05-10';

/**
 * Loads the single page registry used by metadata, sitemap, and validation scripts.
 * Keeping this source centralized prevents page metadata from drifting across files.
 */
export function loadPageRegistry(rootDir = process.cwd()) {
  return loadJsonFile(rootDir, 'data/site-pages.json');
}

/**
 * Converts a static HTML filename into its canonical production URL.
 */
export function canonicalUrl(file) {
  return file === 'index.html' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/${file}`;
}

/**
 * Reads a page title from an HTML document.
 */
export function readTitle(html) {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  return match ? match[1].trim() : 'FanFactors';
}

/**
 * Reads a page meta description from an HTML document.
 */
export function readDescription(html) {
  const match = html.match(/<meta name="description" content="([^"]*)">/i);
  return match ? match[1].trim() : 'FanFactors corporate website.';
}

/**
 * Builds JSON-LD for the current static page type.
 */
export function buildStructuredData(page, title, description, url, imageUrl) {
  if (page.schemaType === 'WebSite') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'FanFactors Corporate',
      url: SITE_ORIGIN,
      description,
      publisher: {
        '@type': 'Organization',
        name: 'FanFactors',
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/assets/images/fanfactors-wordmark-dark.png`,
      },
    };
  }

  if (page.schemaType === 'Article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title.replace(' — FanFactors Blog', ''),
      description,
      url,
      image: imageUrl,
      author: { '@type': 'Organization', name: 'FanFactors' },
      publisher: {
        '@type': 'Organization',
        name: 'FanFactors',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_ORIGIN}/assets/images/fanfactors-wordmark-dark.png`,
        },
      },
      mainEntityOfPage: url,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'FanFactors Corporate',
      url: SITE_ORIGIN,
    },
    publisher: { '@type': 'Organization', name: 'FanFactors', url: SITE_ORIGIN },
  };
}

/**
 * Removes generated SEO tags so the apply script can rewrite a page idempotently.
 */
export function stripGeneratedSeo(html) {
  return html
    .replace(/<meta name="robots" content="[^"]*">/gi, '')
    .replace(/<link rel="canonical"[^>]*>/gi, '')
    .replace(/<meta property="og:[^"]+" content="[^"]*">/gi, '')
    .replace(/<meta name="twitter:[^"]+" content="[^"]*">/gi, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
}

/**
 * Builds the generated SEO tag block for a single HTML page.
 */
export function buildSeoBlock(page, html) {
  const title = readTitle(html);
  const description = readDescription(html);
  const url = canonicalUrl(page.file);
  const image = page.image || DEFAULT_IMAGE;
  const imageUrl = `${SITE_ORIGIN}/${image}`;
  const socialType = page.schemaType === 'Article' ? 'article' : 'website';
  const robots = page.index === false ? '<meta name="robots" content="noindex, nofollow">' : '';
  const structuredData = JSON.stringify(buildStructuredData(page, title, description, url, imageUrl)).replace(/</g, '\\u003c');

  return `${robots}<link rel="canonical" href="${url}"><meta property="og:type" content="${socialType}"><meta property="og:site_name" content="FanFactors"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${imageUrl}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${imageUrl}"><script type="application/ld+json">${structuredData}</script>`;
}

/**
 * Builds the production sitemap from indexable pages in the registry.
 */
export function buildSitemap(pages) {
  const urls = pages
    .filter((page) => page.index !== false)
    .map((page) => {
      return `  <url><loc>${canonicalUrl(page.file)}</loc><lastmod>${LAST_MODIFIED}</lastmod><changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority></url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
