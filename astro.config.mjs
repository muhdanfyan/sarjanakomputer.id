import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  outDir: 'dist',
  publicDir: 'public',
  site: 'https://sarjanakomputer.id',
  build: {
    format: 'directory',
  },
});
