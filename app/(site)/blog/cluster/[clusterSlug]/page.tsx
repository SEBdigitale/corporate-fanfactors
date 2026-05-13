import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogBreadcrumbs } from '@/components/blog/BlogBreadcrumbs'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogClusterHero } from '@/components/blog/BlogClusterHero'
import { BlogCTA } from '@/components/blog/BlogCTA'
import { BlogGrid } from '@/components/blog/BlogGrid'
import styles from '@/components/blog/Blog.module.css'
import { BlogShell } from '@/components/blog/BlogShell'
import { JsonLd } from '@/components/JsonLd'
import {
  getAllBlogClusters,
  getBlogClusterBySlug,
  getBlogClusterUrl,
  getPillarPostForCluster,
  getPostsByCluster,
} from '@/lib/blog'
import { getAbsoluteUrl, getCanonicalUrl, SITE_ORIGIN } from '@/lib/site-url'

type PageProps = {
  params: Promise<{
    clusterSlug: string
  }>
}

export function generateStaticParams() {
  return getAllBlogClusters().map((cluster) => ({
    clusterSlug: cluster.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clusterSlug } = await params
  const cluster = getBlogClusterBySlug(clusterSlug)

  if (!cluster) {
    return {
      title: 'Blog cluster not found | FanFactors',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const clusterPath = getBlogClusterUrl(cluster)
  const title = `${cluster.name} | FanFactors Blog`

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description: cluster.description,
    alternates: {
      canonical: clusterPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      siteName: 'FanFactors',
      title,
      description: cluster.description,
      url: getCanonicalUrl(clusterPath),
      images: [getAbsoluteUrl(cluster.featuredImage)],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: cluster.description,
      images: [getAbsoluteUrl(cluster.featuredImage)],
    },
  }
}

export default async function BlogClusterPage({ params }: PageProps) {
  const { clusterSlug } = await params
  const cluster = getBlogClusterBySlug(clusterSlug)

  if (!cluster) {
    notFound()
  }

  const posts = getPostsByCluster(cluster.slug)
  const pillarPost = getPillarPostForCluster(cluster.slug)
  const clusterPath = getBlogClusterUrl(cluster)
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { label: cluster.name },
  ]

  return (
    <BlogShell>
      <BlogBreadcrumbs items={breadcrumbs} />
      <JsonLd data={toBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: cluster.name,
          description: cluster.description,
          url: getCanonicalUrl(clusterPath),
          about: cluster.primaryKeyword,
          audience: cluster.audience,
          isPartOf: {
            '@type': 'Blog',
            name: 'FanFactors Blog',
            url: getCanonicalUrl('/blog'),
          },
        }}
      />
      <BlogClusterHero cluster={cluster} pillarPost={pillarPost} postCount={posts.length} />
      {posts.length > 0 ? (
        <section className={styles.section} aria-labelledby="cluster-posts-heading">
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Cluster articles</span>
            <h2 id="cluster-posts-heading">All posts in {cluster.name}</h2>
          </div>
          <BlogGrid ariaLabel={`${cluster.name} posts`}>
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </BlogGrid>
        </section>
      ) : (
        <p className={styles.empty}>No published posts are available for this cluster yet.</p>
      )}
      <BlogCTA ctaType={pillarPost?.ctaType ?? 'learn-more'} />
    </BlogShell>
  )
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
