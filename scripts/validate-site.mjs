import fs from 'node:fs';
import path from 'node:path';
import { validateBlogPostContract } from './lib/blog-content.mjs';
import { validateDocumentationContract } from './lib/docs-contract.mjs';
import { canonicalUrl, loadPageRegistry } from './lib/seo.mjs';
import { loadBlogPostRegistry, loadNavigationRegistry } from './lib/site-data.mjs';

const rootDir = process.cwd();
const pages = loadPageRegistry(rootDir);
const navigation = loadNavigationRegistry(rootDir);
const blogPosts = loadBlogPostRegistry(rootDir);
const registeredFiles = new Set(pages.map((page) => page.file));
const pagesByFile = new Map(pages.map((page) => [page.file, page]));
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

function validateNavigationForPage(page, html) {
  for (const href of navigation.headerLinks) {
    if (!html.includes(`href="${href}"`)) {
      failures.push(`${page.file}: missing expected header link ${href}`);
    }
  }

  for (const href of navigation.footerLinks) {
    if (!html.includes(`href="${href}"`)) {
      failures.push(`${page.file}: missing expected footer link ${href}`);
    }
  }

  for (const href of navigation.protectedLinks) {
    const linkedFromPublicPage = page.index !== false && html.includes(`href="${href}"`);
    if (linkedFromPublicPage && href === 'admin-dashboard.html') {
      failures.push(`${page.file}: public page should not link directly to protected dashboard ${href}`);
    }
  }
}

function validateBlogPostRegistry() {
  const slugs = new Set();
  const blogIndexPath = path.join(rootDir, 'blog.html');
  const blogIndexHtml = fs.readFileSync(blogIndexPath, 'utf8');

  for (const post of blogPosts) {
    failures.push(...validateBlogPostContract(post));

    const page = pagesByFile.get(post.file);
    const postPath = path.join(rootDir, post.file);

    if (!page) {
      failures.push(`${post.file}: blog post is missing from data/site-pages.json`);
      continue;
    }

    if (page.schemaType !== 'Article') {
      failures.push(`${post.file}: blog post page must use Article schemaType`);
    }

    if (slugs.has(post.slug)) {
      failures.push(`${post.file}: duplicate blog post slug ${post.slug}`);
    }
    slugs.add(post.slug);

    if (post.status !== 'published') {
      failures.push(`${post.file}: static blog registry can only include published posts`);
    }

    if (!fs.existsSync(postPath)) {
      failures.push(`${post.file}: blog post HTML file is missing`);
      continue;
    }

    const html = fs.readFileSync(postPath, 'utf8');
    const requiredStrings = [post.title, post.excerpt, post.category, post.seoTitle, post.seoDescription, post.featuredImage];
    for (const value of requiredStrings) {
      if (!html.includes(value)) {
        failures.push(`${post.file}: static post page is missing registry value: ${value}`);
      }
    }

    if (!blogIndexHtml.includes(`href="${post.file}"`)) {
      failures.push(`blog.html: missing link to registered blog post ${post.file}`);
    }

    if (!fs.existsSync(path.join(rootDir, post.featuredImage))) {
      failures.push(`${post.file}: featured image does not exist: ${post.featuredImage}`);
    }

    if (post.socialImage && !fs.existsSync(path.join(rootDir, post.socialImage))) {
      failures.push(`${post.file}: social image does not exist: ${post.socialImage}`);
    }
  }
}

function validateDocumentation() {
  failures.push(...validateDocumentationContract((file) => fs.existsSync(path.join(rootDir, file))));
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
  validateNavigationForPage(page, html);
}

validateBlogPostRegistry();
validateDocumentation();

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

for (const requiredFile of ['robots.txt', 'sitemap.xml', 'llms.txt', '.env.example', 'data/site-navigation.json', 'data/blog-posts.json', 'supabase/migrations/20260510154500_create_corporate_blog.sql']) {
  if (!fs.existsSync(path.join(rootDir, requiredFile))) {
    failures.push(`${requiredFile}: required repository file is missing`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${pages.length} pages, ${blogPosts.length} blog posts, SEO metadata, navigation, documentation, local links, assets, and crawl files.`);
