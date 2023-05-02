// file: src/types.ts

export type PaginationArgs = {
	anchor?: string;
	nextHref?: string;
	nextLabel?: string;
	previousHref?: string;
	previousLabel?: string;
};

export type PostArgs = {
	title: string;
	date: Date;
};
