import { Plugin } from 'vite';
import { writeFileSync } from 'fs';
import { join } from 'path';
import axios from 'axios';

interface SitemapPluginOptions {
  siteUrl: string;
  apiUrl: string;
}

export function sitemapPlugin(options: SitemapPluginOptions): Plugin {
  const { siteUrl, apiUrl } = options;

  return {
    name: 'vite-sitemap-plugin',
    apply: 'build',
    async closeBundle() {
      try {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Static pages
        const staticPages = [
          { loc: siteUrl, priority: '1.0', changefreq: 'daily' },
          { loc: `${siteUrl}/details`, priority: '0.8', changefreq: 'daily' },
          { loc: `${siteUrl}/contacts`, priority: '0.5', changefreq: 'monthly' },
          { loc: `${siteUrl}/delivery-and-payment`, priority: '0.5', changefreq: 'monthly' },
        ];

        for (const page of staticPages) {
          xml += `  <url>\n    <loc>${page.loc}</loc>\n    <priority>${page.priority}</priority>\n    <changefreq>${page.changefreq}</changefreq>\n  </url>\n`;
        }

        // Fetch products from API
        try {
          const res = await axios.get(`${apiUrl}/api/seo/products`, { timeout: 10000 });
          const { trailers, components } = res.data;

          for (const t of trailers) {
            const date = t.updatedAt ? new Date(t.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            xml += `  <url>\n    <loc>${siteUrl}/product/${t.slug}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>0.9</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
          }

          for (const c of components) {
            const date = c.updatedAt ? new Date(c.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            xml += `  <url>\n    <loc>${siteUrl}/details/${c.id}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
          }
        } catch (err) {
          console.warn('[Sitemap] Could not fetch products from API:', err.message);
        }

        xml += `</urlset>`;

        const outDir = process.env.VITE_OUT_DIR || './dist';
        const sitemapPath = join(outDir, 'sitemap.xml');
        writeFileSync(sitemapPath, xml, 'utf-8');
        console.log(`[Sitemap] Generated ${sitemapPath}`);
      } catch (err) {
        console.error('[Sitemap] Failed to generate sitemap:', err);
      }
    },
  };
}
