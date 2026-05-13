import { BlogCard } from './BlogCard'
import { BlogGrid } from './BlogGrid'
import styles from './Blog.module.css'

import type { BlogPost } from '@/lib/blog'

type RelatedPostsProps = {
  posts: BlogPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className={styles.section} aria-labelledby="related-posts-heading">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Read next</span>
        <h2 id="related-posts-heading">Related posts from this cluster</h2>
      </div>
      <BlogGrid ariaLabel="Related blog posts">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </BlogGrid>
    </section>
  )
}
