import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
	const posts = await getCollection("post");
	return rss({
		title: "Aria",
		description: "My personal blog & portfolio",
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: new Date(post.data.dateFormatted),
			link: `/post/${post.id}/`,
		})),
	});
}
