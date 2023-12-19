# Lesson 30: Styling the work section

Background: [CSS Architecture](../css-architecture/index.md)

## Styling the work page

To Recap:

Within the work schema (defined in `src/schemas.ts`):

```TypeScript
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
```

… is the `gallery` array where each item has a `title`, `summary` and `image` (schema). This `gallery` **for **each** work item** is rendered by the `src/layouts/work-item.astro` layout component (as used in `src/pages/work/[...slug].md`):

```Astro
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
```

However the top level `title`, `summary` and `hero` of each work item are also aggregated to an "implicit gallery" _across **all** work items_ which is rendered by the `src/layouts/work-landing.astro` layout component (as used in `src/pages/work/index.md`):

```Astro
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
```

**Both** of these renderings are targeted by the `src/styles/component/_gallery.scss` CSS component:

```scss
// file: src/styles/component/_gallery.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-gallery {
  $gallery-item-space: s.from-size('700');

  --u-flow-space: #{s.from-size('800')};
  display: flex;
  flex-direction: column;

  &__media {
    @include u.frame;
    &::before {
      border-color: s.from-color('primary');
    }
    max-width: 40rem;
  }

  &__heading {
    font-size: s.from-size('700');
  }

  &__summary {
    --u-flow-space: #{s.from-size('300')};
    max-width: s.from-measure('short');
  }

  // Indents the even children along the inline-start to achieve a staggered
  // layout where space permits
  @include s.at-breakpoint('md') {
    &__heading {
      font-size: s.from-size('900');
    }

    &__item {
      &:nth-child(even) {
        margin-inline-start: auto;
      }
    }
  }

  // Flip each item to be a flex item to align caption and
  // image together
  @include s.at-breakpoint('lg') {
    &__item {
      display: flex;
      align-items: flex-end;

      // Flips the horizontal layout. Use this with care though,
      // because changing order of appearance can be problematic
      // for keyboard users
      &:nth-child(odd) {
        flex-direction: row-reverse;
      }

      // A specificity trump that makes sure that each item
      // has a neg start margin
      &:nth-child(odd),
      &:nth-child(even) {
        margin-inline-start: -$gallery-item-space;
      }

      > * {
        margin-inline-start: $gallery-item-space;
      }
    }
  }
}
```

This CSS component is used by the `work-landing.astro` and `work-item.astro` pages so it is included in their respective style sheets:

```scss
// file: src/styles/work-landing.scss
@use 'sass:meta';

@use 'setting' as s;

@include meta.load-css('component/work-list');
@include meta.load-css('component/gallery');

// utilities / overrides
@include meta.load-css('critical-epilog');
```

```scss
// file: src/styles/work-item.scss
@use 'sass:meta';

@use 'setting' as s;

@include meta.load-css('component/hero');
@include meta.load-css('component/facts-panel');
@include meta.load-css('component/gallery');
@include meta.load-css('component/people-panel');
@include meta.load-css('component/people');
@include meta.load-css('component/person');

// utilities / overrides
@include meta.load-css('critical-epilog');
```

The style sheets are associated with their respective layouts [with an import](https://docs.astro.build/en/guides/styling/#import-a-local-stylesheet):

```TypeScript
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

// …
```

```TypeScript
// file: src/layouts/work-item.astro
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import Base from './base.astro';
import PeoplePanel from '../components/people-panel.astro';
import Cta from '../components/cta.astro';

import '../styles/work-item.scss';

// …
```

## Styling work items

On the `src/layouts/work-item.astro` layout component the gallery is preceded by the _hero_ and _key facts_ sections. The _hero_ section renders as:

```Astro
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
```

Predictably the `src/styles/component/_hero.scss` targets this markup:

```scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-hero {
  position: relative;
  padding: 50vh 0 s.from-size('800') 0;

  &__inner {
    @include u.wrapper;

    position: relative;
    z-index: 1;
  }

  &__content {
    --u-flow-space: #{s.from-size('400')};
    @include u.dot-shadow;

    background-color: s.from-color('dark-dark');
    border-radius: s.$border-radius;
    color: s.from-color('light');
    display: inline-block;
    padding: s.from-size('500');

    & h1 {
      @include u.headline('quinary');
      // max-width: s.from-measure('compact');
    }

    & > p:last-child {
      max-width: s.from-measure('short');
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
  }
}
```

The _key facts_ section renders as:

```Astro
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
```

… and is targeted by `src/styles/component/_facts-panel.scss`:

```scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-facts-panel {
  color: s.from-color('light');
  background-color: s.from-color('primary-dark');
  @include u.page-panel;

  &__wrapper {
    & h2 {
      @include u.headline('secondary');
    }

    & > div:last-child {
      --u-flow-space: #{s.from-size('700')};
      font-family: s.from-font-family('sans');
      font-weight: s.from-font-weight('bold');
      line-height: s.from-line-height('flat');
    }
  }

  &__list {
    @include u.auto-grid($grid-gap: s.from-size('800') s.from-size('500'));
  }

  &__item {
    --u-flow-space: #{s.from-size('300')};

    & > * {
      display: block;
    }
  }

  &__value {
    color: s.from-color('secondary-light');
    font-size: s.from-size('700');

    @include s.at-breakpoint('md') {
      font-size: s.from-size('800');
    }
  }

  &__fact {
    font-size: s.from-size('600');

    @include s.at-breakpoint('lg') {
      font-size: s.from-size('700');
    }
  }
}
```

As indicated above both `c-hero` and `c-facts-panel` are included in the `work-item.astro` style sheet `src/styles/work-item.scss`.

---

[Next](../../README.md#lesson-31-wrapping-up)
