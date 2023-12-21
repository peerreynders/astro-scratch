# Lesson 10: Home page complete and recap

## Complete home page

The `src/layouts/home.astro` page's full content is:

```markdown
---
# file: src/content/home/index.md
title: Issue 33
metaDesc: >
  A made up agency site that you build if you take 
  Learn Eleventy From Scratch, by Piccalilli
intro:
  eyebrow: Digital Marketing is our
  main: Bread & Butter
  summary: >
    Let us help you create the perfect campaign with our multi-faceted
    team of talented creatives.
  button:
    text: See our work
    url: /work
  image:
    src: ../../assets/bg/toast.jpg
    alt: Buttered toasted white bread
primaryCta:
  title: This is an agency that doesn’t actually exist
  summary: >
    This is the project site you build when you take the “Learn 
    Eleventy From Scratch” course so it is all made up as a pretend
    context. You will learn a lot about Eleventy by building this site
    though. Take the course today!
  button:
    text: Buy a copy
    url: https://learneleventyfromscratch.com
featuredWork:
  title: Selected work
  summary: >
    Some stuff that should give you an idea of 
    what we're all about.
studioFeed:
  title: From inside the studio
---
```

… which is rendered with:

```Astro
---
// file: src/layouts/home.astro
import { Image } from 'astro:assets';
import Base from './base.astro';
import Cta from '../components/cta.astro';
import FeaturedWork from '../components/featured-work.astro';
import StudioFeed from '../components/studio-feed.astro';
import { fromHome } from '../lib/collections';

import '../styles/home.scss';

const {
  data: {
    title,
    metaTitle,
    metaDesc,
    intro,
    primaryCta,
    featuredWork,
    studioFeed,
    summary,
    socialImage,
  }
} = await fromHome();

---
<Base {title} {metaTitle} {metaDesc} {summary} {socialImage}>
  <div class="u-wrapper">
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
        <Image
          class="c-intro__image"
          src={intro.image.src}
          alt={intro.image.alt}
        />
      </div>
    </article>
  </div>
  <Cta cta={primaryCta} />
  <FeaturedWork {featuredWork} />
  <StudioFeed {studioFeed} />
  <Cta />
</Base>
```

Note that this already uses the Astro [`Image`](https://docs.astro.build/en/guides/images/#image--astroassets) component (the [image service](https://docs.astro.build/en/reference/image-service-reference/#what-is-an-image-service) isn't set up until lesson 21).

---

[Next](file:///home/wheatley/sbox/astro/astro-scratch/README.md#lesson-11-blog-feeds-tags-and-pagination)
