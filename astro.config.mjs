import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  outDir: 'dist',
  publicDir: 'public',
  site: 'https://news.sarjanakomputer.id',
  build: {
    format: 'directory',
  },
});
