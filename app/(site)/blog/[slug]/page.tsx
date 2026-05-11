import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import styles from '@/components/blog/Blog.module.css'
import { BlogShell } from '@/components/blog/BlogShell'
import { RichText } from '@/components/blog/RichText'
import { getBlogPostImagePath, getBlogPostTags, getPublishedBlogPostBySlug } from '@/services/payloadBlog'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post not found | FanFactors',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title: post.seo.title,
    description: post.seo.description,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      images: [getBlogPostImagePath(post)],
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const tags = getBlogPostTags(post)

  return (
    <BlogShell>
      <article>
        <header className={styles.articleHeader}>
          <span className={styles.eyebrow}>{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          {tags.length > 0 ? (
            <div className={styles.tags} aria-label="Tags">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}
        </header>
        <img className={styles.articleImage} alt="" src={getBlogPostImagePath(post)} />
        <RichText body={post.body} />
      </article>
    </BlogShell>
  )
}
