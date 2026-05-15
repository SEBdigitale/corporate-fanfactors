import config from '@payload-config'
import { getPayload } from 'payload'

import { normalizeBlogClusterSlug } from '@/lib/blog-clusters'
import type { PayloadBlogPost } from '@/types/payload-content'

const collection = 'blog-posts'

async function repairPayloadBlogPosts() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection,
    depth: 0,
    limit: 200,
    overrideAccess: true,
    sort: '-updatedAt',
  })
  let repairedCount = 0

  for (const post of result.docs as PayloadBlogPost[]) {
    const patch = buildRepairPatch(post)

    if (Object.keys(patch).length === 0) {
      continue
    }

    await payload.update({
      id: post.id,
      collection,
      data: patch,
      overrideAccess: true,
    })

    repairedCount += 1
  }

  payload.logger.info(`Payload blog repair complete: ${repairedCount} of ${result.totalDocs} records needed fixes.`)
}

function buildRepairPatch(post: PayloadBlogPost) {
  const clusterSlug = normalizeBlogClusterSlug(post.category, buildClusterContext(post))
  const tags = (post.tags ?? [])
    .map((item) => ({ tag: cleanOptionalText(item.tag, 70) }))
    .filter((item): item is { tag: string } => Boolean(item.tag))
  const seo = {
    ...(post.seo ?? {}),
    aiSummary: cleanOptionalText(post.seo?.aiSummary, 500),
    description: cleanText(post.seo?.description || post.excerpt, 320),
    title: cleanText(post.seo?.title || post.title, 160),
  }
  const patch: Record<string, unknown> = {}

  if (post.category !== clusterSlug) {
    patch.category = clusterSlug
  }

  if (JSON.stringify(post.tags ?? []) !== JSON.stringify(tags)) {
    patch.tags = tags
  }

  if (JSON.stringify(post.seo ?? {}) !== JSON.stringify(seo)) {
    patch.seo = seo
  }

  if (post.status === 'published' && !post.publishedAt) {
    patch.publishedAt = new Date().toISOString()
  }

  return patch
}

function buildClusterContext(post: PayloadBlogPost) {
  return [post.title, post.slug, (post.tags ?? []).map((item) => item.tag).filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(' ')
}

function cleanText(value: string | null | undefined, maxLength: number) {
  return cleanOptionalText(value, maxLength) || 'FanFactors is taking music back with artists and fans.'
}

function cleanOptionalText(value: string | null | undefined, maxLength: number) {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim()

  if (normalized.length <= maxLength) {
    return normalized
  }

  return normalized.slice(0, maxLength).replace(/\s+\S*$/, '').trim()
}

await repairPayloadBlogPosts()
