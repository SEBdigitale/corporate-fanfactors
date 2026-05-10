import fs from 'node:fs';
import path from 'node:path';

/**
 * Loads a JSON data file from the repository root.
 * Validation scripts share this helper so registry loading stays predictable.
 */
export function loadJsonFile(rootDir, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

/**
 * Loads the expected static navigation contract for the duplicated HTML shell.
 */
export function loadNavigationRegistry(rootDir = process.cwd()) {
  return loadJsonFile(rootDir, 'data/site-navigation.json');
}

/**
 * Loads static blog post metadata shaped to match the future Supabase CMS table.
 */
export function loadBlogPostRegistry(rootDir = process.cwd()) {
  return loadJsonFile(rootDir, 'data/blog-posts.json');
}
