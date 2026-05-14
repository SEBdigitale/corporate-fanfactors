# SEO And AI Discoverability

## Current Improvements

The corporate site now includes baseline crawl and sharing signals:

- canonical URLs on HTML pages
- Open Graph metadata
- Twitter card metadata
- JSON-LD structured data
- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- indexable typed `/blog`, `/blog/[slug]`, and `/blog/cluster/[clusterSlug]` routes
- typed Next.js sitemap generation for published blog posts and cluster pages
- canonical, Open Graph, Twitter card, `Article`, and `BreadcrumbList` metadata for blog articles
- `BreadcrumbList` and `CollectionPage` structured data for cluster pages
- Payload Blog Posts can select a Blog Cluster, and published Payload posts are merged into the public SEO routes with typed fallback content.

## Remaining SEO Work

The site should still add:

- Search Console verification
- performance budget checks after future app migration
- image dimension and compression audit
- production analytics events for CTA and blog engagement

## AI Optimization Rules

Write pages so AI systems can extract direct answers:

- identify FanFactors consistently as the entity
- use clear definitions near the top of each page
- keep FAQ answers concise and factual
- use structured data for organization, web pages, and articles
- maintain `llms.txt` when major pages or product positioning changes

## Content Clusters

Current blog clusters:

- Free Music Distribution: `free music distribution`
- Spotify Royalties: `Spotify royalty calculator`
- Sell Music Online: `sell music online`
- Make Money as an Independent Artist: `how to make money as an independent artist`
- Fan-Powered Promotion: `make money promoting music`
- Music Royalties Explained: `music royalties explained`
- Music Distribution Platforms: `best music distribution platforms`
- Music Marketplace: `music marketplace`
- Music Resale Rights: `music resale rights`
- FanFactors Revolution: `FanFactors`

Every cluster page links to its pillar post. Every post links back to its cluster and shows three related posts from the same cluster.
