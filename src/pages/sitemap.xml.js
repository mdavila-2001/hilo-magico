// src/pages/sitemap.xml.js
export async function get() {
  // URLs estáticas del sitio
  const pages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/catalogo', changefreq: 'weekly', priority: 0.9 },
    { url: '/servicios', changefreq: 'weekly', priority: 0.8 },
    { url: '/contacto', changefreq: 'monthly', priority: 0.7 },
    { url: '/sobre-nosotros', changefreq: 'monthly', priority: 0.6 },
  ];

  // Aquí podrías agregar URLs dinámicas (ej: productos, categorías, etc.)
  // const products = await fetchProducts();
  // products.forEach(product => {
  //   pages.push({
  //     url: `/productos/${product.slug}`,
  //     changefreq: 'weekly',
  //     priority: 0.8,
  //     lastmod: product.updatedAt
  //   });
  // });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(page => {
          return `
            <url>
              <loc>https://hilo-magico.com${page.url}</loc>
              <changefreq>${page.changefreq}</changefreq>
              <priority>${page.priority}</priority>
              ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : ''}
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  return {
    body: sitemap,
    encoding: 'utf-8',
  };
}
