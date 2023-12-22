# Lesson 7: Data basics

## Wiring up our navigation

As seen in the previous lesson the navigations are simply captured as part of the `src/components/site-head.astro` component an array of route segment/name entries:

```TypeScript
const navigations = [
  ['/', 'Home'],
  ['/about-us', 'About'],
  ['/work', 'Work'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];
```

In Astro [JSON can be imported](https://docs.astro.build/en/guides/imports/#json) directly into Astro components (likely due to [Vite](https://vitejs.dev/guide/features#json)) but there seems to be little reason to do this for the top level navigations. The navigations are rendered by the following template fragment:

```
<nav class="c-nav" aria-label="Primary">
   <ul class="c-nav__list">
     {
       navigations.map(([pathname, name]) => (
         <li>
           <a
             href={pathname}
             {...activeProps(pathname, Astro.url.pathname)}
           >
             {name}
           </a>
         </li>
       ))
     }
   </ul>
</nav>
```

## Cascading data

To take advantage of type checking _most data_ is moved under Astro's [content collections](https://docs.astro.build/en/guides/content-collections/)—this includes the content for the `src/component/cta.astro` component

```yaml
---
# file: src/content/cta/index.md
title: Get in touch if we seem like a good fit
summary: >
  Vestibulum id ligula porta felis euismod semper. Praesent
  commodo cursus magna, vel scelerisque nisl consectetur et. Cras
  justo odio, dapibus ac facilisis in, egestas eget quam. Donec 
  ullamcorper nulla non metus auctor fringilla.
button:
  text: Start a new project
  url: /contact
---
```

… which is consumed by the cta component:

```Astro
---
// file: src/components/cta.astro
import { fromCta, type CtaData } from '../lib/collections';

interface Props {
  cta?: CtaData;
}

const { cta: ctaData } = Astro.props;
const cta = ctaData ? ctaData : (await fromCta()).data;
---

{
  cta && (
    <article class="c-cta">
      <div class="c-cta__outer">
        <div class="c-cta__inner u-flow">
          {/* prettier-ignore */}
          <h2 class="c-cta__heading">{cta.title}</h2>
          <p class="c-cta__summary">{cta.summary}</p>
          <div class="c-cta__action">
            <a class="c-button c-button--ghost" href={cta.button.url}>
              {cta.button.text}
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
```

The plumbing to make this work is the topic of the next lesson. Here the approach is largely:

- Content for standalone pages just goes directly as markdown somewhere in the `/pages/` tree.
- Repeating content like blog posts go into the a content collection under `/content/` as they need to all share a certain shape/structure.
- Similarly content for components typically is in its structure strictly more constrained so it makes sense to put it under the control of a [schema](https://docs.astro.build/en/guides/content-collections/#defining-a-collection-schema) even if it's just for a single [collection entry](https://docs.astro.build/en/reference/api-reference/#collection-entry-type)—as it is the case for the default content `cta.astro` component.

Finally the `home.astro` layout is the only page the uses `cta.astro` twice; once with override content and again with the default content:

```Astro
// file: src/layouts/home.astro
import Base from './base.astro';
import Cta from '../components/cta.astro';

const {
  frontmatter: { title, intro, primaryCta },
} = Astro.props;
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
  <Cta />
</Base>
```

At this point `primaryCta` is sourced from the `src/pages/index.md` front matter:

```yaml
---
# file: src/pages/index.md
title: Hello, world
layout: layouts/home.html
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
---
```

… but later this will be put under the control of a collection schema.

---

[Next](../../README.md#lesson-8-creating-our-first-collection)
