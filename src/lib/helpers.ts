// file: src/lib/helpers.ts
import { slug } from 'github-slugger';

// Force second argument to default
const slugify = (value: string) => slug(value);

const forPostDate = Intl.DateTimeFormat('en', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
});

const formatDateForPost = (date: Date) => forPostDate.format(date);

export { slugify, formatDateForPost };
