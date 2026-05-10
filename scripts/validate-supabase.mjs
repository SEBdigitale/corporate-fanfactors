import fs from 'node:fs';
import path from 'node:path';
import { CORPORATE_BLOG_MIGRATION, validateCorporateBlogMigration } from './lib/supabase-schema.mjs';

const rootDir = process.cwd();
const migrationPath = path.join(rootDir, CORPORATE_BLOG_MIGRATION);
const failures = [];

if (!fs.existsSync(migrationPath)) {
  failures.push(`${CORPORATE_BLOG_MIGRATION}: migration file is missing`);
} else {
  const sql = fs.readFileSync(migrationPath, 'utf8');
  failures.push(...validateCorporateBlogMigration(sql));
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Validated Supabase corporate blog migration.');
