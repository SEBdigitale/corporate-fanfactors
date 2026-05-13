import Link from 'next/link'

import { getBlogClusterUrl, getPillarPostForCluster, getBlogPostUrl, type BlogCluster } from '@/lib/blog'

import styles from './Blog.module.css'

type BlogClusterNavProps = {
  clusters: BlogCluster[]
}

export function BlogClusterNav({ clusters }: BlogClusterNavProps) {
  return (
    <section className={styles.section} aria-labelledby="blog-clusters-heading">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Topic clusters</span>
        <h2 id="blog-clusters-heading">Explore the FanFactors music business map</h2>
      </div>
      <div className={styles.clusterGrid}>
        {clusters.map((cluster) => {
          const pillar = getPillarPostForCluster(cluster.slug)

          return (
            <article key={cluster.slug} className={styles.clusterCard}>
              <img alt={`${cluster.name} topic`} src={cluster.featuredImage} />
              <div>
                <span>{cluster.primaryKeyword}</span>
                <h3>
                  <Link href={getBlogClusterUrl(cluster)}>{cluster.name}</Link>
                </h3>
                <p>{cluster.description}</p>
                {pillar ? <Link href={getBlogPostUrl(pillar)}>Pillar: {pillar.title}</Link> : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
