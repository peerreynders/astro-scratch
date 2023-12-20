# Lesson 8: Creating our first collection

## Creating our first collection

We need the following collections:

- `cta`: Default `src/components/cta.astro` content (single entry only; lesson 7)
- `home`: Content for `src/layouts/home.astro` content (single entry only; lesson 7)
- `people`: Team member information for site content (lesson 14 & 16)
- `posts`: Blog posts content (lesson 11)
- `studio`: Content for the (yet to be implemented) `src/components/studio-feed.astro` component (lesson 9)
- `tag`: Title for `src/pages/tag/[tag].astro` (single entry; used in lesson 11)
- `work`: Project information for site content (lesson 15 & 16)

[`src/content/config.ts`](https://docs.astro.build/en/guides/content-collections/#defining-collections) defines these collections:

```TypeScript
// file: src/content/config.ts
// Use `npx astro sync` to generate the `astro:content` module
//
import { defineCollection } from 'astro:content';
import { cta, home, people, posts, studio, tag, work } from '../schemas';

export const collections = {
  cta: defineCollection(cta),
  home: defineCollection(home),
  people: defineCollection(people),
  posts: defineCollection(posts),
  studio: defineCollection(studio),
  tag: defineCollection(tag),
  work: defineCollection(work),
};
```

Collections are defined via [schemas](https://docs.astro.build/en/guides/content-collections/#defining-a-collection-schema) using [Zod](https://docs.astro.build/en/guides/content-collections/#defining-datatypes-with-zod) ([primitives](https://zod.dev/?id=primitives)):

```TypeScript
// file: src/schemas.ts
import { z } from 'astro/zod';
import type { SchemaContext } from 'astro:content';

const imageSchema = (image: SchemaContext['image']) =>
  z.object({
    src: image(),
    alt: z.string().default(''),
  });

// --- people

const peopleSchema = ({ image }: SchemaContext) =>
  z.object({
    name: z.string(),
    title: z.string(),
    key: z.number().int().positive().safe(),
    image: imageSchema(image),
  });

const people = { schema: peopleSchema };

// --- posts

const toDate = (value: string) => new Date(value);

const postsSchema = z.object({
  title: z.string(),
  date: z.string().transform(toDate),
  tags: z.array(z.string()),
});

const posts = { schema: postsSchema };

// --- work

const workSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    summary: z.string(),
    displayOrder: z.number().int().positive().safe(),
    featured: z.boolean(),
    hero: imageSchema(image),
    keyFacts: z.array(
      z.object({
        primary: z.string(),
        secondary: z.string(),
      })
    ),
    gallery: z.array(
      z.object({
        title: z.string(),
        summary: z.string(),
        image: imageSchema(image),
      })
    ),
    team: z.array(z.coerce.string()),
  });

const work = { schema: workSchema };

// --- blog

const blogSchema = z.object({
  title: z.string(),
  anchor: z.string(),
  pageSize: z.number().gt(0),
  label: z.object({
    previous: z.string(),
    next: z.string(),
  }),
});

const blog = { schema: blogSchema };

// --- cta

const buttonSchema = z.object({
  text: z.string(),
  url: z.string(),
});

const ctaSchema = z.object({
  title: z.string(),
  summary: z.string(),
  button: buttonSchema,
});

const cta = { schema: ctaSchema };

// --- home

const homeSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDesc: z.string().optional(),
    intro: z.object({
      eyebrow: z.string(),
      main: z.string(),
      summary: z.string(),
      button: buttonSchema,
      image: imageSchema(image),
    }),
    primaryCta: ctaSchema,
    featuredWork: z.object({
      title: z.string(),
      summary: z.string(),
    }),
    studioFeed: z.object({
      title: z.string(),
    }),
    summary: z.string().optional(),
    socialImage: z.string().optional(),
  });

const home = { schema: homeSchema };

// --- studio

const imagePropsSchema = z.object({
  width: z.number().optional(),
  quality: z.number().optional(),
});

const sizeUnion = z.union([
  z.literal('large'),
  z.literal('medium'),
  z.literal('small'),
]);

const studioSchema = ({ image }: SchemaContext) =>
  z.object({
    src: image(),
    alt: z.string().default(''),
    credit: z.string().optional(),
    variants: z.record(sizeUnion, imagePropsSchema).optional(),
  });

const studio = { schema: studioSchema };

// --- tag

const tag = {
  schema: z.object({
    title: z.string(),
  }),
};

export { blog, cta, home, people, posts, studio, tag, work };
```

Note how [`SchemaContext`](https://docs.astro.build/en/reference/api-reference/#schemacontext) is used to merge local images with a collection; the implication being that the source field contains the image URL, e.g.:

```yaml
---
# file: src/content/studio/01.md
src: ../../assets/studio/notepad.jpg
alt: A notepad, mechanical pencil, phone and plant on very brightly lit desk
credit: https://unsplash.com/photos/bU6JyhSI6zo
variants:
  large:
    width: 1700
    quality: 60
  medium:
    width: 890
    quality: 60
  small:
    width: 600
    quality: 60
---
```

Finally there is a number of collection specific helper methods:

```TypeScript
// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './shame';

// --- 'work' collection
type Featured = {
  data: {
    featured: boolean;
  };
};

const isFeatured = <E extends Featured>(entry: E) => entry.data.featured;

type WithOrder = {
  data: {
    displayOrder: number;
  };
};

const byOrderAsc = <E extends WithOrder>(a: E, b: E) =>
  a.data.displayOrder - b.data.displayOrder;

async function fromWork() {
  const entries = await getCollection('work');
  // Note: sort is destructive so `slice()` first
  return entries.slice().sort(byOrderAsc);
}

async function fromFeaturedWork() {
  const workEntries = await getCollection('work', isFeatured);
  return workEntries.slice().sort(byOrderAsc);
}

export type Work = CollectionEntry<'work'>;

const workToStaticPathsItem = (entry: Work) => ({
  params: {
    slug: entry.slug,
  },
  props: {
    entry,
  },
});

const fromWorkToStaticPaths = async () =>
  (await fromWork()).map(workToStaticPathsItem);

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

// --- 'people' collection
type WithSlug = {
  slug: string;
};

const collator = new Intl.Collator();

const bySlugAsc = <E extends WithSlug>(
  { slug: aSlug }: E,
  { slug: bSlug }: E
) => collator.compare(aSlug, bSlug);

async function fromPeople() {
  const entries = await getCollection('people');
  // Note: sort is destructive so `slice()` first
  return entries.slice().sort(bySlugAsc);
}

const keepSlugEntries = <E extends WithSlug>(
  collection: E[],
  slugs: string[]
) => collection.filter((entry) => slugs.includes(entry.slug));

// --- 'studio' collection
const fromStudio = (): Promise<CollectionEntry<'studio'>[]> =>
  getCollection('studio');

type FeedEntry = {
  src: ImageMetadata;
  alt: string;
  width: number | undefined;
  quality: number | undefined;
  slug: string;
};

const toStudioFeed = (entries: CollectionEntry<'studio'>[]) =>
  entries
    .reduce<FeedEntry[]>((selected, entry) => {
      const { variants } = entry.data;
      if (variants && variants.medium) {
        const { width, quality } = variants.medium;
        selected.push({
          src: entry.data.src,
          alt: entry.data.alt,
          width,
          quality,
          slug: entry.slug,
        });
      }
      return selected;
    }, [])
    .sort(bySlugAsc);

// --- single entry collections: 'blog', 'cta', 'home', 'tag'
function singleEntry<C extends 'blog' | 'cta' | 'home' | 'tag'>(
  collection: C
): () => Promise<CollectionEntry<C>> {
  return async () => {
    const entries = await getCollection(collection);
    const entry = entries.length > 0 ? entries[0] : undefined;
    if (!entry) throw new Error(`Missing "${collection}" content`);

    return entry;
  };
}

const fromBlog = singleEntry('blog');

const fromCta = singleEntry('cta');
export type CtaData = CollectionEntry<'cta'>['data'];

const fromHome = singleEntry('home');

const fromTag = singleEntry('tag');

export {
  fromBlog,
  fromCta,
  fromFeaturedWork,
  fromHome,
  fromPeople,
  fromPosts,
  fromPostsRecommend,
  fromStudio,
  fromTag,
  fromWork,
  fromWorkToStaticPaths,
  keepSlugEntries,
  toPostsStaticPaths,
  toStudioFeed,
  toTagsStaticPaths,
};
```

Both [`CollectionEntry<TCollectionName>`](https://docs.astro.build/en/reference/api-reference/#collection-entry-type) and [`getCollection()](https://docs.astro.build/en/reference/api-reference/#getcollection) are heavily leveraged.

## Rendering our featured work partial

`fromFeaturedWork()` specifically is used in the `src/components/featured-work.astro` component:

```Astro
---
// file: src/components/featured-work.astro
import { Image } from 'astro:assets';
import { fromFeaturedWork } from '../lib/collections';

interface Props {
  featuredWork: {
    title: string;
    summary: string;
  }
}

const { featuredWork } = Astro.props;
const collection = await fromFeaturedWork();
---

<article class="c-featured-work">
  <div class="c-featured-work__wrapper u-flow">
    <div class="c-featured-work__inner u-flow">
      <div class="c-featured-work__intro u-flow">
        <!-- prettier-ignore -->
        <h2 class="c-featured-work__title">{featuredWork.title}</h2>
        <p class="c-featured-work__summary">
          {featuredWork.summary}
        </p>
      </div>
      {
        collection.map(({ slug, data: { title, hero } }) => (
          <a
            href={`/work/${slug}`}
            aria-label={`See ${title}`}
            class="c-featured-work__item"
          >
            <Image
              src={hero.src}
              alt={hero.alt}
            />
          </a>
        ))
      }
    </div>
    <div class="c-featured-work__action">
      <a href="/work" class="c-button">See more work</a>
    </div>
  </div>
</article>
```

… which itself is used in the `src/layouts/home.astro` layout:

```Astro
// file: src/layouts/home.astro
import Base from './base.astro';
import Cta from '../components/cta.astro';
import FeaturedWork from '../components/featured-work.astro';
import { fromHome } from '../lib/collections';

const {
  data: {
    title,
    intro,
    primaryCta,
    featuredWork,
  }
} = await fromHome();
---

<Base title={title}>
  <article class="c-intro">
    <div class="c-intro__header">
      <h1 class="c-intro__heading">
        {intro.eyebrow}
        <em>{intro.main}</em>
      </h1>
    </div>
    <div class="c-intro__content u-flow">
      <p class="c-intro__summary">{intro.summary}</p>
      <a href={intro.button.url} class="c-button">{intro.button.text}</a>
    </div>
    <div class="c-intro__media">
      <img class="c-intro__image" src={intro.image} alt={intro.imageAlt} />
    </div>
  </article>
  <Cta cta={primaryCta} />
  <FeaturedWork {featuredWork} />
  <Cta />
</Base>
```

---

[Next](file:///home/wheatley/sbox/astro/astro-scratch/README.md#lesson-9-adding-remote-data)
