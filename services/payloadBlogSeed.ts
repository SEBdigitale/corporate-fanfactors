import type { RequiredDataFromCollectionSlug } from 'payload'

export type StaticBlogRegistryEntry = {
  category: string
  excerpt: string
  featuredImage: string
  file: string
  publishedAt?: string
  seoDescription: string
  seoTitle: string
  slug: string
  socialImage?: string
  status: 'draft' | 'published'
  tags: string[]
  title: string
}

type ArticleBlock = {
  text: string
  type: 'heading-2' | 'heading-3' | 'paragraph'
}

export type PayloadBlogSeedPost = RequiredDataFromCollectionSlug<'blog-posts'>

export function buildPayloadBlogSeedPost(
  post: StaticBlogRegistryEntry,
  articleHtml?: string,
): PayloadBlogSeedPost {
  const articleBlocks = articleHtml ? extractArticleBlocks(articleHtml) : []
  const fallbackBlocks: ArticleBlock[] = [
    {
      text: post.excerpt,
      type: 'paragraph',
    },
  ]

  return {
    title: post.title,
    slug: post.slug,
    status: post.status,
    publishedAt: post.publishedAt,
    excerpt: post.excerpt,
    body: toLexicalRichText(articleBlocks.length > 0 ? articleBlocks : fallbackBlocks),
    category: post.category,
    tags: post.tags.map((tag) => ({ tag })),
    seo: {
      title: post.seoTitle,
      description: post.seoDescription,
      aiSummary: post.excerpt,
    },
    source: {
      staticFile: post.file,
      featuredImagePath: post.featuredImage,
      socialImagePath: post.socialImage,
    },
  }
}

export function extractArticleBlocks(html: string): ArticleBlock[] {
  const articleMatch = html.match(/<article\b[^>]*class=["'][^"']*\bv3-article\b[^"']*["'][^>]*>([\s\S]*?)<\/article>/i)
  const articleHtml = articleMatch?.[1]

  if (!articleHtml) {
    return []
  }

  return [...articleHtml.matchAll(/<(h2|h3|p)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match): ArticleBlock => {
      const tagName = match[1].toLowerCase()

      return {
        text: decodeHtml(stripTags(match[2])).trim(),
        type: tagName === 'h2' ? 'heading-2' : tagName === 'h3' ? 'heading-3' : 'paragraph',
      }
    })
    .filter((block) => block.text.length > 0)
}

function toLexicalRichText(blocks: ArticleBlock[]): PayloadBlogSeedPost['body'] {
  return {
    root: {
      type: 'root',
      children: blocks.map((block) => ({
        type: block.type === 'paragraph' ? 'paragraph' : 'heading',
        tag: block.type === 'heading-2' ? 'h2' : block.type === 'heading-3' ? 'h3' : undefined,
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: block.text,
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, ' ')
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, '-')
    .replace(/\s+/g, ' ')
}
