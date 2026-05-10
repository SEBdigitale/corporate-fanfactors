import fs from 'node:fs';
import path from 'node:path';
import { canonicalUrl, loadPageRegistry } from './lib/seo.mjs';

const rootDir = process.cwd();
const pages = loadPageRegistry(rootDir);
const registeredFiles = new Set(pages.map((page) => page.file));
const failures = [];

function stripHashAndQuery(value) {
  return value.split('#')[0].split('?')[0];
}

function isExternalUrl(value) {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//');
}

function assertExistingLocalTarget(sourceFile, rawValue, attribute) {
  const value = stripHashAndQuery(rawValue);
  if (!value || value.startsWith('#') || isExternalUrl(value)) return;

  const targetPath = path.normalize(path.join(path.dirname(sourceFile), value));
  const fullTargetPath = path.join(rootDir, targetPath);

  if (!fs.existsSync(fullTargetPath)) {
    failures.push(`${sourceFile}: ${attribute} target does not exist: ${rawValue}`);
  }
}

function validateSeoForPage(page, html) {
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

function validateLinksForPage(page, html) {
  const attributePattern = /\b(href|src)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attributePattern)) {
    assertExistingLocalTarget(page.file, match[2], match[1]);
  }
}

for (const page of pages) {
  const pagePath = path.join(rootDir, page.file);
  if (!fs.existsSync(pagePath)) {
    failures.push(`${page.file}: missing registered HTML file`);
    continue;
  }

  const html = fs.readFileSync(pagePath, 'utf8');
  validateSeoForPage(page, html);
  validateLinksForPage(page, html);
}

for (const file of fs.readdirSync(rootDir).filter((item) => item.endsWith('.html'))) {
  if (!registeredFiles.has(file)) {
    failures.push(`${file}: HTML file is missing from data/site-pages.json`);
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

for (const requiredFile of ['robots.txt', 'sitemap.xml', 'llms.txt', 'AGENTS.md']) {
  if (!fs.existsSync(path.join(rootDir, requiredFile))) {
    failures.push(`${requiredFile}: required repository file is missing`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${pages.length} pages, SEO metadata, local links, assets, and crawl files.`);
