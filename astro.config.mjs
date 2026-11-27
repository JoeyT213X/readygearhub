import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pwaIntegration from './scripts/pwa-integration.mjs';

// Keep noindex and utility routes out of the sitemap. /widgets/ is the public
// landing page and stays included; /widgets/alert/ is the embed itself.
const sitemapExclude = [
  '/thanks/',
  '/thank-you/',
  '/404',
  '/widgets/embed/',
  '/widgets/alert/',
  '/card-styles-preview/',
  '/shorts-preview/',
  '/image-credits/',
];

export default defineConfig({
  site: 'https://readygearhub.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !sitemapExclude.some((p) => page.includes(p)) }), pwaIntegration()],
});
