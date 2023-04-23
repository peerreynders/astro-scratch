// file: src/content/config.ts
// Use `npx astro sync` to generate the `astro:content` module
//
import { defineCollection } from 'astro:content';
import { posts } from '../schemas';

export const collections = {
	posts: defineCollection({ schema: posts }),
};
