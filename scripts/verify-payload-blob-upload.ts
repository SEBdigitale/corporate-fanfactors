import { head } from '@vercel/blob'
import config from '@payload-config'
import { getPayload } from 'payload'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://corporate.fanfactors.com'

// 1x1 transparent PNG.
const transparentPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
)

async function verifyPayloadBlobUpload() {
  const payload = await getPayload({ config })
  const fileName = `payload-blob-smoke-${Date.now()}.png`

  const media = await payload.create({
    collection: 'media',
    data: {
      alt: 'Payload Blob smoke test',
    },
    file: {
      data: transparentPng,
      mimetype: 'image/png',
      name: fileName,
      size: transparentPng.length,
    },
    overrideAccess: true,
  })

  try {
    const url = typeof media.url === 'string' ? media.url : ''
    const filename = typeof media.filename === 'string' ? media.filename : ''
    if (!url) {
      throw new Error('Payload did not return a media URL.')
    }

    if (!filename) {
      throw new Error('Payload did not return a media filename.')
    }

    const storeId = process.env.BLOB_READ_WRITE_TOKEN?.match(/^vercel_blob_rw_([a-z\d]+)_/i)?.[1]
    if (!storeId) {
      throw new Error('BLOB_READ_WRITE_TOKEN is missing or invalid.')
    }

    await head(`https://${storeId.toLowerCase()}.public.blob.vercel-storage.com/${filename}`, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const absoluteUrl = new URL(url, siteUrl).toString()
    const response = await fetch(absoluteUrl, { method: 'HEAD' })

    if (!response.ok) {
      throw new Error(`Media URL failed with HTTP ${response.status}: ${absoluteUrl}`)
    }

    payload.logger.info(`Payload Blob upload verified: ${absoluteUrl}`)
  } finally {
    await payload.delete({
      id: media.id,
      collection: 'media',
      overrideAccess: true,
    })
  }
}

await verifyPayloadBlobUpload()
