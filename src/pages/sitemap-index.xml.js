const pages = [
  { url: '/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '1.0' },
  { url: '/catalog', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '0.8' },
  { url: '/services', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '0.7' },
  { url: '/gallery', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '0.7' },
  { url: '/contact', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.5' },
  { url: '/login', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.3' },
  { url: '/register', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.3' },
];

export async function get() {
  return {
    body: `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map(
            (page) => `
            <sitemap>
              <loc>https://hilo-magico.com${page.url}</loc>
              <lastmod>${page.lastmod}</lastmod>
              <changefreq>${page.changefreq}</changefreq>
              <priority>${page.priority}</priority>
            </sitemap>
          `
          )
          .join('')}
      </sitemapindex>`.trim(),
    encoding: 'utf-8',
  };
}
