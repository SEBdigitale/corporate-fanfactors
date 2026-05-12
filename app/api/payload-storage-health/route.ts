export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  const databaseUrl = process.env.DATABASE_URL
  const payloadSecret = process.env.PAYLOAD_SECRET
  const blobTokenPattern = /^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i

  return Response.json(
    {
      blobTokenFormatValid: Boolean(blobToken && blobTokenPattern.test(blobToken)),
      hasBlobToken: Boolean(blobToken),
      hasDatabaseUrl: Boolean(databaseUrl),
      hasPayloadSecret: Boolean(payloadSecret),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
