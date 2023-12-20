// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './shame';

// --- 'work' collection
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
	const workEntries = await getCollection('work', isFeatured);
	return workEntries.slice().sort(byOrderAsc);
}

export type Work = CollectionEntry<'work'>;

const workToStaticPathsItem = (entry: Work) => ({
	params: {
		slug: entry.slug,
	},
	props: {
		entry,
	},
});

const fromWorkToStaticPaths = async () =>
	(await fromWork()).map(workToStaticPathsItem);

// --- 'posts' collection
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

export type Post = CollectionEntry<'posts'>;

const postToStaticPathsItem = (entry: Post) => ({
	params: {
		slug: entry.slug,
	},
	props: {
		entry,
	},
});

const toPostsStaticPaths = (entries: CollectionEntry<'posts'>[]) =>
	entries.map(postToStaticPathsItem);

// --- tags derived from 'posts' collection
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

function toTagsStaticPaths(entries: CollectionEntry<'posts'>[]) {
	const tagged = entries.reduce(collectTagPosts, new Map<string, TagPosts>());
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

// --- 'people' collection
type WithSlug = {
	slug: string;
};

const collator = new Intl.Collator();

const bySlugAsc = <E extends WithSlug>(
	{ slug: aSlug }: E,
	{ slug: bSlug }: E
) => collator.compare(aSlug, bSlug);

async function fromPeople() {
	const entries = await getCollection('people');
	// Note: sort is destructive so `slice()` first
	return entries.slice().sort(bySlugAsc);
}

const keepSlugEntries = <E extends WithSlug>(
	collection: E[],
	slugs: string[]
) => collection.filter((entry) => slugs.includes(entry.slug));

// --- 'studio' collection
const fromStudio = (): Promise<CollectionEntry<'studio'>[]> =>
	getCollection('studio');

type FeedEntry = {
	src: ImageMetadata;
	alt: string;
	width: number | undefined;
	quality: number | undefined;
	slug: string;
};

const toStudioFeed = (entries: CollectionEntry<'studio'>[]) =>
	entries
		.reduce<FeedEntry[]>((selected, entry) => {
			const { variants } = entry.data;
			if (variants && variants.medium) {
				const { width, quality } = variants.medium;
				selected.push({
					src: entry.data.src,
					alt: entry.data.alt,
					width,
					quality,
					slug: entry.slug,
				});
			}
			return selected;
		}, [])
		.sort(bySlugAsc);

// --- single entry collections: 'blog', 'cta', 'home', 'tag'
function singleEntry<C extends 'blog' | 'cta' | 'home' | 'tag'>(
	collection: C
): () => Promise<CollectionEntry<C>> {
	return async () => {
		const entries = await getCollection(collection);
		const entry = entries.length > 0 ? entries[0] : undefined;
		if (!entry) throw new Error(`Missing "${collection}" content`);

		return entry;
	};
}

const fromBlog = singleEntry('blog');

const fromCta = singleEntry('cta');
export type CtaData = CollectionEntry<'cta'>['data'];

const fromHome = singleEntry('home');

const fromTag = singleEntry('tag');

export {
	fromBlog,
	fromCta,
	fromFeaturedWork,
	fromHome,
	fromPeople,
	fromPosts,
	fromPostsRecommend,
	fromStudio,
	fromTag,
	fromWork,
	fromWorkToStaticPaths,
	keepSlugEntries,
	toPostsStaticPaths,
	toStudioFeed,
	toTagsStaticPaths,
};
