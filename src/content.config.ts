import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    image: z.string(),
    description: z.string(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

const coursesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/courses" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    image: z.string(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    category: z.string(),
    duration: z.string().optional(),
  }),
});

const classesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/classes" }),
  schema: z.object({
    name: z.string(),
    course: z.string(), // slug reference
    mentor: z.string(),
    startDate: z.coerce.date(),
    status: z.enum(['Open', 'Closed', 'Ongoing']),
    capacity: z.number().optional(),
  }),
});

const profilesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/profiles" }),
  schema: z.object({
    companyName: z.string(),
    address: z.string(),
    email: z.string().email(),
    phone: z.string(),
    socialMedia: z.record(z.string()).optional(),
  }),
});

export const collections = {
  'news': newsCollection,
  'courses': coursesCollection,
  'classes': classesCollection,
  'profiles': profilesCollection,
};
