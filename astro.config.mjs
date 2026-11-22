// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.osemka.info',
  trailingSlash: 'always',
  // strony techniczne newslettera nie trafiają do mapy strony
  integrations: [sitemap({ filter: (page) => !page.includes('/newsletter/') })],
});
