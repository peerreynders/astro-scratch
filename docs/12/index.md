# Lesson 12: Blog post view, directory data and filters

## Creating our blog post layout

The file route that drives the generation of the post pages—`src/pages/blog/post/[...slug].astro`:

```Astro
---
// file: src/pages/blog/post/[...slug].astro
import type { CollectionEntry } from 'astro:content';
import { makeTagPairs } from '../../../lib/shame';
import { fromPosts, toPostsStaticPaths } from '../../../lib/collections';
import Post from '../../../layouts/post.astro';

export const getStaticPaths = async () =>
  toPostsStaticPaths(await fromPosts());

interface Props {
  entry: CollectionEntry<'posts'>;
}

const { entry } = Astro.props;
const postArgs = {
  slug: entry.slug,
  title: entry.data.title,
  date: entry.data.date,
  tags: makeTagPairs(entry.data.tags),
};
const { Content } = await entry.render();

---

<Post args={postArgs}>
  <Content />
</Post>
```

Note how the post [content](https://docs.astro.build/en/reference/api-reference/#render) is passed to the default [`<slot />`](https://docs.astro.build/en/core-concepts/astro-components/#slots) of the `src/layouts/post.astro` layout component.

```TypeScript
// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';

// …

export type Post = CollectionEntry<'posts'>;

const postToStaticPathsItem = (entry: Post) => ({
  params: {
    slug: entry.slug,
  },
  props: {
    entry,
  },
});

const toPostsStaticPaths = (entries: CollectionEntry<'posts'>[]) =>
  entries.map(postToStaticPathsItem);

// …
```

`postToStaticPathsItem()` is used to transform the `posts` collection to an array of objects that provide the [`slug`](https://docs.astro.build/en/reference/api-reference/#slug) as the page `param` to formulate the page route and the `posts` [`entry`](https://docs.astro.build/en/reference/api-reference/#collection-entry-type) itself as a page `prop` ([dynamic pages](https://docs.astro.build/en/core-concepts/routing/#example-dynamic-pages-at-multiple-levels)).

```Astro
---
// file: src/layouts/post.astro
import Base from './base.astro';
import PageHeader from '../components/page-header.astro';
import PostList from '../components/post-list.astro';
import Cta from '../components/cta.astro';
import { fromPostsRecommend } from '../lib/collections';
import { formatDateForPost } from '../lib/shame';

import '../styles/post.scss';

interface Props {
  args: {
    slug: string;
    title: string;
    date: Date;
    tags: [tag: string, href: string][];
  };
}

const {
  args: { slug, title, date, tags },
} = Astro.props;

const recommendPosts = await fromPostsRecommend([slug]);
---

<Base title={title}>
  <article>
    <PageHeader title={title}>
      <time datetime={date.toISOString()}>{formatDateForPost(date)}</time>
      {
        tags.length > 0 && (
          <>
            <p class="u-visually-hidden" id="tags-desc">
              Tags that this post has been filed under.
            </p>
            <ul class="c-tag-list" aria-describedby="tags-desc">
              {tags.map(([tag, tagHref]) => (
                <li>
                  <a href={tagHref}>{'#' + tag}</a>
                </li>
              ))}
            </ul>
          </>
        )
      }
    </PageHeader>
    <div class="c-post-content u-flow">
      <slot />
    </div>
    {
      recommendPosts && recommendPosts.length > 0 && (
        <footer>
          <PostList headline={'More from the blog'} posts={recommendPosts} />
        </footer>
      )
    }
  </article>
  <Cta />
</Base>
```

The `src/pages/blog/post/[...slug].astro` route restructured the `posts` entry to the `post.astro` layout's `args` prop. The `page-header.astro` component is passed the formatted date and tags (links) list as content while the `<slot />` receives the actual post content. This is followed by a `post-list.astro` of the passed `recommendPosts`. The layout closes with the default `cta.astro` component.

## Filters

The [`<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time) element's `datetime` attribute is provided straight from [`Data.prototype.toISOString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) while `formatPostDate()` leverages the standard [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat). If any reuse was indicated this could very easily be factored out as a separate component for the sake of consistency.

```TypeScript
// …

const forPostDate = Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const formatDateForPost = (date: Date) => forPostDate.format(date);

// …
```

In short, Astro has no need for [nunjucks filter functionality](https://mozilla.github.io/nunjucks/api.html#custom-filters).

## Default layout and permalinks

To recap:

- The blog post page generation is driven by the `src/pages/blog/post/[...slug].astro` route via the [`getStaticPaths()`](https://docs.astro.build/en/reference/api-reference/#getstaticpaths) mechanism fed by the contents of the `posts` collection.
- This route uses the `src/layouts/post.astro` layout component to generate each page.
- The [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) notaton `[...slug].astro` in the route path template can accept multiple path segments in the `slug`. However in this context it's just used as a “catch-all” route; meanwhile the `slug` originates from the entry's [`slug`](https://docs.astro.build/en/reference/api-reference/#slug) as it was selected and placed on the [page `params`](https://docs.astro.build/en/reference/api-reference/#params) by `toPostStaticPathsItem()`.

---

[Next](../../README.md#lesson-13-recommended-content)
