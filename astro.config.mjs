import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pwaIntegration from './scripts/pwa-integration.mjs';

export default defineConfig({
  site: 'https://readygearhub.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.includes('/thanks/') && !page.includes('/thank-you/') && !page.includes('/404') && !page.includes('/widgets/embed/') }), pwaIntegration()],
});
