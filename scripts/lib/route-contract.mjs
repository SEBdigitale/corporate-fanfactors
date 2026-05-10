/**
 * Validates route rewrites against Vercel config and registered protected pages.
 */
export function validateRouteContract(routes, vercelConfig, protectedLinks) {
  const failures = [];
  const vercelRewrites = Array.isArray(vercelConfig.rewrites) ? vercelConfig.rewrites : [];

  for (const rewrite of routes.rewrites || []) {
    const matchingRewrite = vercelRewrites.find((item) => item.source === rewrite.source && item.destination === rewrite.destination);
    if (!matchingRewrite) {
      failures.push(`vercel.json: missing rewrite ${rewrite.source} -> ${rewrite.destination}`);
    }

    if (rewrite.protected && !protectedLinks.includes(rewrite.destination.replace(/^\//, ''))) {
      failures.push(`data/site-navigation.json: protected route destination is missing: ${rewrite.destination}`);
    }
  }

  return failures;
}
