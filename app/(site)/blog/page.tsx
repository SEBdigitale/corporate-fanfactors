import type { Metadata } from 'next'

import { BlogClusterNav } from '@/components/blog/BlogClusterNav'
import { BlogCTA } from '@/components/blog/BlogCTA'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogGrid } from '@/components/blog/BlogGrid'
import { BlogHero } from '@/components/blog/BlogHero'
import { BlogShell } from '@/components/blog/BlogShell'
import { JsonLd } from '@/components/JsonLd'
import {
  getAllBlogClusters,
  getAllPublishedBlogPosts,
  getBlogPostUrl,
  getFeaturedPillarPost,
  getLatestPosts,
} from '@/lib/blog'
import { getCanonicalUrl, SITE_ORIGIN } from '@/lib/site-url'

import styles from '@/components/blog/Blog.module.css'

const blogDescription =
  'FanFactors helps artists and fans understand the new music economy: distribution, royalties, direct sales, fan-powered promotion, legal resale rights, and the social marketplace built around “We’re taking music back™.”'
const blogPath = '/blog'
const blogUrl = getCanonicalUrl(blogPath)

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: 'FanFactors Blog | FanFactors',
  description: blogDescription,
  alternates: {
    canonical: blogPath,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    siteName: 'FanFactors',
    title: 'FanFactors Blog | FanFactors',
    description: blogDescription,
    url: blogUrl,
    images: ['/assets/images/fanfactors-wordmark-dark.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FanFactors Blog | FanFactors',
    description: blogDescription,
    images: ['/assets/images/fanfactors-wordmark-dark.png'],
  },
}

export default async function BlogPage() {
  const clusters = getAllBlogClusters()
  const posts = getAllPublishedBlogPosts()
  const latestPosts = getLatestPosts(6)
  const featuredPost = getFeaturedPillarPost()

  return (
    <BlogShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'FanFactors Blog',
          description: blogDescription,
          url: blogUrl,
          publisher: {
            '@type': 'Organization',
            name: 'FanFactors',
            url: SITE_ORIGIN,
            logo: getCanonicalUrl('/assets/images/fanfactors-wordmark-dark.png'),
          },
          blogPost: posts.slice(0, 12).map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            url: getCanonicalUrl(getBlogPostUrl(post)),
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
          })),
        }}
      />
      <BlogHero
        clusterCount={clusters.length}
        description={blogDescription}
        featuredPost={featuredPost}
        postCount={posts.length}
      />
      <BlogClusterNav clusters={clusters} />
      {latestPosts.length > 0 ? (
        <section className={styles.section} aria-labelledby="latest-posts-heading">
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Latest articles</span>
            <h2 id="latest-posts-heading">New guides for artists, fans, and the music marketplace</h2>
          </div>
          <BlogGrid ariaLabel="Latest published articles">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </BlogGrid>
        </section>
      ) : (
        <p className={styles.empty}>No published blog posts are available yet.</p>
      )}
      {featuredPost ? (
        <section className={styles.section} aria-labelledby="pillar-post-heading">
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Start here</span>
            <h2 id="pillar-post-heading">Main pillar article</h2>
          </div>
          <BlogGrid ariaLabel="Featured pillar article">
            <BlogCard post={featuredPost} />
          </BlogGrid>
        </section>
      ) : null}
      <BlogCTA ctaType="artist-alpha" />
    </BlogShell>
  )
}
