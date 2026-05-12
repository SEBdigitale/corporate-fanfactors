import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { BlogPosts } from './collections/BlogPosts'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const blobToken = process.env.BLOB_READ_WRITE_TOKEN

export default buildConfig({
  admin: {
    components: {
      views: {},
    },
    user: Users.slug,
  },
  collections: [Users, Media, BlogPosts, Pages],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 5000,
      max: 1,
    },
  }),
  editor: lexicalEditor(),
  plugins: blobToken
    ? [
        vercelBlobStorage({
          collections: {
            media: true,
          },
          token: blobToken,
        }),
      ]
    : [],
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload-types.ts'),
  },
})
