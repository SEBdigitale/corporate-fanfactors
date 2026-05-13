import type { ReactNode } from 'react'

import styles from './Blog.module.css'

type BlogGridProps = {
  ariaLabel: string
  children: ReactNode
}

export function BlogGrid({ ariaLabel, children }: BlogGridProps) {
  return (
    <section className={styles.grid} aria-label={ariaLabel}>
      {children}
    </section>
  )
}
