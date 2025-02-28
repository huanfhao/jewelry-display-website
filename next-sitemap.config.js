/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://syjewelrydisplay.cn',
  generateRobotsTxt: false, // 因为我们已经手动创建了 robots.txt
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin/*', '/api/*'],
  generateIndexSitemap: false,
  // 移除 additionalPaths 配置，因为我们目前没有动态产品页面
  // 或者使用静态产品列表
  additionalPaths: async (config) => {
    // 静态产品列表
    const staticProducts = [
      { slug: 'necklace-displays' },
      { slug: 'ring-displays' },
      { slug: 'bracelet-displays' },
      { slug: 'earring-displays' },
      { slug: 'jewelry-sets' },
      { slug: 'custom-displays' }
    ];

    return staticProducts.map(product => ({
      loc: `/products/${product.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }));
  },
} 