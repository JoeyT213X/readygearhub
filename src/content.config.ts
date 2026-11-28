import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Listings: one Markdown file per product in src/content/items/
const items = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/items' }),
  schema: z.object({
    name: z.string(),
    brand: z.string(),
    lane: z.string(),                       // primary lane slug (must exist in src/data/lanes.json)
    alsoIn: z.array(z.string()).default([]), // extra lanes this item should appear in
    tags: z.array(z.string()).default([]),
    description: z.string(),                 // 1-2 sentence summary
    uses: z.array(z.string()).default([]),   // multi-purpose angles
    officialUrl: z.string().url(),
    affiliateUrl: z.string().url().optional().or(z.literal('')), // fill once approved by the program
    rank: z.number().int().min(0).default(0), // 1 = top trending; 0 = not trending
    featured: z.boolean().default(false),     // paid/featured placement (future)
    season: z.array(z.enum(['winter', 'spring', 'summer', 'fall', 'hurricane', 'all-season'])).default(['all-season']),
    price: z.string().optional(),             // shown price as the maker lists it, e.g. "$220" or "From $108.00"; needs priceDate
    priceDate: z.string().optional(),         // date that price was checked (YYYY-MM-DD); no date = the price is not shown
    priceNote: z.string().optional(),         // optional plain note (source, size, "regular list price")
    verified: z.string().optional(),          // date the official URL was last checked (YYYY-MM-DD)
    draft: z.boolean().default(false),
  }),
});

// Guides: long-form helpful articles in src/content/guides/
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lane: z.string().optional(),
    season: z.array(z.string()).default(['all-season']),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    relatedItems: z.array(z.string()).default([]), // item file names without .md
    directory: z.string().optional(),               // /directory/<slug>/ this guide points to (defaults by lane)
    siblings: z.array(z.string()).default([]),      // 2 sibling guide slugs (defaults to the closest guides)
    draft: z.boolean().default(false),
  }),
});

export const collections = { items, guides };
