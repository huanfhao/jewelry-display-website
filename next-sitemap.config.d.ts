declare module 'next-sitemap' {
  export interface IConfig {
    siteUrl: string
    generateRobotsTxt: boolean
    changefreq?: string
    priority?: number
    sitemapSize?: number
    exclude?: string[]
    generateIndexSitemap?: boolean
    additionalPaths?: (config: any) => Promise<{ loc: string; changefreq?: string; priority?: number; lastmod?: string }[]>
  }
} 