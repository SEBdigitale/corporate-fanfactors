/**
 * Directories skipped by the committed-secret scanner.
 */
export const SECRET_SCAN_EXCLUDED_DIRS = new Set(['.git', 'node_modules', '.next', 'out', 'dist']);

/**
 * Files allowed to mention placeholder secret names or detector patterns.
 */
export const SECRET_SCAN_EXCLUDED_FILES = new Set([
  '.env.example',
  'docs/environment-security.md',
  'scripts/lib/security-contract.mjs',
]);

/**
 * Secret-like value patterns that should not appear in tracked source files.
 */
export const SECRET_PATTERNS = [
  {
    name: 'Supabase service role key assignment',
    pattern: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[A-Za-z0-9._-]+/i,
  },
  {
    name: 'Supabase service role JWT',
    pattern: /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/i,
  },
  {
    name: 'Stripe live secret key',
    pattern: /sk_live_[A-Za-z0-9]+/i,
  },
  {
    name: 'GitHub token',
    pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/i,
  },
];

/**
 * Returns true when a file should be scanned for committed secrets.
 */
export function shouldScanFile(relativePath) {
  if (SECRET_SCAN_EXCLUDED_FILES.has(relativePath)) return false;
  return /\.(html|js|mjs|json|md|txt|xml|yml|yaml|sql|env|example)$/i.test(relativePath);
}

/**
 * Checks file content for known secret-like values that should not be committed.
 */
export function validateNoCommittedSecrets(relativePath, content) {
  const failures = [];

  for (const secretPattern of SECRET_PATTERNS) {
    if (secretPattern.pattern.test(content)) {
      failures.push(`${relativePath}: possible secret detected (${secretPattern.name})`);
    }
  }

  return failures;
}
