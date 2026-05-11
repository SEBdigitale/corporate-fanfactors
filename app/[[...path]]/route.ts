import { serveStaticSiteFile } from '@/lib/static-site'

export const runtime = 'nodejs'

type Args = {
  params: Promise<{
    path?: string[]
  }>
}

export async function GET(_request: Request, { params }: Args) {
  const { path = [] } = await params

  return serveStaticSiteFile(_request.url, path)
}

export async function HEAD(_request: Request, { params }: Args) {
  const { path = [] } = await params

  return serveStaticSiteFile(_request.url, path)
}
