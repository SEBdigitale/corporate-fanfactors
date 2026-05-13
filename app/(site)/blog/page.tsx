import type { Metadata } from 'next'

import { BlogCard } from '@/components/blog/BlogCard'
import styles from '@/components/blog/Blog.module.css'
import { BlogShell } from '@/components/blog/BlogShell'
import { getPublishedBlogPosts } from '@/services/payloadBlog'

export const dynamic = 'force-dynamic'

const blogDescription =
  'FanFactors helps musicians and groups turn their music into a legal social marketplace, giving artists more control over pricing, discovery, and direct fan support while giving fans a real role in backing and sharing the music they believe in.'

export const metadata: Metadata = {
  title: 'FanFactors Blog | FanFactors',
  description: blogDescription,
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
        <span className={styles.eyebrow}>We&apos;re taking music back™</span>
        <h1>FanFactors Blog</h1>
        <p>{blogDescription}</p>
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
