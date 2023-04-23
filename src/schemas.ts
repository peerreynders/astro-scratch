import { z } from 'astro/zod';

const toDate = (value: string) => new Date(value);

const posts = z.object({
	title: z.string(),
	date: z.string().transform(toDate),
	tags: z.array(z.string()),
});

export { posts };
