import { defineConfig } from 'astro/config';

export default defineConfig({
  outDir: 'dist',
  publicDir: 'public',
  site: 'https://sarjanakomputer.id',
  build: {
    format: 'directory',
  },
});
