# Lesson 17: Meta info, RSS feeds and module recap

## Adding meta info

The `src/layouts/base.astro` layout component uses the `src/components/meta-info.astro` component to include social networking information in the page's [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) element:

```Astro
---
// file: src/components/meta-info.astro
import { fromImage } from '../lib/optimized-image'

interface Props {
  args: {
    siteName: string;
    title: string;
    metaTitle?: string;
    metaDesc?: string;
    summary?: string;
    socialImage?: string;
  };
}

const { args } = Astro.props;

const pageTitle = args.metaTitle
  ? args.metaTitle
  : args.siteName === args.title
  ? args.siteName
  : `${args.title} - ${args.siteName}`;
const metaDesc = args.metaDesc ? args.metaDesc : args.summary;
const { siteName, socialImage: maybePath } = args;
const socialImage =
  typeof maybePath === 'string' ?
    maybePath :
    (await fromImage({src: '/src/assets/meta/social-share.png'})).src;
const currentUrl = Astro.url;
---

<meta name="generator" content={Astro.generator} />
<title>{pageTitle}</title>
<link rel="canonical" href={currentUrl} />

<meta property="og:site_name" content={siteName} />
<meta property="og:title" content={pageTitle} />
<meta property="og:type" content="website" />
<meta property="og:url" content={currentUrl} />

{
  socialImage && (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:image" content={socialImage} />
      <meta name="twitter:image" content={socialImage} />
      <meta property="og:image:alt" content={`Page image for ${siteName}`} />
      <meta name="twitter:image:alt" content={`Page image for ${siteName}`} />
    </>
  )
}

{
  metaDesc && (
    <>
      <meta name="description" content={metaDesc} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="og:description" content={metaDesc} />
    </>
  )
}
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

`src/lib/optimized-image.ts` is discussed as part of [lesson 31](docs/31/index.md#adding-a-social-image-and-favicon). [`Astro.generator`](https://docs.astro.build/en/reference/api-reference/#astrogenerator) provides the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#content) value for the standard `generator` metadata [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name#standard_metadata_names_defined_in_the_html_specification).

- `og:` [Open Graph protocol](https://ogp.me/)
- `twitter:` [Twitter cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started)

`base.astro` draws the `siteName` from `src/consts.ts` (i.e. _Issue 33_):

```TypeScript
// file: src/consts.ts
const ISSUE_33 = 'Issue 33';

const SITE_NAME = ISSUE_33;
const AUTHOR_NAME = ISSUE_33;
const AUTHOR_EMAIL = 'hi@piccalil.li';

export { AUTHOR_EMAIL, AUTHOR_NAME, SITE_NAME };
```

```Astro
---
// file: src/layouts/base.astro
import MetaInfo from '../components/meta-info.astro';
import { SITE_NAME } from '../consts';

// …

interface Props {
  title: string;
  metaTitle?: string;
  metaDesc?: string;
  summary?: string;
  socialImage?: string;
}

// …
```

`title` is the only mandatory prop for `src/layouts/base.astro` that is typically provided by the container layout (e.g. `src/layouts/home.astro`). The remaining props `metaTitle`, `metaDesc`, `summary` and `socialImage` are optional.

In the case of the home page the single entry `home` collection holds content for `metaDesc`:

```markdown
---
# file: src/content/home/index.md
title: Issue 33
metaDesc: >
  A made up agency site that you build if you take 
  Learn Eleventy From Scratch, by Piccalilli
intro:
  eyebrow: Digital Marketing is our
  main: Bread & Butter
  summary: >
    Let us help you create the perfect campaign with our multi-faceted
    team of talented creatives.
  button:
    text: See our work
    url: /work
  image:
    src: ../../assets/bg/toast.jpg
    alt: Buttered toasted white bread
primaryCta:
  title: This is an agency that doesn’t actually exist
  summary: >
    This is the project site you build when you take the “Learn 
    Eleventy From Scratch” course so it is all made up as a pretend
    context. You will learn a lot about Eleventy by building this site
    though. Take the course today!
  button:
    text: Buy a copy
    url: https://learneleventyfromscratch.com
featuredWork:
  title: Selected work
  summary: >
    Some stuff that should give you an idea of 
    what we're all about.
studioFeed:
  title: From inside the studio
---
```

## Adding an RSS feed

[Setting up `@astrojs/rss`](https://docs.astro.build/en/guides/rss/#setting-up-astrojsrss).

Add the `@astrojs/rss` package:

```shell
pnpm add @astrojs/rss
```

… and some packages ([`markdown-it`](https://github.com/markdown-it/markdown-it), [`sanitize-html`](https://github.com/apostrophecms/sanitize-html)) for rendering the content:

```shell
pnpm add -D markdown-it @types/markdown-it sanitize-html @types/sanitize-html
```

Then create the RSS route `src/pages/rss.xml.ts`:

```TypeScript
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

export async function GET(context: APIContext) {
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
```

- Endpoint context: [`APIContext`](https://docs.astro.build/en/reference/api-reference/#endpoint-context)
- [`CollectionEntry` property `body`](https://docs.astro.build/en/reference/api-reference/#body)
- [RSS encoding examples](https://www.rssboard.org/rss-encoding-examples)

To access the RSS feed the site needs to be built and previewed, i.e.:

```shell
$ pnpm run build

$ pnpm run preview

> astro-scratch@0.0.0 preview /astro-scratch
> astro preview
 astro  v4.0.6 ready in 10 ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose
```

And then open the browser at `http://localhost:4321/rss.xml` to see the generated feed.

## Adding the RSS meta tag

To ensure that [`Astro.site`](https://docs.astro.build/en/reference/api-reference/#astrosite) returns the deployment site address the [configuration](https://docs.astro.build/en/reference/configuration-reference/#site) has to be updated:

```JavaScript
// file: astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://issue33.com',
});
```

Then a final tag can added to the `<head>` element of `meta-info.astro`:

```Astro
<link rel="alternate" type="application/rss+xml" href={ `${Astro.site}rss.xml` } />
```

---

[Next](../../README.md#lesson-18-setting-up-gulp)
