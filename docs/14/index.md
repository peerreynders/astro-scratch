# Lesson 14: Adding our about page

## Add about page layout

The `src/layouts/about.astro` layout component retrieves the `title` from the [`frontmatter`](https://docs.astro.build/en/guides/markdown-content/#frontmatter-layout) provided through the [`Astro.props`](https://docs.astro.build/en/reference/api-reference/#astroprops) and passes the content on to the `src/components/page-header.astro` component through its [`<slot />`](https://docs.astro.build/en/core-concepts/astro-components/#slots).

```Astro
---
// file: src/layouts/about.astro
import Base from './base.astro';
import PageHeader from '../components/page-header.astro';
import PeoplePanel from '../components/people-panel.astro';
import Cta from '../components/cta.astro';
import { fromPeople } from '../lib/collections';

import '../styles/about.scss';

interface Props {
  frontmatter: {
    title: string;
  };
}

const {
  frontmatter: { title },
} = Astro.props;

const people = await fromPeople();
---

<Base title={title}>
  <article>
    <PageHeader title={title}>
      <slot />
    </PageHeader>
    <PeoplePanel title={'Meet the team'} {people} />
  </article>
  <Cta />
</Base>
```

This is followed by the `src/components/people-panel.astro` component and the page ends with the default `src/components/cta.astro` component.

## Create a people partial

The `src/components/people.astro` component shows a list of individual's [images](https://docs.astro.build/en/reference/api-reference/#image-) captioned with their name and title.

```Astro
---
// file: src/components/people.astro
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
  people: CollectionEntry<'people'>[];
}

const { people } = Astro.props;
---
{
  people.length > 0 && (
    <div class="c-people">
      <ol>
        {people.map(({ data: { title, name, image } }) => (
          <li>
            <figure class="c-person">
              <Image
                class="c-person__image"
                src={image.src}
                alt={'Image of ' + name}
                draggable="false"
              />
              <figcaption class="c-person__details">
                <span class="c-person__name">{name}</span>
                <span>{title}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

`src/components/people-panel.astro` is a conditional wrapper for the `src/components/people.astro` component.

```Astro
---
// file: src/components/people-panel.astro
import type { CollectionEntry } from 'astro:content';
import People from '../components/people.astro';

interface Props {
  title: string;
  people: CollectionEntry<'people'>[];
};

const { people, title } = Astro.props;
---

{people.length > 0 && (
  <article class="c-people-panel">
    <div class="c-people-panel__wrapper u-flow">
      {/* prettier-ignore */}
      <h2>{title}</h2>
      <People people={people} />
    </div>
  </article>
)}
```

## Create a people collection

The `people` collection is stored under `src/content/people`:

```markdown
---
# file: src/content/people/1.md
name: 'Isabella Santos Melo'
title: 'Creative director'
key: 1
image:
  src: ../../assets/people/1.jpg
---
```

… and the structure of it's entries is described by `peopleSchema` in `src/schemas.ts`:

```TypeSript
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

// …
```

`fromPeople()` provides the typed `people` collection:

```
// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './shame';

// …

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

// …
```

[`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator) is used for language sensitive comparison.

## Add an about page

Finally the `src/pages/about-us.md` route provides the content (and configuration) to be rendered:

```markdown
---
# file: src/pages/about-us.md
title: About Issue 33
layout: ../layouts/about.astro
---

Wanna see our foosball table? Nah, only kidding. We’re a made-up
agency that are being used as the context for the Piccalilli course,
[Learn Eleventy From Scratch](https://learneleventyfromscratch.com).
```

---

[Next](../../README.md#lesson-15-adding-our-work-landing-page)
