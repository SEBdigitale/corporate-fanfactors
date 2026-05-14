import type { CollectionBeforeValidateHook } from 'payload'

type DraftStatus = 'draft' | 'published'

type BlogPostData = {
  _status?: DraftStatus | null
  excerpt?: string | null
  publishedAt?: string | null
  seo?: {
    aiSummary?: string | null
    description?: string | null
    title?: string | null
  } | null
  status?: DraftStatus | null
  tags?: Array<{ tag?: string | null }> | null
  title?: string | null
}

const TITLE_MAX_LENGTH = 160
const EXCERPT_MAX_LENGTH = 320
const SEO_DESCRIPTION_MAX_LENGTH = 320
const AI_SUMMARY_MAX_LENGTH = 500

export const sanitizeBlogPostFields: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  const draftData = data as BlogPostData | undefined
  const existingData = originalDoc as BlogPostData | undefined

  if (!draftData) {
    return data
  }

  if (hasOwnField(draftData, 'title')) {
    draftData.title = cleanText(draftData.title, TITLE_MAX_LENGTH)
  }

  if (hasOwnField(draftData, 'excerpt')) {
    draftData.excerpt = cleanText(draftData.excerpt, EXCERPT_MAX_LENGTH)
  }

  if (hasOwnField(draftData, 'tags')) {
    draftData.tags = cleanTags(draftData.tags)
  }

  if (hasOwnField(draftData, 'seo') || !existingData) {
    draftData.seo = sanitizeSeo(draftData, existingData)
  }

  if (
    (draftData._status === 'published' || draftData.status === 'published') &&
    !draftData.publishedAt &&
    !existingData?.publishedAt
  ) {
    draftData.publishedAt = new Date().toISOString()
  }

  return draftData
}

function sanitizeSeo(data: BlogPostData, existingData?: BlogPostData): NonNullable<BlogPostData['seo']> {
  const seo = data.seo ?? {}
  const fallbackTitle = data.title || existingData?.title || 'FanFactors Blog'
  const fallbackDescription =
    data.excerpt || existingData?.excerpt || 'FanFactors is taking music back with artists and fans.'

  return {
    ...seo,
    aiSummary: cleanOptionalText(seo.aiSummary, AI_SUMMARY_MAX_LENGTH),
    description: cleanText(seo.description || fallbackDescription, SEO_DESCRIPTION_MAX_LENGTH),
    title: cleanText(seo.title || fallbackTitle, TITLE_MAX_LENGTH),
  }
}

function cleanTags(tags: BlogPostData['tags']) {
  if (!Array.isArray(tags)) {
    return []
  }

  return tags
    .map((item) => ({
      ...item,
      tag: cleanOptionalText(item.tag, 70),
    }))
    .filter((item): item is { tag: string } => Boolean(item.tag))
}

function cleanText(value: string | null | undefined, maxLength: number) {
  const normalized = cleanOptionalText(value, maxLength)

  return normalized || undefined
}

function cleanOptionalText(value: string | null | undefined, maxLength: number) {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim()

  if (normalized.length <= maxLength) {
    return normalized
  }

  return normalized.slice(0, maxLength).replace(/\s+\S*$/, '').trim()
}

function hasOwnField<T extends object>(data: T, field: keyof BlogPostData) {
  return Object.prototype.hasOwnProperty.call(data, field)
}
