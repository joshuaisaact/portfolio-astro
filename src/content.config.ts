import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    order: z.number().optional(),
    imageSrc: z.union([z.string(), image()]).optional(),
    imageAlt: z.string().optional(),
    links: z.array(z.object({
      type: z.enum(['live', 'github', 'blog', 'submission']),
      url: z.string().url(),
      label: z.string(),
    })),
    skills: z.array(z.string()),
    overview: z.string().optional(),
    features: z.array(z.string()).optional(),
    architecture: z.object({
      frontend: z.string().optional(),
      backend: z.string().optional(),
      testing: z.string().optional(),
      infrastructure: z.string().optional(),
    }).optional(),
    videoSrc: z.string().optional(),
    videoPreviewSrc: z.string().optional(),
    posterImage: z.union([z.string(), image()]).optional(),
    award: z.string().optional(),
    projectType: z.enum(['application', 'tool', 'library', 'starter']).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/blog" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string(),
    featured_image: image(),
    excerpt: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = { projects, blog };
