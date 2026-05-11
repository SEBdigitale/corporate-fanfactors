import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactCompiler: false,
  turbopack: {
    root: process.cwd(),
  },
}

export default withPayload(nextConfig)
