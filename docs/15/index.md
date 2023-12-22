# Lesson 15: Adding our work landing page

## Add a work landing layout

The `src/layouts/work-landing.astro` layout component retrieves the `title` from the [`frontmatter`](https://docs.astro.build/en/guides/markdown-content/#frontmatter-layout) provided through the [`Astro.props`](https://docs.astro.build/en/reference/api-reference/#astroprops) and passes the content on to the `src/components/page-header.astro` component through its [`<slot />`](https://docs.astro.build/en/core-concepts/astro-components/#slots).

```Astro
---
// file: src/layouts/work-landing.astro
import { Image } from 'astro:assets';
import Base from './base.astro';
import PageHeader from '../components/page-header.astro';
import Cta from '../components/cta.astro';
import { fromWork } from '../lib/collections';
import { hrefFromWorkSlug } from '../route-path';

import '../styles/work-landing.scss';

interface Props {
  frontmatter: {
    title: string;
  };
}

const {
  frontmatter: { title },
} = Astro.props;

const entries = await fromWork();
---

<Base title={title}>
  <article>
    <PageHeader title={title}>
      <slot />
    </PageHeader>
  </article>
  <div class="c-work-list">
    <div class="c-work-list__wrapper">
      <article class="c-gallery u-flow">
        {
          entries.map(({ slug, data: { hero, title, summary } }) => (
            <figure class="c-gallery__item u-flow">
              <div class="c-gallery__media">
                <Image
                  class="u-radius"
                  src={hero.src}
                  alt={hero.alt}
                />
              </div>
              <figcaption class="c-gallery__content u-flow">
                <h2 class="c-gallery__heading">{title}</h2>
                <p class="c-gallery__summary">
                  {summary}
                </p>
                <a href={hrefFromWorkSlug(slug)} class="c-button">
                  See this work
                </a>
              </figcaption>
            </figure>
          ))
        }
      </article>
    </div>
  </div>
  <Cta />
</Base>
```

The [`CollectionEntry<'work'>`](https://docs.astro.build/en/reference/api-reference/#collection-entry-type) `entries` returned by `fromWork()` drives the rendering of the work list: a gallery of images captioned with summaries representing the work.

```TypeScript
// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './shame';

// …

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

// …
```

Ultimately the `src/work/index.md` route (supplying the title and content for the page header) is responsible for rendering `src/layouts/work-landing.astro`:

```markdown
---
# file: src/pages/work/index.md
title: Our finest work
layout: ../../layouts/work-landing.astro
---

Some of our finest work from websites right through to printed
branding that shows our range and diversity of talent in the agency.
```

---

[Next](../../README.md#lesson-16-creating-a-work-item-page)
