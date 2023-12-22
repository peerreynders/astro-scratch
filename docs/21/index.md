# Lesson 21: Setting up images

## Fundamentals

[Optimized image support](https://docs.astro.build/en/guides/images/) was introduced with [Astro 3.0](https://astro.build/blog/images/). This support extends to images stored somewhere under `src/` referenced within [`.astro`](https://docs.astro.build/en/guides/images/#images-in-astro-files), [`.md`](https://docs.astro.build/en/guides/images/#images-in-markdown-files), [`.mdx`](https://docs.astro.build/en/guides/images/#images-in-mdx-files), and `.mdoc` files. Content collections access image optimization via the passed [`image`](https://docs.astro.build/en/guides/images/#images-in-content-collections) helper.

If any `.astro` components need to import any optimized images _dynamically_ see the [_Dynamically import images_](https://docs.astro.build/en/recipes/dynamically-importing-images/) recipe. Images optimized by an external service can be handled by implementing an [`ExternalImageService`](https://docs.astro.build/en/reference/image-service-reference/#external-services).

Optimized image support is integrated through [`astro:assets`](https://docs.astro.build/en/guides/images/#image--astroassets) and [`sharpImageService `](https://docs.astro.build/en/guides/images/#remove-astrojsimage) (based on [sharp](https://sharp.pixelplumbing.com/)) is the default service.

In this case all images are stored under `src/assets/`:

```
src/assets
├── bg
│   └── toast.jpg
├── meta
│   └── social-share.png
├── people
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── 3.jpg
│   ├── 4.jpg
│   ├── 5.jpg
│   └── 6.jpg
├── studio
│   ├── notepad.jpg
│   ├── screens.jpg
│   ├── sketching.jpg
│   ├── smiling.jpg
│   ├── studio.jpg
│   └── table-tennis.jpg
└── work
    ├── behind-the-scenes-gallery-1.jpg
    ├── behind-the-scenes-gallery-2.jpg
    ├── behind-the-scenes-gallery-3.jpg
    ├── behind-the-scenes-hero.jpg
    ├── breakfast-club-gallery-1.jpg
    ├── breakfast-club-gallery-2.jpg
    ├── breakfast-club-gallery-3.jpg
    ├── breakfast-club-hero.jpg
    ├── brunch-and-brew-gallery-1.jpg
    ├── brunch-and-brew-gallery-2.jpg
    ├── brunch-and-brew-gallery-3.jpg
    ├── brunch-and-brew-gallery-4.jpg
    ├── brunch-and-brew-hero.jpg
    ├── outgoings-gallery-1.jpg
    ├── outgoings-gallery-2.jpg
    ├── outgoings-gallery-3.jpg
    ├── outgoings-hero.jpg
    ├── travel-today-gallery-1.jpg
    ├── travel-today-gallery-2.jpg
    └── travel-today-hero.jpg
```

## Case: Work item layout

The content for the _outgoings_ work item contains image information under _gallery_ and _hero_:

```markdown
---
# file: src/content/work/outgoings.md
title: Outgoings iOS App
summary: >
  A native iOS app to help people to keep a track of their finances by 
  providing easy-to use tracking and organising capabilities.
displayOrder: 1
featured: true
hero:
  src: ../../assets/work/outgoings-hero.jpg
  alt: Screens from the app, composed together as a group.
keyFacts:
  - primary: '50%'
    secondary: Increase in engagement
  - primary: '10%'
    secondary: Increase in sales
  - primary: '£1,000,000'
    secondary: In extra revenue
  - primary: '750 hours'
    secondary: In saved productivity
  - primary: '4'
    secondary: International awards
  - primary: '£28,000'
    secondary: Saved in digital advertising
gallery:
  - title: Multi-account support
    summary: >
      We wanted the app to be as useful as possible, so
      multi-account support was a natural choice.
    image:
      src: ../../assets/work/outgoings-gallery-1.jpg
  - title: Concise summaries
    summary: The numbers speak volumes, so we give them center stage.
    image:
      src: ../../assets/work/outgoings-gallery-2.jpg
  - title: Crystal clear information for users
    summary: >
      No distractions, no anti-patterns, just clear,
      user-friendly information
    image:
      src: ../../assets/work/outgoings-gallery-3.jpg
team: [1, 4, 6]
---
```

The `workSchema` passes the [`image`](https://docs.astro.build/en/guides/images/#images-in-content-collections) helper from [`SchemaContext`](https://docs.astro.build/en/reference/api-reference/#schemacontext) to `imageSchema`:

```TypeScript
// file: src/schemas.ts
import { z } from 'astro/zod';
import type { SchemaContext } from 'astro:content';

const imageSchema = (image: SchemaContext['image']) =>
  z.object({
    src: image(),
    alt: z.string().default(''),
  });

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

The `image` helper returns an object holding the image's meta data like: `src`, `width`, `height`, and `format` which satisfies the `ImageMetaData` interface intended for the [`<Image />`](https://docs.astro.build/en/reference/api-reference/#image-) component's `src` property. So all that's left is to bind the `<Image />` `src` property to the result from the `image` helper; e.g. `src/layouts/work-item.astro`:

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

Both `args.hero.src` and `args.gallery[i].image.src` are of type `ImageMetaData`. In the case of the `hero` image:

```Astro
<Image
  class="c-hero__image"
  src={hero.src}
  alt={hero.alt}
/>
```

… and in the case of the `gallery`:

```Astro
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
```

## Case: Studio feed component

The images stored under `src/assets/studio` are larger and of higher quality than necessary for publishing. The data for an entry in the `studio` collection looks like:

```markdown
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

i.e. it supplies a number of suggested width and quality settings (the image service will maintain the intrinsic aspect ratio). The `studio` schema is defined as:

```TypeScript
// file: src/schemas.ts
import { z } from 'astro/zod';
import type { SchemaContext } from 'astro:content';

// …

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

// …
```

Meanwhile in `src/lib/collections.ts` there is a helper function `toStudioFeed()` for composition with `fromStudio()` to yield `FeedEntry` values populated with meta data for `medium` variant of the `studio` images.

```TypeScript
// file: src/lib/collections.ts
import { getCollection, type CollectionEntry } from 'astro:content';

// …

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

// …
```

The `src/components/studio-feed.astro` component composes the `fromStudio()` and `toStudioFeed()` functions to drive the rendering of the list items for the `c-studio-feed__list`:

```Astro
---
// file: src/components/studio-feed.astro
import { Image } from 'astro:assets';
import { fromStudio, toStudioFeed } from '../lib/collections';

const { studioFeed } = Astro.props;
const feed = toStudioFeed(await fromStudio());
---
{
  feed.length && (
    <article class="c-studio-feed">
      <div class="c-studio-feed__wrapper u-flow">
        {/* prettier-ignore */}
        <h2 class="c-studio-feed__title">{studioFeed.title}</h2>
        <p class="u-visually-hidden" id="studio-feed-desc">
          A collection of images from around our studio and the people who work
          here.
        </p>
        <div>
          <ul class="c-studio-feed__list">
            {feed.map(({ src, alt, width, quality }) => (
              <li>
                <Image
                  {src}
                  {alt}
                  {width}
                  {quality}
                  draggable="false"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
```

… in particular:

```TypeScript
const feed = toStudioFeed(await fromStudio());
```

Note how in addition to the [`src`](https://docs.astro.build/en/guides/images/#src-required) `ImageMetaData` both [`width`](https://docs.astro.build/en/guides/images/#width-and-height-required-for-public-and-remote-images) and [`quality`](https://docs.astro.build/en/guides/images/#quality) are bound to `<Image />` to specify the optimization for the image.

```Astro
{feed.map(({ src, alt, width, quality }) => (
  <li>
    <Image
      {src}
      {alt}
      {width}
      {quality}
      draggable="false"
    />
  </li>
))}
```

**_See also_**: [Lesson 31: Adding a social image and favicon](../31/index.md#adding-a-social-image-and-favicon)

---

[Next](../../README.md#lesson-22-global-css-and-design-tokens)
