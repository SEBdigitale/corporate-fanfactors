import Link from 'next/link'

import { getBlogPostUrl, type BlogPost } from '@/lib/blog'

import { BlogHeroSlider } from './BlogHeroSlider'
import styles from './Blog.module.css'

type BlogHeroProps = {
  clusterCount: number
  description: string
  featuredPost: BlogPost | null
  postCount: number
}

export function BlogHero({ clusterCount, description, featuredPost, postCount }: BlogHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className={styles.eyebrow}>We&apos;re taking music back™</span>
        <h1>FanFactors Blog</h1>
        <p>{description}</p>
        <div className={styles.heroStats} aria-label="Blog coverage">
          <span>{clusterCount} SEO clusters</span>
          <span>{postCount} published guides</span>
          <span>Artist and fan ownership focus</span>
        </div>
        <div className={styles.heroActions}>
          <Link href="/blog/cluster/fanfactors-revolution">Explore the revolution</Link>
          {featuredPost ? <Link href={getBlogPostUrl(featuredPost)}>Read the pillar article</Link> : null}
        </div>
      </div>
      <BlogHeroSlider />
      {featuredPost ? (
        <div className={styles.featuredPillar}>
          <span>Main pillar article</span>
          <h2>
            <Link href={getBlogPostUrl(featuredPost)}>{featuredPost.title}</Link>
          </h2>
          <p>{featuredPost.excerpt}</p>
        </div>
      ) : null}
    </section>
  )
}
