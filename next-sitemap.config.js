/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://syjewelrydisplay.cn',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://syjewelrydisplay.cn/server-sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/_next', '/static'],
      },
    ],
  },
  transform: async (config, path) => {
    // 自定义优先级
    const priority = path === '/' ? 1.0 : 
                    path.startsWith('/products') ? 0.8 : 
                    0.5;
    
    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
} 