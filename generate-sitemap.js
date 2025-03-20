// generate-sitemap.js
const fs = require('fs');
const path = require('path');
const sitemap = require('sitemap');

// Defina as URLs do seu site
const pages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/404', changefreq: 'monthly', priority: 0.7 },
  // Adicione outras páginas aqui
];

// Defina a URL base do seu site (altere para seu domínio real)
const sitemapUrls = pages.map(page => ({
  url: `https://www.seusite.com${page.url}`,
  changefreq: page.changefreq,
  priority: page.priority,
}));

// Crie o sitemap
const sitemapXML = sitemap.createSitemap({
  hostname: 'https://www.seusite.com',
  urls: sitemapUrls,
});

// Salve o arquivo sitemap.xml
fs.writeFileSync(path.resolve(__dirname, 'dist', 'sitemap.xml'), sitemapXML.toString());
