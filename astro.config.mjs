import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://kastico.github.io',
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
        '@': '/src',
      }
    }
  }
});
