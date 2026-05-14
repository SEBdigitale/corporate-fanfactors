import Link from 'next/link'

import { getBlogClusterBySlug, getBlogClusterUrl, getBlogPostUrl, type BlogPost } from '@/lib/blog'

import styles from './Blog.module.css'

type BlogCardProps = {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const cluster = getBlogClusterBySlug(post.clusterSlug)

  return (
    <article className={styles.card}>
      <img alt={post.title} decoding="async" loading="lazy" src={post.featuredImage} />
      <div className={styles.cardBody}>
        <div className={styles.meta}>
          {cluster ? <Link href={getBlogClusterUrl(cluster)}>{cluster.name}</Link> : null}
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span>{post.readingTime}</span>
        </div>
        <h2>
          <Link href={getBlogPostUrl(post)}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        {post.secondaryKeywords.length > 0 ? (
          <div className={styles.tags} aria-label="Tags">
            {post.secondaryKeywords.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}
