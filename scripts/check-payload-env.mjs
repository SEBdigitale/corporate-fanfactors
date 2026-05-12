import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const env = {
  ...readEnvFile('.env'),
  ...readEnvFile('.env.local'),
  ...process.env,
};

const failures = [];

if (!isNonEmptyString(env.DATABASE_URL)) {
  failures.push('DATABASE_URL is required for Payload Admin.');
}

if (!isNonEmptyString(env.PAYLOAD_SECRET)) {
  failures.push('PAYLOAD_SECRET is required for Payload Admin.');
}

if (isNonEmptyString(env.PAYLOAD_SECRET) && env.PAYLOAD_SECRET.length < 32) {
  failures.push('PAYLOAD_SECRET should be at least 32 characters.');
}

if (isNonEmptyString(env.DATABASE_URL) && !/^postgres(?:ql)?:\/\//.test(env.DATABASE_URL)) {
  failures.push('DATABASE_URL must be a Postgres connection string.');
}

if (env.VERCEL === '1' && !isNonEmptyString(env.BLOB_READ_WRITE_TOKEN)) {
  failures.push('BLOB_READ_WRITE_TOKEN is required on Vercel for Payload media uploads.');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Payload environment is ready for admin boot.');

function readEnvFile(fileName) {
  const filePath = path.join(rootDir, fileName);

  if (!fs.existsSync(filePath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const separatorIndex = line.indexOf('=');
        if (separatorIndex === -1) return [line, ''];

        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

        return [key, value];
      }),
  );
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
