// file: src/lib/shame.ts
//
// `shame` as in ashamed for not thinking of a better
// name (or place) than "utils" or "helpers".
// credit: https://csswizardry.com/2013/04/shame-css/
//
import { slug } from 'github-slugger';
import { hrefFromTagSlug } from '../route-path';

// Force second argument to default
const slugify = (value: string) => slug(value);

const forPostDate = Intl.DateTimeFormat('en', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	timeZone: 'UTC',
});

const formatDateForPost = (date: Date) => forPostDate.format(date);

const toTagPair = (title: string) =>
	[title.replaceAll(' ', ''), hrefFromTagSlug(slugify(title))] as [
		string,
		string
	];
const makeTagPairs = (titles: string[]) => titles.map(toTagPair);

export { formatDateForPost, makeTagPairs, slugify };
