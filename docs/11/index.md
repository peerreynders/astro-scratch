# Lesson 11: Blog feeds, tags and pagination

## Our blog data

The blog posts are stored under `src/content/posts`:

```markdown
---
# file: src/content/posts/why-cross-cultural-design-really-matters.md
title: 'Why cross-cultural design really matters'
date: '2020-04-01'
tags: ['Culture', 'Design Thinking']
---

… lots of lorem ipsum content …
```

Being markdown, it is classified as [_content_ rather than _data_](https://docs.astro.build/en/guides/content-collections/#what-are-content-collections). The only difference is that _content_ has _content_ in addition to the “shape of data” that is declared in the schema:

```TypeScript
// file: src/schemas.ts
import { z } from 'astro/zod';

// …

// --- posts

const toDate = (value: string) => new Date(value);

const postsSchema = z.object({
  title: z.string(),
  date: z.string().transform(toDate),
  tags: z.array(z.string()),
});

// …
```

Note how Zod's [`transform()`](https://zod.dev/?id=transform) is used to convert the string in the file to a [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). Note the [caveats](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format) of the chosen date/time string format; `'2020-04-01'` would be interpreted as UTC and the build server locale is used if a time is supplied without a timezone.

In a single [`CollectionEntry<TName>`](https://docs.astro.build/en/reference/api-reference/#collection-entry-type) value:

- [`data`](https://docs.astro.build/en/reference/api-reference/#data) holds the data portion (e.g. frontmatter) for a single entry of the `TName` collection while
- [`body`](https://docs.astro.build/en/reference/api-reference/#data) holds the content as a `string` and
- [`render`](https://docs.astro.build/en/reference/api-reference/#render) is a function that generates a result that includes a `Content` component for rendering the content in an Astro file.

## Creating our feeds

The `fromPosts()` helper sorts the posts entries by descending date:

```TypeScript
// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';

// …

// --- 'posts' collection
type DateProp = {
  data: {
    date: Date;
  };
};

const byDateDesc = <E extends DateProp>(a: E, b: E) =>
  b.data.date.getTime() - a.data.date.getTime();

async function fromPosts() {
  const posts = await getCollection('posts');
  // Note: sort is destructive so `slice()` first
  return posts.slice().sort(byDateDesc);
}

// …
```

## Creating our feed

The `src/layouts/feed.astro` layout expects an array of `CollectionEntry<'posts'>` as a prop which is passed by the `src/pages/blog/[...page].astro` route:

```Astro
---
// file: src/layouts/feed.astro
import type { CollectionEntry } from 'astro:content';
import type { PaginationArgs } from '../types';
import Base from './base.astro';
import PageHeader from '../components/page-header.astro';
import PostList from '../components/post-list.astro';
import Pagination from '../components/pagination.astro';
import Cta from '../components/cta.astro';

import '../styles/feed.scss';

interface Props {
  title: string;
  tag?: string;
  posts: CollectionEntry<'posts'>[];
  pagination?: PaginationArgs;
}

const { title, tag, posts, pagination } = Astro.props;
const headerTitle = tag ? `Blog posts filed under “${tag}”` : title;
---

<Base title={title}>
  <article>
    <PageHeader title={headerTitle}>
      <slot name="feed-summary" />
    </PageHeader>
    <PostList posts={posts} />
    {pagination && <Pagination args={pagination} />}
  </article>
  <Cta />
</Base>
```

`feed.astro` uses the `src/components/page-header.astro` component. Notice how `feed.astro` declares a [named slot](https://docs.astro.build/en/core-concepts/astro-components/#named-slots); it didn't have to be named here but in this case the name identifies its role/purpose; that content is passed on to `src/components/page-header.astro` as child content.

```Astro
---
// file: src/components/page-header.astro

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="c-page-header">
  <div class="c-page-header__wrapper u-flow">
    <!-- prettier-ignore -->
    <h1>{title}</h1>
    {
      Astro.slots.has('default') && (
        <div class="c-page-header__content">
          <slot />
        </div>
      )
    }
  </div>
</div>
```

Slots capabilities are gathered under [`Astro.slots`](https://docs.astro.build/en/reference/api-reference/#astroslots) and in this particular case `Astro.slots.has('default')` is used to detect whether any child content has been passed, so that the content wrapper is only applied in combination with actual content. The slot is named in the context of `feed.astro` so that `[...page].astro` can use it; in the context of `page-header.astro` it's just considered regular child content which is referred to by the name of `default`.

`feed.astro` also uses the `src/components/post-list.astro` component which it passes the `posts` to:

```Astro
---
// file: src/components/post-list.astro
import type { CollectionEntry } from 'astro:content';
import { hrefFromPostSlug } from '../route-path';

interface Props {
  posts: CollectionEntry<'posts'>[];
  headline?: string;
}

const { headline, posts } = Astro.props;
---

<div class="c-post-list" id="post-list">
  <div class="c-post-list__wrapper u-flow">
    {
      headline && /* prettier-ignore */ <h2 class="c-post-list__header">{headline}</h2>
    }
    <div>
      <ol class="u-flow">
        {
          posts.map((item) => (
            <li class="c-post-list__item">
              <a href={hrefFromPostSlug(item.slug)} class="c-post-list__link">
                {item.data.title}
              </a>
            </li>
          ))
        }
      </ol>
    </div>
  </div>
</div>
```

## Wiring up our data

`src/content/blog` holds a single entry with the settings common across all rendered feed pages:

```markdown
---
# file: src/content/blog/index.md
title: The Issue 33 Blog
anchor: '#post-list'
pageSize: 5
label:
  previous: Newer posts
  next: Older posts
---

The latest articles from around the studio, demonstrating our design
thinking, strategy and expertise.
```

Apart from the `title` and `summary` (the content), the pagination configuration data is found here. `fromBlog()` is used by the `src/pages/[...page].astro` route:

```Astro
---
// file: src/pages/blog/[...page].astro
import type { GetStaticPathsOptions } from 'astro';
import { fromBlog, fromPosts } from '../../lib/collections';
import Feed from '../../layouts/feed.astro';

export async function getStaticPaths(options: GetStaticPathsOptions) {
  const [blog, posts] = await Promise.all([fromBlog(), fromPosts()]);
  return options.paginate(posts, { pageSize: blog.data.pageSize });
}

const { page } = Astro.props;
const { data: { anchor, label, title }, render } = await fromBlog();
const { Content: Summary } = await render();

const next = page.url.next ? { href: page.url.next, label: label.next } : undefined;
const previous = page.url.prev ? { href: page.url.prev, label: label.previous } : undefined;
const pagination = { anchor, next, previous };

---

<Feed title={title} posts={page.data} pagination={pagination}>
  <Summary slot="feed-summary" />
</Feed>
```

Together with the `posts`, the `pageSize` is passed to Astro's [pagination](https://docs.astro.build/en/core-concepts/routing/#pagination) inside [`getStaticPaths()`](https://docs.astro.build/en/reference/api-reference/#getstaticpaths) which helps drive the rendering of all the pages necessary to cover all the `posts` in the collection. The `blog` _content_ is passed as the feed summary to `feed.astro` and the remaining pagination-relateds setting are passed as a single `pagination` prop.

The `pagination` prop is consumed by the `src/components/pagination.astro` component:

```Astro
---
// file: src/components/pagination.astro
import type { PaginationArgs } from '../types';

interface Props {
  args: PaginationArgs;
}

const {
  args: { anchor, next, previous },
} = Astro.props;

const nextHref = next ? (anchor ? next.href + anchor : next.href) : undefined;
const previousHref = previous ?(anchor ? previous.href + anchor : previous.href) : undefined;

---

{
  (nextHref || previousHref) && (
    <footer class="c-pagination">
      <div class="c-pagination__wrapper">
        <nav class="c-pagination__inner" aria-label="Pagination links">
          {previousHref && (
            <a href={previousHref} class="c-pagination__previous">
              <span>{previous?.label ?? 'Previous'}</span>
            </a>
          )}
          {nextHref && (
            <a href={nextHref} class="c-pagination__next">
              <span>{next?.label ?? 'Next'}</span>
            </a>
          )}
        </nav>
      </div>
    </footer>
  )
}
```

It simply renders the navigation links from one feed page to the next (or previous).

## Tag feeds

The single entry 'tag' collection holds the `title` for all the tag pages.

```markdown
---
# file: src/content/tag/index.md
title: Tag Archive
---
```

The tags and related posts are harvested from the posts:

```TypeScript
// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';

// …

// --- tags derived from 'posts' collection
export interface TagPosts {
  tag: string;
  posts: Post[];
}

function collectTagPosts(tagged: Map<string, TagPosts>, post: Post) {
  for (const tag of post.data.tags) {
    const slug = slugify(tag);
    const tagPosts = tagged.get(slug);

    if (tagPosts) {
      tagPosts.posts.push(post);
      continue;
    }

    tagged.set(slug, {
      tag,
      posts: [post],
    });
  }

  return tagged;
}

function toTagsStaticPaths(entries: CollectionEntry<'posts'>[]) {
  const tagged = entries.reduce(collectTagPosts, new Map<string, TagPosts>());
  const staticPaths: { params: { tag: string }; props: TagPosts }[] = [];

  for (const [slug, props] of tagged) {
    staticPaths.push({
      params: {
        tag: slug,
      },
      props,
    });
  }

  return staticPaths;
}

// …
```

… which drives the the rendering of the tag archive pages:

```Astro
---
// file: src/pages/tag/[tag].astro
import {
  fromPosts,
  fromTag,
  toTagsStaticPaths,
  type TagPosts
} from '../../lib/collections';
import Feed from '../../layouts/feed.astro';

interface Props extends TagPosts {}

export const getStaticPaths = async () =>
  toTagsStaticPaths(await fromPosts());

const { data: { title } } = await fromTag();
const { tag, posts } = Astro.props;
---

<Feed title={title} tag={tag} posts={posts} />
```

… which will be directly referenced by the blog post pages.

---

[Next](file:///home/wheatley/sbox/astro/astro-scratch/README.md#lesson-12-blog-post-view-directory-data-and-filters)
