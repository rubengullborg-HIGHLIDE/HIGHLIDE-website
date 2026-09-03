import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const changelog = defineCollection({
    loader: glob({
        base: "./src/content/changelog",
        pattern: "**/*.md",
    }),
    schema: z.object({
        version: z.string(),
        label: z.string(),
        date: z.coerce.date(),
        summary: z.string(),
    }),
});

export const collections = { changelog };
