// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://dakhakhny.com",
	integrations: [
		tailwind(),
		mdx(),
		// The thank-you page after a CV request is not worth indexing.
		sitemap({ filter: (page) => !page.endsWith("/cv/sent/") }),
	],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
