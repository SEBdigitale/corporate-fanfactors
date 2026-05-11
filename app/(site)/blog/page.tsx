import type { Metadata } from 'next'

import { BlogCard } from '@/components/blog/BlogCard'
import styles from '@/components/blog/Blog.module.css'
import { BlogShell } from '@/components/blog/BlogShell'
import { getPublishedBlogPosts } from '@/services/payloadBlog'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Payload Blog | FanFactors',
  description: 'Server-rendered FanFactors blog powered by Payload CMS.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts()

  return (
    <BlogShell>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Payload CMS</span>
        <h1>FanFactors Blog</h1>
        <p>Published posts rendered server-side from the Supabase-backed Payload database.</p>
      </section>
      {posts.length > 0 ? (
        <section className={styles.grid} aria-label="Published posts">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </section>
      ) : (
        <p className={styles.empty}>No published Payload posts are available yet.</p>
      )}
    </BlogShell>
  )
}
