# Lesson 13: Recommended content

## Adding our helper

The `src/layouts/post.astro` layout component includes this line:

```TypeScript
const recommendPosts = await fromPostsRecommend([slug]);
```

The `slug` of the current post is passed to avoid it being part of the recommendations.

```TypeScript
// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';

// …

async function fromPostsRecommend(exclude: string[], limit = 3, random = true) {
  const posts = await getCollection('posts');

  const length = posts.length;
  const remain = length - exclude.length;
  const n = remain > limit ? limit : remain;

  const recommend: CollectionEntry<'posts'>[] = [];
  const excludeSlugs = new Set(exclude);

  const postIndex = random
    ? (_index: number) => Math.trunc(Math.random() * length)
    : (index: number) => index;

  // Ensure finite looping
  for (let i = 0; recommend.length < n && i < length; i += 1) {
    const post = posts[postIndex(i)];

    // Don't use post with excluded slug
    if (excludeSlugs.has(post.slug)) continue;

    recommend.push(post);
    excludeSlugs.add(post.slug);
  }

  return recommend;
}

// …
```

In the default configuration `fromPostsRecommend()` will return (a maximum of) three randomly selected post that are not excluded.

## Implementing our recommended content

Any selected `recommendPosts` are then passed to the `src/components/post-list.astro` component with a custom `headline`:

```Astro
{
  recommendPosts && recommendPosts.length > 0 && (
    <footer>
      <PostList headline={'More from the blog'} posts={recommendPosts} />
    </footer>
  )
}
```

---

[Next](../../README.md#lesson-14-adding-our-about-page)
