// file: src/content/config.ts
// Use `npx astro sync` to generate the `astro:content` module
//
import { defineCollection } from 'astro:content';
import { cta, home, people, posts, studio, tag, work } from '../schemas';

export const collections = {
	cta: defineCollection(cta),
	home: defineCollection(home),
	people: defineCollection(people),
	posts: defineCollection(posts),
	studio: defineCollection(studio),
	tag: defineCollection(tag),
	work: defineCollection(work),
};
