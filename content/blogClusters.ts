export type BlogCluster = {
  audience: string
  description: string
  fanFactorsAngle: string
  featuredImage: string
  name: string
  pillarSlug: string
  primaryKeyword: string
  slug: string
}

export const blogClusters: BlogCluster[] = [
  {
    slug: 'free-music-distribution',
    name: 'Free Music Distribution',
    primaryKeyword: 'free music distribution',
    audience: 'Independent artists',
    description:
      'Guides for artists who want to release music, keep ownership clear, and understand what free distribution really costs.',
    fanFactorsAngle:
      'FanFactors treats distribution as the start of ownership, not the end of the artist relationship.',
    pillarSlug: 'free-music-distribution-for-independent-artists',
    featuredImage: '/assets/images/artist-rebel-vocalist.webp',
  },
  {
    slug: 'spotify-royalties',
    name: 'Spotify Royalties',
    primaryKeyword: 'Spotify royalty calculator',
    audience: 'Independent artists',
    description:
      'Plain-language royalty math for artists comparing streams, fan value, and direct music ownership models.',
    fanFactorsAngle:
      'FanFactors helps artists think beyond pennies per stream by turning fans into active market participants.',
    pillarSlug: 'spotify-royalty-calculator-how-much-artists-make',
    featuredImage: '/assets/images/artist-dj-turntables.webp',
  },
  {
    slug: 'sell-music-online',
    name: 'Sell Music Online',
    primaryKeyword: 'sell music online',
    audience: 'Artists, producers, and small labels',
    description:
      'Strategies for selling music directly, building demand, and protecting rights while growing a fan economy.',
    fanFactorsAngle:
      'FanFactors gives artists a legal marketplace where music can be priced, bought, and supported directly.',
    pillarSlug: 'how-to-sell-music-online-direct-to-fans',
    featuredImage: '/assets/images/artist-hiphop-crew.webp',
  },
  {
    slug: 'make-money-as-independent-artist',
    name: 'Make Money as an Independent Artist',
    primaryKeyword: 'how to make money as an independent artist',
    audience: 'Independent artists',
    description:
      'Business-focused articles for artists building income from music, community, catalog value, and fan support.',
    fanFactorsAngle:
      'FanFactors is built for artists who want more than attention. It is built for ownership, pricing power, and direct demand.',
    pillarSlug: 'how-to-make-money-as-an-independent-artist',
    featuredImage: '/assets/images/funnel-rap-vocalist.jpg',
  },
  {
    slug: 'fan-powered-promotion',
    name: 'Fan-Powered Promotion',
    primaryKeyword: 'make money promoting music',
    audience: 'Fans and artists',
    description:
      'A practical look at how fans can help music move, why incentives matter, and how promotion can become more transparent.',
    fanFactorsAngle:
      'FanFactors connects promotion with permission, ownership, and artist-approved participation.',
    pillarSlug: 'make-money-promoting-music-legally',
    featuredImage: '/assets/images/funnel-green-mohawk-band.jpg',
  },
  {
    slug: 'music-royalties',
    name: 'Music Royalties Explained',
    primaryKeyword: 'music royalties explained',
    audience: 'Artists, producers, and music business learners',
    description:
      'Clear explanations of royalty types, rights holders, payout flows, and the gaps artists need to understand.',
    fanFactorsAngle:
      'FanFactors keeps royalty education tied to a larger goal: music rights should be understandable and tradable only with legal clarity.',
    pillarSlug: 'music-royalties-explained-for-artists',
    featuredImage: '/assets/images/artist-classic-guitar.webp',
  },
  {
    slug: 'music-distribution-platforms',
    name: 'Music Distribution Platforms',
    primaryKeyword: 'best music distribution platforms',
    audience: 'Artists comparing music platforms',
    description:
      'Comparison guides for artists choosing between distributors, marketplaces, direct sales, and fan ownership tools.',
    fanFactorsAngle:
      'FanFactors is not just a distributor. It is a marketplace layer for artist-approved music ownership and fan participation.',
    pillarSlug: 'best-music-distribution-platforms-for-independent-artists',
    featuredImage: '/assets/images/artist-live-energy.webp',
  },
  {
    slug: 'music-marketplace',
    name: 'Music Marketplace',
    primaryKeyword: 'music marketplace',
    audience: 'Artists, fans, investors, and music-tech readers',
    description:
      'Thought leadership on what a legal music marketplace can become when artists and fans both have real roles.',
    fanFactorsAngle:
      'FanFactors is building the social music marketplace around artist control, fan demand, and legal resale design.',
    pillarSlug: 'what-is-a-music-marketplace',
    featuredImage: '/assets/images/funnel-dj-controller.jpg',
  },
  {
    slug: 'music-resale-rights',
    name: 'Music Resale Rights',
    primaryKeyword: 'music resale rights',
    audience: 'Artists, fans, and future FanFactors users',
    description:
      'Educational articles about resale rights, legal boundaries, and what future artist-approved music markets could unlock.',
    fanFactorsAngle:
      'FanFactors frames resale as a permissioned marketplace feature, not a shortcut around copyright owners.',
    pillarSlug: 'music-resale-rights-explained',
    featuredImage: '/assets/images/funnel-metal-vocalist-band.jpg',
  },
  {
    slug: 'fanfactors-revolution',
    name: 'FanFactors Revolution',
    primaryKeyword: 'FanFactors',
    audience: 'Artists, fans, early adopters, and supporters',
    description:
      'The movement behind FanFactors, why the current model is broken, and how artists and fans can help rebuild it.',
    fanFactorsAngle:
      "We're taking music back™ by making music ownership, support, and discovery more direct, social, and legal.",
    pillarSlug: 'what-is-fanfactors-taking-music-back',
    featuredImage: '/assets/images/artist-mohawk-rebel.jpg',
  },
]
