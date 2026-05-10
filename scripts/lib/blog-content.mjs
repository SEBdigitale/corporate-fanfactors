/**
 * Allowed publishing states for corporate blog metadata.
 */
export const BLOG_POST_STATUSES = new Set(['draft', 'published', 'archived']);

/**
 * Slug format shared with the Supabase check constraint.
 */
export const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validates static blog metadata against the Supabase corporate_blog_posts contract.
 * These rules intentionally mirror database constraints before the admin CMS exists.
 */
export function validateBlogPostContract(post) {
  const failures = [];
  const label = post.file || post.slug || 'blog post';

  if (!isLengthBetween(post.title, 3, 160)) {
    failures.push(`${label}: title must be between 3 and 160 characters`);
  }

  if (!BLOG_SLUG_PATTERN.test(post.slug || '')) {
    failures.push(`${label}: slug is not URL-safe`);
  }

  if (!isLengthBetween(post.excerpt, 20, 320)) {
    failures.push(`${label}: excerpt must be between 20 and 320 characters`);
  }

  if (!isNonEmptyString(post.category)) {
    failures.push(`${label}: category is required`);
  }

  if (!Array.isArray(post.tags)) {
    failures.push(`${label}: tags must be an array`);
  }

  if (!isNonEmptyString(post.featuredImage)) {
    failures.push(`${label}: featuredImage is required`);
  }

  if (!BLOG_POST_STATUSES.has(post.status)) {
    failures.push(`${label}: status must be draft, published, or archived`);
  }

  if (post.status === 'published' && !isIsoDate(post.publishedAt)) {
    failures.push(`${label}: published posts must include an ISO publishedAt date`);
  }

  if (post.seoTitle && post.seoTitle.length > 160) {
    failures.push(`${label}: seoTitle must be 160 characters or fewer`);
  }

  if (post.seoDescription && post.seoDescription.length > 320) {
    failures.push(`${label}: seoDescription must be 320 characters or fewer`);
  }

  if (post.socialImage && !isNonEmptyString(post.socialImage)) {
    failures.push(`${label}: socialImage must be a non-empty string when provided`);
  }

  return failures;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isLengthBetween(value, min, max) {
  return typeof value === 'string' && value.length >= min && value.length <= max;
}

function isIsoDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}
