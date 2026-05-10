import fs from 'node:fs';
import path from 'node:path';
import { canonicalUrl, loadPageRegistry } from './lib/seo.mjs';

const rootDir = process.cwd();
const pages = loadPageRegistry(rootDir);
const failures = [];

for (const page of pages) {
  const pagePath = path.join(rootDir, page.file);
  if (!fs.existsSync(pagePath)) {
    failures.push(`${page.file}: missing registered HTML file`);
    continue;
  }

  const html = fs.readFileSync(pagePath, 'utf8');
  const expectedCanonical = `<link rel="canonical" href="${canonicalUrl(page.file)}">`;
  const canonicalCount = (html.match(/rel="canonical"/g) || []).length;
  const schemaBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const robotsNoindex = html.includes('<meta name="robots" content="noindex, nofollow">');

  if (canonicalCount !== 1 || !html.includes(expectedCanonical)) {
    failures.push(`${page.file}: canonical URL is missing or duplicated`);
  }

  if (schemaBlocks.length !== 1) {
    failures.push(`${page.file}: expected exactly one JSON-LD block`);
  }

  for (const block of schemaBlocks) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      failures.push(`${page.file}: invalid JSON-LD (${error.message})`);
    }
  }

  if (page.index === false && !robotsNoindex) {
    failures.push(`${page.file}: noindex page is missing robots noindex metadata`);
  }

  if (page.index !== false && robotsNoindex) {
    failures.push(`${page.file}: indexable page has robots noindex metadata`);
  }
}

const sitemap = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
for (const page of pages.filter((item) => item.index !== false)) {
  if (!sitemap.includes(`<loc>${canonicalUrl(page.file)}</loc>`)) {
    failures.push(`sitemap.xml: missing ${page.file}`);
  }
}

for (const page of pages.filter((item) => item.index === false)) {
  if (sitemap.includes(`<loc>${canonicalUrl(page.file)}</loc>`)) {
    failures.push(`sitemap.xml: includes noindex page ${page.file}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated SEO metadata for ${pages.length} registered pages.`);
