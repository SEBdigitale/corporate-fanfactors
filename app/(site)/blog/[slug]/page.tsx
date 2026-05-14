import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlogBreadcrumbs } from '@/components/blog/BlogBreadcrumbs'
import { BlogCTA } from '@/components/blog/BlogCTA'
import styles from '@/components/blog/Blog.module.css'
import { BlogShell } from '@/components/blog/BlogShell'
import { JsonLd } from '@/components/JsonLd'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import {
  getAllPublishedBlogPosts,
  getBlogClusterUrl,
  getBlogPostUrl,
  getClusterForPost,
  getPublishedBlogPostBySlugForRoutes,
  getPublishedBlogPostsForRoutes,
  getRelatedPostsFromPosts,
} from '@/lib/blog'
import { getAbsoluteUrl, getCanonicalUrl, SITE_ORIGIN } from '@/lib/site-url'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return getAllPublishedBlogPosts().map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedBlogPostBySlugForRoutes(slug)

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
    metadataBase: new URL(SITE_ORIGIN),
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: getCanonicalUrl(`/blog/${post.slug}`),
      siteName: 'FanFactors',
      images: [getAbsoluteUrl(post.featuredImage)],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ['FanFactors'],
      tags: [post.primaryKeyword, ...post.secondaryKeywords],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [getAbsoluteUrl(post.featuredImage)],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const decodedSlug = decodeSlugParam(slug)
  const posts = await getPublishedBlogPostsForRoutes()
  const post = posts.find((candidate) => candidate.slug === decodedSlug)

  if (!post) {
    notFound()
  }

  const cluster = getClusterForPost(post)
  const relatedPosts = getRelatedPostsFromPosts(post, posts, 3)
  const imageUrl = getAbsoluteUrl(post.featuredImage)
  const postPath = getBlogPostUrl(post)
  const canonicalUrl = getCanonicalUrl(postPath)
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    ...(cluster ? [{ href: getBlogClusterUrl(cluster), label: cluster.name }] : []),
    { label: post.title },
  ]

  return (
    <BlogShell>
      <BlogBreadcrumbs items={breadcrumbs} />
      <article>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.metaDescription,
            image: [imageUrl],
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: {
              '@type': 'Organization',
              name: 'FanFactors',
              url: SITE_ORIGIN,
            },
            publisher: {
              '@type': 'Organization',
              name: 'FanFactors',
              url: SITE_ORIGIN,
              logo: {
                '@type': 'ImageObject',
                url: getCanonicalUrl('/assets/images/fanfactors-wordmark-dark.png'),
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
            keywords: [post.primaryKeyword, ...post.secondaryKeywords],
            articleSection: cluster?.name,
          }}
        />
        <JsonLd data={toBreadcrumbJsonLd(breadcrumbs)} />
        <header className={styles.articleHeader}>
          <span className={styles.eyebrow}>{cluster?.name ?? 'FanFactors Blog'}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className={styles.articleMeta}>
            {cluster ? <Link href={getBlogClusterUrl(cluster)}>{cluster.primaryKeyword}</Link> : null}
            <span>{post.author}</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>{post.readingTime}</span>
          </div>
        </header>
        <img className={styles.articleImage} alt={post.title} src={post.featuredImage} />
        <div className={styles.article}>
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h2>Why this matters for FanFactors</h2>
          <p>
            FanFactors connects this topic back to a simple mission: artists should have more control, fans should have a
            more meaningful role, and music should move through legal artist-approved markets.
          </p>
        </div>
      </article>
      <RelatedPosts posts={relatedPosts} />
      <BlogCTA ctaType={post.ctaType} />
    </BlogShell>
  )
}

function decodeSlugParam(slug: string) {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function toBreadcrumbJsonLd(items: Array<{ href?: string; label: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: getCanonicalUrl(item.href) } : {}),
    })),
  }
}
