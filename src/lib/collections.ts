// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './shame';

type Featured = {
	data: {
		featured: boolean;
	};
};

const isFeatured = <E extends Featured>(entry: E) => entry.data.featured;

type WithOrder = {
	data: {
		displayOrder: number;
	};
};

const byOrderAsc = <E extends WithOrder>(a: E, b: E) =>
	a.data.displayOrder - b.data.displayOrder;

async function fromWork() {
	const entries = await getCollection('work');
	// Note: sort is destructive so `slice()` first
	return entries.slice().sort(byOrderAsc);
}

async function fromFeaturedWork() {
	const workEntries = await getCollection('work');
	// filter creates new array, no need to `slice()`
	return workEntries.filter(isFeatured).sort(byOrderAsc);
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

async function fromPostsRecommend(exclude: string[], limit = 3, random = true) {
	const posts = await getCollection('posts');

	const length = posts.length;
	const remain = length - exclude.length;
	const n = remain > limit ? limit : remain;

	const recommend: CollectionEntry<'posts'>[] = [];
	const excludeSlugs = new Set(exclude);

	const postIndex = random
		? (_index: number) => Math.trunc(Math.random() * length)
		: (index: number) => index;

	// Ensure finite looping
	for (let i = 0; recommend.length < n && i < length; i += 1) {
		const post = posts[postIndex(i)];

		// Don't use post with excluded slug
		if (excludeSlugs.has(post.slug)) continue;

		recommend.push(post);
		excludeSlugs.add(post.slug);
	}

	return recommend;
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

type WithSlug = {
	slug: string;
};

const bySlugAsc = <E extends WithSlug>(a: E, b: E) =>
	a.slug < b.slug ? -1 : a.slug === b.slug ? 0 : 1;

async function fromPeople() {
	const entries = await getCollection('people');
	// Note: sort is destructive so `slice()` first
	return entries.slice().sort(bySlugAsc);
}

export {
	fromFeaturedWork,
	fromPeople,
	fromPosts,
	fromPostsRecommend,
	fromPostsToStaticPaths,
	fromTagsToStaticPaths,
	fromWork,
};
