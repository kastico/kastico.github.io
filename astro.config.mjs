import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';

const src = (p) => fileURLToPath(new URL(p, import.meta.url));

const codeFrame = {
  name: 'code-frame',
  root(root) {
    const meta = this.options.meta?.__raw ?? '';
    const title = meta.match(/title="([^"]+)"/)?.[1] ?? this.options.lang;

    root.children = [
      {
        type: 'element',
        tagName: 'figure',
        properties: { class: 'code-frame' },
        children: [
          {
            type: 'element',
            tagName: 'figcaption',
            properties: { class: 'code-head' },
            children: [
              { type: 'element', tagName: 'span', properties: { class: 'code-title' }, children: [{ type: 'text', value: title }] },
              { type: 'element', tagName: 'button', properties: { type: 'button', class: 'code-copy', 'aria-label': 'Copiar código' }, children: [{ type: 'text', value: 'Copiar' }] },
            ],
          },
          ...root.children,
        ],
      },
    ];
  },
};

export default defineConfig({
  site: 'https://bunker-labs.dev',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      transformers: [codeFrame],
    },
  },
  vite: {
    resolve: {
      alias: {
        '@components': src('./src/components'),
        '@': src('./src'),
      },
    },
  },
});
