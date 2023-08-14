// file: src/types.ts

export type PaginationArgs = {
	anchor?: string;
	next?: {
		href: string;
		label?: string;
	};
	previous?: {
		href: string;
		label?: string;
	};
};
