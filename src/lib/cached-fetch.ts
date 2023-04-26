// file: src/lib/cached-fetch.ts
import { readFile, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { z } from 'astro/zod';

export type Fetch = WindowOrWorkerGlobalScope['fetch'];

const schema = z.object({
	items: z.array(
		z.object({
			alt: z.string(),
			large: z.string(),
			medium: z.string(),
			small: z.string(),
			credit: z.string(),
		})
	),
});

const fromRelativePath = (relativePath: string) =>
	fileURLToPath(new URL(relativePath, import.meta.url));

async function fromFile(filePath: string) {
	const data = await readFile(filePath, 'utf8');
	const holder = schema.parse(JSON.parse(data));
	return holder.items;
}

async function fromLocalCopy(filePath: string, maxEpochMs: number) {
	try {
		const stats = await stat(filePath);
		if (maxEpochMs > stats.mtimeMs) return;
	} catch (_e) {
		return;
	}

	return fromFile(filePath);
}

async function fromRemote(fetch: Fetch, href: string, localPath: string) {
	let holder;
	try {
		const response = await fetch(href);
		if (!response.ok) return;
		const result = await response.json();
		holder = schema.parse(result);
	} catch (_e) {
		return;
	}

	if (!holder) return;

	try {
		await writeFile(localPath, JSON.stringify(holder), { encoding: 'utf8' });
	} finally {
		return holder.items;
	}
}

async function cachedFetch(
	paths: { href: string; local: string; fallback: string },
	fetch?: Fetch
) {
	const { href, local, fallback } = paths;
	const localPath = fromRelativePath(local);

	// Accept cached if less than 1 day (86_400_000 ms) old
	const cached = await fromLocalCopy(localPath, Date.now() - 86_400_000);
	if (cached) return cached;

	if (fetch) {
		const remote = await fromRemote(fetch, href, localPath);
		if (remote) return remote;
	}

	const fallbackPath = fromRelativePath(fallback);
	return fromFile(fallbackPath);
}

export { cachedFetch };
