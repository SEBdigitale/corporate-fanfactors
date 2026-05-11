import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { NextResponse } from 'next/server'

const ROOT_DIR = process.cwd()
const ADMIN_ALIASES = new Set(['admin.html', 'admin-dashboard.html', 'indy', 'indy.html'])
const TOP_LEVEL_FILES = new Set(['index.html', 'robots.txt', 'sitemap.xml', 'llms.txt'])

const CONTENT_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

function resolveStaticPath(segments: string[] = []) {
  const rawPath = segments.join('/') || 'index.html'
  const normalizedPath = rawPath.endsWith('/') ? `${rawPath}index.html` : rawPath
  const aliasPath = rawPath.replace(/\/$/, '')

  if (ADMIN_ALIASES.has(aliasPath) || ADMIN_ALIASES.has(normalizedPath)) {
    return {
      filePath: '',
      rawPath: aliasPath,
    }
  }

  if (
    !normalizedPath.startsWith('assets/') &&
    !TOP_LEVEL_FILES.has(normalizedPath) &&
    !/^[a-z0-9-]+\.html$/i.test(normalizedPath)
  ) {
    return null
  }

  const filePath = path.normalize(path.join(ROOT_DIR, normalizedPath))

  if (!filePath.startsWith(ROOT_DIR)) {
    return null
  }

  return {
    filePath,
    rawPath,
  }
}

export async function serveStaticSiteFile(requestUrl: string, segments: string[] = []) {
  const target = resolveStaticPath(segments)

  if (!target) {
    return new NextResponse('Not found', { status: 404 })
  }

  if (ADMIN_ALIASES.has(target.rawPath)) {
    return NextResponse.redirect(new URL('/admin', requestUrl), 308)
  }

  try {
    const extension = path.extname(target.filePath)
    const body = await readFile(target.filePath)

    return new NextResponse(body, {
      headers: {
        'content-type': CONTENT_TYPES[extension] || 'application/octet-stream',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
