# Template samples

The Aria template's example posts and images. They were written by the template's author, not by Ahmed. They're kept here for reference, and nothing in this folder is built or deployed.

| Here | Was | Used by |
|---|---|---|
| `post/*.md` | `src/content/post/` | the `post` collection → `/post/[slug]` |
| `images/posts/` | `public/assets/images/posts/` | nothing (the posts use remote images) |
| `images/projects/` | `public/assets/images/projects/` | nothing (`projects.json` uses remote images) |

The Posts and Projects pages are kept as `src/pages/_posts.astro` and `src/pages/_projects.astro`. Astro skips files that start with `_`. To turn one back on:

1. Rename the page without the underscore, e.g. `_posts.astro` → `posts.astro`.
2. Add it to `src/collections/menu.json`.
3. Put real content in place: your own posts in `src/content/post/`, your own entries in `src/collections/projects.json`.
4. Optionally add the home-page sections back in `src/pages/index.astro`: `components/home/writings.astro` and `components/home/projects.astro`.

Anything moved back into `src/content/post/` is published at `/post/<name>`.
