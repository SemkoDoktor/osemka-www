// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.osemka.info',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
