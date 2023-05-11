// file: src/types.ts

export type PaginationArgs = {
	anchor?: string;
	nextHref?: string;
	nextLabel?: string;
	previousHref?: string;
	previousLabel?: string;
};

export type PostArgs = {
	slug: string;
	title: string;
	date: Date;
	tags: [tag: string, href: string][];
};
