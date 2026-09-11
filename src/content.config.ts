import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		dateFormatted: z.string(),
	}),
});

export const collections = { post };
