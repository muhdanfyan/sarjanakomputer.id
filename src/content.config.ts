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
    title: z.string().optional(),
    companyName: z.string(),
    heroSubtitle: z.string().optional(),
    namaResmi: z.string().optional(),
    bidangUsaha: z.string().optional(),
    didirikan: z.string().optional(),
    skKemenkumham: z.string().optional(),
    nib: z.string().optional(),
    npwp: z.string().optional(),
    lokasi: z.string().optional(),
    pendiri: z.string().optional(),
    jumlahPersonil: z.string().optional(),
    visi: z.string().optional(),
    misi: z.array(z.string()).optional(),
    tim: z.array(z.any()).optional(),
    kbli: z.array(z.any()).optional(),
    alamat: z.string().optional(),
    email: z.string().email().optional(),
    whatsapp: z.string().optional(),
    whatsapp_link: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    socialMedia: z.record(z.string()).optional(),
  }),
});

export const collections = {
  'news': newsCollection,
  'courses': coursesCollection,
  'classes': classesCollection,
  'profiles': profilesCollection,
};
