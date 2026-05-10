import fs from 'node:fs';
import path from 'node:path';
import {
  SECRET_SCAN_EXCLUDED_DIRS,
  shouldScanFile,
  validateNoCommittedSecrets,
} from './lib/security-contract.mjs';

const rootDir = process.cwd();
const failures = [];

function walk(relativeDir = '.') {
  const absoluteDir = path.join(rootDir, relativeDir);

  for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
    const relativePath = path.normalize(path.join(relativeDir, entry.name)).replace(/^\.\//, '');

    if (entry.isDirectory()) {
      if (!SECRET_SCAN_EXCLUDED_DIRS.has(entry.name)) {
        walk(relativePath);
      }
      continue;
    }

    if (!entry.isFile() || !shouldScanFile(relativePath)) continue;

    const content = fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
    failures.push(...validateNoCommittedSecrets(relativePath, content));
  }
}

walk();

if (!fs.existsSync(path.join(rootDir, '.env.example'))) {
  failures.push('.env.example: required environment template is missing');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Validated environment template and committed secret guardrails.');
