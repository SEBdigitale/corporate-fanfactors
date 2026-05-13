import Link from 'next/link'
import type { ReactNode } from 'react'

import styles from './Blog.module.css'

type BlogShellProps = {
  children: ReactNode
}

export function BlogShell({ children }: BlogShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/">
            <img src="/assets/images/fanfactors-wordmark-dark.png" alt="FanFactors" />
          </Link>
          <nav className={styles.nav} aria-label="Blog navigation">
            <Link href="/blog">Blog</Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
