import config from '@payload-config'
import { getPayload } from 'payload'

import { blogPosts } from '@/content/blogPosts'
import { buildPayloadClusterBlogSeedPost } from '@/services/payloadBlogSeed'

const collection = 'blog-posts'

async function seedPayloadBlogClusters() {
  const payload = await getPayload({ config })
  let createdCount = 0
  let skippedCount = 0

  for (const post of blogPosts) {
    const existing = await payload.find({
      collection,
      draft: true,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: post.slug,
        },
      },
    })

    if (existing.totalDocs > 0) {
      skippedCount += 1
      continue
    }

    await payload.create({
      collection,
      data: buildPayloadClusterBlogSeedPost(post),
      draft: post.status === 'draft',
      overrideAccess: true,
    })

    createdCount += 1
  }

  payload.logger.info(`Payload cluster blog seed complete: ${createdCount} created, ${skippedCount} already existed.`)
}

await seedPayloadBlogClusters()
