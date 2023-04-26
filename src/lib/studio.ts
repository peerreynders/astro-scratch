// file: src/lib/studio.ts
import { cachedFetch, type Fetch } from './cached-fetch';

const sourcePaths = {
	href: 'https://11ty-from-scratch-content-feeds.piccalil.li/media.json',
	local: '../../media.json',
	fallback: '../../media.fallback.json',
};

// Switch lines to use `fetch`
// const studio = (fetch: Fetch) => cachedFetch(sourcePaths, fetch);
const studio = (_fetch: Fetch) => cachedFetch(sourcePaths);

export { studio, studio as default };
