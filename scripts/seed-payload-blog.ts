import fs from 'node:fs'
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'

import {
  buildPayloadBlogSeedPost,
  type StaticBlogRegistryEntry,
} from '../services/payloadBlogSeed'

const rootDir = process.cwd()
const registryPath = path.join(rootDir, 'data/blog-posts.json')

async function seedPayloadBlog() {
  const payload = await getPayload({ config })
  const posts = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as StaticBlogRegistryEntry[]

  for (const post of posts) {
    const htmlPath = path.join(rootDir, post.file)
    const articleHtml = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : undefined
    const data = buildPayloadBlogSeedPost(post, articleHtml)
    const existing = await payload.find({
      collection: 'blog-posts',
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: post.slug,
        },
      },
    })

    if (existing.docs[0]) {
      await payload.update({
        id: existing.docs[0].id,
        collection: 'blog-posts',
        data,
        draft: post.status === 'draft',
        overrideAccess: true,
      })
      payload.logger.info(`Updated blog post: ${post.slug}`)
      continue
    }

    await payload.create({
      collection: 'blog-posts',
      data,
      draft: post.status === 'draft',
      overrideAccess: true,
    })
    payload.logger.info(`Created blog post: ${post.slug}`)
  }
}

await seedPayloadBlog()
