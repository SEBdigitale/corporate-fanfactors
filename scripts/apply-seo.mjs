import fs from 'node:fs';
import path from 'node:path';
import { buildSeoBlock, buildSitemap, loadPageRegistry, stripGeneratedSeo } from './lib/seo.mjs';

const rootDir = process.cwd();
const pages = loadPageRegistry(rootDir);

for (const page of pages) {
  const pagePath = path.join(rootDir, page.file);
  const originalHtml = fs.readFileSync(pagePath, 'utf8');
  const htmlWithoutGeneratedSeo = stripGeneratedSeo(originalHtml);
  const seoBlock = buildSeoBlock(page, htmlWithoutGeneratedSeo);
  const nextHtml = htmlWithoutGeneratedSeo.replace('</head>', `${seoBlock}</head>`);
  fs.writeFileSync(pagePath, nextHtml);
}

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), buildSitemap(pages));
console.log(`Applied SEO metadata to ${pages.length} pages and regenerated sitemap.xml.`);
