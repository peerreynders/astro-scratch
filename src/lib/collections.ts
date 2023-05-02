// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './helpers';

type Featured = {
	data: {
		featured: boolean;
	};
};

const isFeatured = <E extends Featured>(entry: E) => entry.data.featured;

type DisplayOrder = {
	data: {
		displayOrder: number;
	};
};

const byDisplayOrder = <E extends DisplayOrder>(a: E, b: E) =>
	a.data.displayOrder - b.data.displayOrder;

async function fromWork() {
	const workEntries = await getCollection('work');
	// Note: sort is destructive so `slice()` first
	return workEntries.slice().sort(byDisplayOrder);
}

async function fromFeaturedWork() {
	const workEntries = await getCollection('work');
	// filter creates new array, no need to `slice()`
	return workEntries.filter(isFeatured).sort(byDisplayOrder);
}

type DateProp = {
	data: {
		date: Date;
	};
};

const byDateDesc = <E extends DateProp>(a: E, b: E) =>
	b.data.date.getTime() - a.data.date.getTime();

async function fromPosts() {
	const posts = await getCollection('posts');
	// Note: sort is destructive so `slice()` first
	return posts.slice().sort(byDateDesc);
}

export type Post = CollectionEntry<'posts'>;

const postToStaticPathsItem = (entry: Post) => ({
	params: {
		slug: entry.slug,
	},
	props: {
		entry,
	},
});

const fromPostsToStaticPaths = async () =>
	(await fromPosts()).map(postToStaticPathsItem);

export interface TagPosts {
	tag: string;
	posts: Post[];
}

function collectTagPosts(tagged: Map<string, TagPosts>, post: Post) {
	for (const tag of post.data.tags) {
		const slug = slugify(tag);
		const tagPosts = tagged.get(slug);

		if (tagPosts) {
			tagPosts.posts.push(post);
			continue;
		}

		tagged.set(slug, {
			tag,
			posts: [post],
		});
	}

	return tagged;
}

async function fromTagsToStaticPaths() {
	const all = await fromPosts();
	const tagged = all.reduce(collectTagPosts, new Map<string, TagPosts>());
	const staticPaths: { params: { tag: string }; props: TagPosts }[] = [];

	for (const [slug, props] of tagged) {
		staticPaths.push({
			params: {
				tag: slug,
			},
			props,
		});
	}

	return staticPaths;
}

export {
	fromFeaturedWork,
	fromPosts,
	fromPostsToStaticPaths,
	fromTagsToStaticPaths,
	fromWork,
};
