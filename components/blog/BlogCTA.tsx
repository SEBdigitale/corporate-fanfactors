import Link from 'next/link'

import { BLOG_ALPHA_CTA_PATH, type BlogPost } from '@/lib/blog'

import styles from './Blog.module.css'

type BlogCTAProps = {
  ctaType?: BlogPost['ctaType']
}

const ctaCopy = {
  'artist-alpha': {
    title: 'Join the FanFactors Alpha as an artist',
    body: 'Bring your music into a legal marketplace built around artist control, direct fan support, and the idea that music should create more ownership.',
    label: 'Join the Alpha',
  },
  'fan-alpha': {
    title: 'Join the FanFactors Alpha as a fan',
    body: 'Help shape a platform where fans can back the artists they believe in and participate in music culture with clearer rights and real purpose.',
    label: 'Join the Alpha',
  },
  'learn-more': {
    title: "We're taking music back™",
    body: 'FanFactors is building a social music marketplace where artists upload music and fans can buy, sell, and potentially resell artist-approved music rights legally.',
    label: 'Explore FanFactors',
  },
}

export function BlogCTA({ ctaType = 'artist-alpha' }: BlogCTAProps) {
  const copy = ctaCopy[ctaType]
  const isExternal = /^https?:\/\//.test(BLOG_ALPHA_CTA_PATH)

  return (
    <section className={styles.cta}>
      <span className={styles.eyebrow}>FanFactors Alpha</span>
      <h2>{copy.title}</h2>
      <p>{copy.body}</p>
      <Link href={BLOG_ALPHA_CTA_PATH} rel={isExternal ? 'noopener' : undefined} target={isExternal ? '_blank' : undefined}>
        {copy.label}
      </Link>
    </section>
  )
}
