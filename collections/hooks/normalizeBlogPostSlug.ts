import type { CollectionBeforeValidateHook } from 'payload'

type DataWithSlug = {
  slug?: string | null
  title?: string | null
}

export const normalizeBlogPostSlug: CollectionBeforeValidateHook = ({ data }) => {
  const draftData = data as DataWithSlug | undefined

  if (!draftData) {
    return data
  }

  draftData.slug = toUrlSlug(draftData.slug || draftData.title || 'untitled-post')

  return draftData
}

function toUrlSlug(value: string) {
  return (
    value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[’']/g, '')
      .replace(/&/g, ' and ')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90) || 'untitled-post'
  )
}
