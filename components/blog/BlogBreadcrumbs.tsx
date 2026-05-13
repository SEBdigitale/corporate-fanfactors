import Link from 'next/link'

import styles from './Blog.module.css'

export type BreadcrumbItem = {
  href?: string
  label: string
}

type BlogBreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export function BlogBreadcrumbs({ items }: BlogBreadcrumbsProps) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol>
        {items.map((item) => (
          <li key={`${item.href ?? 'current'}-${item.label}`}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
