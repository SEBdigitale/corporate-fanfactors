import Link from 'next/link'

import { getBlogPostUrl, type BlogCluster, type BlogPost } from '@/lib/blog'

import styles from './Blog.module.css'

type BlogClusterHeroProps = {
  cluster: BlogCluster
  pillarPost: BlogPost | null
  postCount: number
}

export function BlogClusterHero({ cluster, pillarPost, postCount }: BlogClusterHeroProps) {
  return (
    <section className={styles.clusterHero}>
      <span className={styles.eyebrow}>{cluster.primaryKeyword}</span>
      <h1>{cluster.name}</h1>
      <p>{cluster.description}</p>
      <dl className={styles.clusterFacts}>
        <div>
          <dt>Audience</dt>
          <dd>{cluster.audience}</dd>
        </div>
        <div>
          <dt>Primary keyword</dt>
          <dd>{cluster.primaryKeyword}</dd>
        </div>
        <div>
          <dt>Published guides</dt>
          <dd>{postCount}</dd>
        </div>
      </dl>
      <div className={styles.angle}>
        <span>FanFactors angle</span>
        <p>{cluster.fanFactorsAngle}</p>
      </div>
      {pillarPost ? (
        <div className={styles.featuredPillar}>
          <span>Pillar post</span>
          <h2>
            <Link href={getBlogPostUrl(pillarPost)}>{pillarPost.title}</Link>
          </h2>
          <p>{pillarPost.excerpt}</p>
        </div>
      ) : null}
    </section>
  )
}
