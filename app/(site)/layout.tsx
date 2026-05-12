import type { ReactNode } from 'react'

import './site.css'

type SiteLayoutProps = {
  children: ReactNode
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
