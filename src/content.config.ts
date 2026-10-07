import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

//BLOG
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      pinned: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
    }),
});

//VAULTS
const vaults = defineCollection({
  loader: glob({ base: './src/content/vaults', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      pinned: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
    }),
});

//PROJECTS
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      bannerImage: image().optional(),          // imagem do banner (se faltar, usa heroImage)
      showBanner: z.boolean().default(true),    // false = bannerLayout: none
      bannerLayout: z.enum(['below', 'right', 'left', 'background', 'none']).default('below'),
      bannerRatio: z.string().optional(),       // ex: "21/9", "16/9", "4/5", "1/1", "auto"
      bannerFit: z.enum(['cover', 'contain']).default('cover'),
      bannerSize: z.enum(['sm', 'md', 'lg']).default('md'),
      bannerPosition: z.string().default('center'),
      status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold']).default('Planning'),
      vault: z.string(),
      tags: z.array(z.string()).default([]),
      features: z.array(z.string()).default([]),
      tech: z.array(z.string()).default([]),
      demoUrl: z.string().url().optional(),
      githubUrl: z.string().url().optional(),
      websiteUrl: z.string().url().optional(),
      pdf: z.string().optional(),
    }),
});

//PAGES
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      heroImage: image().optional(),
    }),
});

export const collections = { blog, pages, vaults, projects};
