import type { CSSProperties } from 'react'

import styles from './Blog.module.css'

const heroSlides = [
  {
    alt: 'FanFactors green F stage portrait',
    src: '/assets/images/blog-hero/legend-stage-mic.jpg',
  },
  {
    alt: 'FanFactors green F hoodie portrait',
    src: '/assets/images/blog-hero/legend-hoodie-car.jpg',
  },
  {
    alt: 'FanFactors green F rock portrait',
    src: '/assets/images/blog-hero/legend-black-hoodie.jpg',
  },
  {
    alt: 'FanFactors green F Las Vegas portrait',
    src: '/assets/images/blog-hero/legend-vegas.jpg',
  },
  {
    alt: 'FanFactors green F close portrait',
    src: '/assets/images/blog-hero/legend-closeup.jpg',
  },
  {
    alt: 'FanFactors green F roots portrait',
    src: '/assets/images/blog-hero/legend-roots-speaker.jpg',
  },
  {
    alt: 'FanFactors green F smoke performance portrait',
    src: '/assets/images/blog-hero/legend-smoke-dancer-1.jpg',
  },
  {
    alt: 'FanFactors green F smoke stage portrait',
    src: '/assets/images/blog-hero/legend-smoke-dancer-2.jpg',
  },
]

export function BlogHeroSlider() {
  return (
    <div className={styles.heroSlider} aria-label="FanFactors artist hero image rotation">
      {heroSlides.map((slide, index) => (
        <img
          alt={slide.alt}
          decoding="async"
          fetchPriority={index === 0 ? 'high' : 'auto'}
          key={slide.src}
          loading={index === 0 ? 'eager' : 'lazy'}
          src={slide.src}
          style={{ '--slide-index': index } as CSSProperties}
        />
      ))}
      <div className={styles.heroSliderShade} />
      <div className={styles.heroSliderChrome}>
        <span>Legal music marketplace</span>
        <strong>Artists upload. Fans buy, sell, and back the movement.</strong>
      </div>
    </div>
  )
}
