# Lesson 16: Creating a work item page

## Adding our template

The data driving the `src/layouts/work-item.astro` layout is aggregated in the `args` prop:

```Astro
---
// file: src/layouts/work-item.astro
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import Base from './base.astro';
import PeoplePanel from '../components/people-panel.astro';
import Cta from '../components/cta.astro';

import '../styles/work-item.scss';

interface Props {
  args: {
    title: string;
    summary: string;
    hero: {
      src: ImageMetadata;
      alt: string;
    };
    keyFacts: {
      primary: string;
      secondary: string;
    }[];
    gallery: {
      title: string;
      summary: string;
      image: {
        src: ImageMetadata;
        alt: string;
      };
    }[];
    people: CollectionEntry<'people'>[];
  };
}

const {
  args: { title, summary, hero, keyFacts, gallery, people },
} = Astro.props;
---
<Base title={title}>
  <section>
    <header class="c-hero">
      <div class="c-hero__inner">
        <div class="c-hero__content u-flow">
          <!-- prettier-ignore -->
          <h1>{title}</h1>
          <p>{summary}</p>
        </div>
      </div>
        <Image
          class="c-hero__image"
          src={hero.src}
          alt={hero.alt}
        />
    </header>
    <article class="c-facts-panel">
      <div class="c-facts-panel__wrapper u-flow">
        <h2>Key facts</h2>
        <div>
          <ol class="c-facts-panel__list">
            {
              keyFacts.map((entry) => (
                <li class="c-facts-panel__item u-flow">
                  <span class="c-facts-panel__value">
                    {entry.primary}
                  </span>
                  <span class="c-facts-panel__fact">{entry.secondary}</span>
                </li>
              ))
            }
          </ol>
        </div>
      </div>
    </article>
    <div class="u-wrapper">
      <article class="c-gallery u-flow">
        {
          gallery.map((entry) => (
            <figure class="c-gallery__item u-flow">
              <div class="c-gallery__media">
                <Image
                  class="u-radius"
                  src={entry.image.src}
                  alt={entry.image.alt}
                  aria-hidden="true"
                />
              </div>
              <figcaption class="c-gallery__content u-flow">
                <h2 class="c-gallery__heading">
                  {entry.title}
                </h2>
                <p class="c-gallery__summary">
                  {entry.summary}
                </p>
              </figcaption>
            </figure>
          ))
        }
      </article>
    </div>
    <PeoplePanel title={'Meet the team behind this project'} {people} />
  </section>
  <Cta />
</Base>
```

- `title`: identifying the work as a whole
- `summary`: concise description of this particular project
- `hero`: one image ideally capturing the character of the project
- `keyFacts`: a list of value (`primary`), description (`secondary`) pairs that outline the positive impact the project had for the client
- `gallery`: a list of `title`, `summary`, `image` triplets where each item helps to flesh out the nature of the project in more detail
- `people`: a list of people representing the project team (ultimately handled by `src/components/people-panel.astro`).

The `title`, `summary`, `hero` are expressed in the `c-hero` [`<header>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header). The `keyFacts` furnish the list in the `c-facts-panel` [`<article>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article). `gallery` populates the `c-gallery` [`<article>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article).

## Adding related content

Inspecting the work schema:

```TypeScript
// file: src/schemas.ts
import { z } from 'astro/zod';
import type { SchemaContext } from 'astro:content';

// …

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

// …
```

… it should be noted that the team is only identified as an array of `string`s where each string matches the `key` of one of:

```TypeScript
// …

// --- people

const peopleSchema = ({ image }: SchemaContext) =>
  z.object({
    name: z.string(),
    title: z.string(),
    key: z.number().int().positive().safe(),
    image: imageSchema(image),
  });

const people = { schema: peopleSchema };

// …
```

… where `key` is equivalent to [`CollectionEntry<'people'>.slug`](https://docs.astro.build/en/reference/api-reference/#slug).

The array of `CollectionEntry<'people'>` that comprise the project team is assembled with:

```TypeScript
  people: keepSlugEntries(await fromPeople(), entry.data.team)
```

… where `keepSlugEntries()` is:

```TypeScript
// …

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

// …
```

## Assigning our layout to our work items

The `src/pages/work/[...slug].astro` route is responsible for rendering the work item pages:

```Astro
---
// file: src/pages/work/[...slug].astro
import type { CollectionEntry } from 'astro:content';
import {
  fromPeople,
  fromWorkToStaticPaths,
  keepSlugEntries,
} from '../../lib/collections';
import WorkItem from '../../layouts/work-item.astro';

export const getStaticPaths = fromWorkToStaticPaths;

interface Props {
  entry: CollectionEntry<'work'>;
}

const { entry } = Astro.props;

const workArgs = {
  title: entry.data.title,
  summary: entry.data.summary,
  hero: entry.data.hero,
  keyFacts: entry.data.keyFacts,
  gallery: entry.data.gallery,
  people: keepSlugEntries(await fromPeople(), entry.data.team),
};
---

<WorkItem args={workArgs} />
```

`fromWorkStaticPaths` provides the necessary [`getStaticPaths()`](https://docs.astro.build/en/reference/api-reference/#getstaticpaths) function based on the `work` collection.

```TypesScript
// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';

// …

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

// …

```

Then given the specific `CollectionEntry<'work'>` entry for one work item page the route assembles the `args` prop necessary for the `src/layouts/work-item.astro` layout component.

---

[Next](../../README.md#lesson-17-meta-info-rss-feeds-and-module-recap)
