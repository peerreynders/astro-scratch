// file: src/schemas.ts
import { z } from 'astro/zod';
import type { SchemaContext } from 'astro:content';

const imageSchema = (image: SchemaContext['image']) =>
	z.object({
		src: image(),
		alt: z.string().default(''),
	});

// --- people

const peopleSchema = ({ image }: SchemaContext) =>
	z.object({
		name: z.string(),
		title: z.string(),
		key: z.number().int().positive().safe(),
		image: imageSchema(image),
	});

const people = { schema: peopleSchema };

// --- posts

const toDate = (value: string) => new Date(value);

const postsSchema = z.object({
	title: z.string(),
	date: z.string().transform(toDate),
	tags: z.array(z.string()),
});

const posts = { schema: postsSchema };

// --- work

const workSchema = ({ image }: SchemaContext) =>
	z.object({
		title: z.string(),
		summary: z.string(),
		displayOrder: z.number().int().positive().safe(),
		featured: z.boolean(),
		hero: imageSchema(image),
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
				image: imageSchema(image),
			})
		),
		team: z.array(z.coerce.string()),
	});

const work = { schema: workSchema };

// --- blog

const blogSchema = z.object({
	title: z.string(),
	anchor: z.string(),
	pageSize: z.number().gt(0),
	label: z.object({
		previous: z.string(),
		next: z.string(),
	}),
});

const blog = { schema: blogSchema };

// --- cta

const buttonSchema = z.object({
	text: z.string(),
	url: z.string(),
});

const ctaSchema = z.object({
	title: z.string(),
	summary: z.string(),
	button: buttonSchema,
});

const cta = { schema: ctaSchema };

// --- home

const homeSchema = ({ image }: SchemaContext) =>
	z.object({
		title: z.string(),
		metaTitle: z.string().optional(),
		metaDesc: z.string().optional(),
		intro: z.object({
			eyebrow: z.string(),
			main: z.string(),
			summary: z.string(),
			button: buttonSchema,
			image: imageSchema(image),
		}),
		primaryCta: ctaSchema,
		featuredWork: z.object({
			title: z.string(),
			summary: z.string(),
		}),
		studioFeed: z.object({
			title: z.string(),
		}),
		summary: z.string().optional(),
		socialImage: z.string().optional(),
	});

const home = { schema: homeSchema };

// --- studio

const imagePropsSchema = z.object({
	width: z.number().optional(),
	quality: z.number().optional(),
});

const sizeUnion = z.union([
	z.literal('large'),
	z.literal('medium'),
	z.literal('small'),
]);

const studioSchema = ({ image }: SchemaContext) =>
	z.object({
		src: image(),
		alt: z.string().default(''),
		credit: z.string().optional(),
		variants: z.record(sizeUnion, imagePropsSchema).optional(),
	});

const studio = { schema: studioSchema };

// --- tag

const tag = {
	schema: z.object({
		title: z.string(),
	}),
};

export { blog, cta, home, people, posts, studio, tag, work };
