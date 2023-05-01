// file: src/content/config.ts
// Use `npx astro sync` to generate the `astro:content` module
//
import { defineCollection } from 'astro:content';
import { people, posts, work } from '../schemas';

export const collections = {
	people: defineCollection({ schema: people }),
	posts: defineCollection({ schema: posts }),
	work: defineCollection({ schema: work }),
};
