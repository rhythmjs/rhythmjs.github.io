import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const docs = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/docs",
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { docs };
