// file: src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import type { CollectionEntry } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

import { AUTHOR_EMAIL, SITE_NAME } from '../consts';
import { fromPosts } from '../lib/collections';
import { hrefFromPostSlug } from '../route-path';

const parser = new MarkdownIt();

function postToFeedItem(post: CollectionEntry<'posts'>) {
	const description = post.body
		? `<![CDATA[${sanitizeHtml(parser.render(post.body))}]]>`
		: undefined;

	return {
		title: post.data.title,
		pubDate: post.data.date,
		link: hrefFromPostSlug(post.slug),
		description,
	};
}

const title = `${SITE_NAME} Blog`;
const summary = 'A feed of the latest posts from our blog.';
const defaultSite = 'https://issue33.com';

export async function get(context: APIContext) {
	const channelCustom = [
		'<language>en</language>',
		`<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
		`<managingEditor>${AUTHOR_EMAIL}</managingEditor>`,
		`<webMaster>${AUTHOR_EMAIL}</webMaster>`,
		`<generator>${context.generator}</generator>`,
	];
	const entries = await fromPosts();

	return rss({
		title,
		description: summary,
		site: context.site?.href ?? defaultSite,
		items: entries.map(postToFeedItem),
		customData: channelCustom.join('\n'),
	});
}
