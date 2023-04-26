// file: src/lib/collections.ts
import { getCollection } from 'astro:content';

type Featured = {
	data: {
		featured: boolean;
	};
};

const isFeatured = <E extends Featured>(entry: E) => entry.data.featured;

// Not destructive, no need to `slice()`
const keepFeatured = <E extends Featured>(collection: E[]) =>
	collection.filter(isFeatured);

type DisplayOrder = {
	data: {
		displayOrder: number;
	};
};

const byDisplayOrder = <E extends DisplayOrder>(a: E, b: E) =>
	a.data.displayOrder - b.data.displayOrder;

// Note: sort is destructive so `slice()` first
const sortByDisplayOrder = <E extends DisplayOrder>(collection: E[]) =>
	collection.sort(byDisplayOrder);

async function fromWork() {
	const workEntries = await getCollection('work');
	return sortByDisplayOrder(workEntries.slice());
}

async function fromFeaturedWork() {
	const workEntries = await getCollection('work');
	return sortByDisplayOrder(keepFeatured(workEntries));
}

export { fromFeaturedWork, fromWork };
