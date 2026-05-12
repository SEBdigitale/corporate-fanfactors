import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactCompiler: false,
  outputFileTracingIncludes: {
    '/*': [
      './*.html',
      './assets/**/*',
      './llms.txt',
      './robots.txt',
      './sitemap.xml',
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default withPayload(nextConfig)
