// file: src/content/config.ts
// Use `npx astro sync` to generate the `astro:content` module
//
import { defineCollection } from 'astro:content';
import { cta, people, posts, work } from '../schemas';

export const collections = {
	cta: defineCollection({ schema: cta }),
	people: defineCollection({ schema: people }),
	posts: defineCollection({ schema: posts }),
	work: defineCollection({ schema: work }),
};
