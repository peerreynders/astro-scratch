import { z } from 'astro/zod';

const toDate = (value: string) => new Date(value);

const people = z.object({
	name: z.string(),
	title: z.string(),
	key: z.number().int().positive().safe(),
	image: z.string(),
});

const posts = z.object({
	title: z.string(),
	date: z.string().transform(toDate),
	tags: z.array(z.string()),
});

const work = z.object({
	title: z.string(),
	summary: z.string(),
	displayOrder: z.number().int().positive().safe(),
	featured: z.boolean(),
	hero: z.object({
		image: z.string(),
		imageAlt: z.string(),
	}),
	keyFacts: z.array(
		z.object({
			primary: z.string(),
			secondary: z.string(),
		})
	),
	gallery: z.array(
		z.object({
			title: z.string(),
			summary: z.string(),
			image: z.string(),
		})
	),
});

export { people, posts, work };
