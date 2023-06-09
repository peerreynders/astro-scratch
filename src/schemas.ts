// file: src/schemas.ts
import { z } from 'astro/zod';

const imageSchema = z.object({
	src: z.string(),
	width: z.number(),
	height: z.number(),
	alt: z.string().default(''),
});

const people = z.object({
	name: z.string(),
	title: z.string(),
	key: z.number().int().positive().safe(),
	image: imageSchema,
});

const toDate = (value: string) => new Date(value);

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
	hero: imageSchema,
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
			image: imageSchema,
		})
	),
	team: z.array(z.coerce.string()),
});

export { people, posts, work };
