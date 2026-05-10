/**
 * Documentation files required by the current static repo architecture.
 */
export const REQUIRED_DOCUMENTATION_FILES = [
  'AGENTS.md',
  'README.md',
  'data/README.md',
  'scripts/README.md',
  'docs/blog-platform.md',
  'docs/quality-gates.md',
  'docs/seo-ai-optimization.md',
  'docs/static-site-tooling.md',
  'supabase/README.md',
];

/**
 * Checks that required repository and module documentation files are present.
 */
export function validateDocumentationContract(fileExists) {
  const failures = [];

  for (const file of REQUIRED_DOCUMENTATION_FILES) {
    if (!fileExists(file)) {
      failures.push(`${file}: required documentation file is missing`);
    }
  }

  return failures;
}
