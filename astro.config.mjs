import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://bunker-labs.dev',
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
        '@': '/src',
      }
    }
  }
});
