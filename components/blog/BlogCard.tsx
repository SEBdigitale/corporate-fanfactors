import Link from 'next/link'

import { getBlogPostImagePath, getBlogPostTags } from '@/services/payloadBlog'
import type { PayloadBlogPost } from '@/types/payload-content'

import styles from './Blog.module.css'

type BlogCardProps = {
  post: PayloadBlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const tags = getBlogPostTags(post)

  return (
    <article className={styles.card}>
      <img alt="" src={getBlogPostImagePath(post)} />
      <div className={styles.cardBody}>
        <div className={styles.meta}>
          <span>{post.category}</span>
        </div>
        <h2>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        {tags.length > 0 ? (
          <div className={styles.tags} aria-label="Tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
