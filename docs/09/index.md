# Lesson 9: Adding remote data

Astro can [`fetch`](https://docs.astro.build/en/guides/data-fetching/) remote data during build time so

```TypeScript
const response = await fetch('https://11ty-from-scratch-content-feeds.piccalil.li/media.json');
const {items} = await response.json();
```

… will _just_ work. However Astro does not support automatic fetch caching like [`eleventy-fetch`](https://www.11ty.dev/docs/plugins/fetch/) does. It is Astro's philosophy that developer managed cache invalidation should happen by updating content under control of [content collections](https://docs.astro.build/en/reference/api-reference/#content-collections-astrocontent); i.e. prior to a build, run some process external to Astro to update the data under `src/content`.

Content collections [support](https://docs.astro.build/en/guides/content-collections/#what-are-content-collections) `.md`, `.mdx`, `.yaml` and `.json` content.

Because of this `media.json` morphed into the `studio` collection. The actual (full size) images are stored under `src/assets/studio` (managed by the [image service](https://docs.astro.build/en/reference/image-service-reference/#what-is-an-image-service) set up in lesson 21). But the supporting information is stored under `src/content/studio`:

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

Note how `variants` maps `large`, `medium` and `small` to [`width`](https://docs.astro.build/en/guides/images/#width-and-height-required-for-public-and-remote-images) and [`quality`](https://docs.astro.build/en/guides/images/#quality) properties used by the [Sharp image service](https://docs.astro.build/en/guides/images/#default-image-service).

## Rendering our new data

While `fromStudio()` supplies the support [data](https://docs.astro.build/en/reference/api-reference/#data), `toStudioFeed()` transforms those entries to the properties consumed by Astro's [`Image`](https://docs.astro.build/en/guides/images/#image--astroassets) component—assuming that the `medium` image variant is required. A suitably optimized image is generated during the build and the `<img>` element is supplied with the necessary attributes.

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

`src/components/studio-feed.astro` is used in the `src/layouts/home.astro` layout:

```Astro
// file: src/layouts/home.astro
import Base from './base.astro';
import Cta from '../components/cta.astro';
import FeaturedWork from '../components/featured-work.astro';
import StudioFeed from '../components/studio-feed.astro';
import { fromHome } from '../lib/collections';

const {
  data: {
    title,
    intro,
    primaryCta,
    featuredWork,
    studioFeed,
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
  <StudioFeed {studioFeed} />
  <Cta />
</Base>
```

---

[Next](../../README.md#lesson-10-home-page-complete-and-recap)
