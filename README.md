# Astro from Scratch

Objective: Go through the [Learn Eleventy from Scratch](https://learneleventyfromscratch.com/) lessons ([MIT Licence](https://github.com/Andy-set-studio/learneleventyfromscratch.com#licence-mit-licence)) but build [the site](https://issue33.com/) with [Astro](https://docs.astro.build/en/getting-started/) instead.

## Background

Initially paid, later the lessons [were free](https://twitter.com/piccalilli_/status/1404403153890578432) and the site was [open sourced](https://piccalil.li/blog/learn-eleventy-from-scratch-is-now-open-source/).

Having completed the lessons in August 2020, I somehow got off the [11ty](https://www.11ty.dev/) track (reliance on Common JS rather than ES Modules ultimately put me off—petty, I know). Then Astro came to my attention beginning of 2022 and once I figured out what it was it seemed like the perfect package (and [then some](https://twitter.com/NFS__21/status/1517377812298342400)).

Remaking the 11ty (& [Nunjucks](https://mozilla.github.io/nunjucks/)) `issue33` site with Astro 2.x seems like an interesting way to get reacquainted with [it](https://github.com/withastro/astro/releases/tag/astro%402.0.0).

## Notes

- [What are design tokens?](https://piccalil.li/tutorial/what-are-design-tokens/)
- [I used Tailwind for the U in CUBE CSS and I liked it](https://andy-bell.co.uk/i-used-tailwind-for-the-u-in-cube-css-and-i-liked-it/)
- [Learn Eleventy From Scratch could really do with an update](https://andy-bell.co.uk/learn-eleventy-from-scratch-could-really-do-with-an-update/)

… in reverse chronological order:

---

### Lesson 20

…temporarily parked…

[Fontsource](https://github.com/fontsource/fontsource)

---

### Lesson 19

…temporarily parked…

[Sass and SCSS](https://docs.astro.build/en/guides/styling/#sass-and-scss)

---

### Lesson 8

To be continued…

…temporarily parked…

- [`astro sync`](https://docs.astro.build/en/reference/cli-reference/#astro-sync)
- [Defining a collection schema](https://docs.astro.build/en/guides/content-collections/#defining-a-collection-schema)
- [Defining datatypes with Zod](https://docs.astro.build/en/guides/content-collections/#defining-datatypes-with-zod)
- [Building for static output](https://docs.astro.build/en/guides/content-collections/#building-for-static-output-default)
- [Static (SSG) Mode](https://docs.astro.build/en/core-concepts/routing/#static-ssg-mode)

---

### Lesson 7

Rather than focusing exploring a [tool feature](https://www.11ty.dev/docs/data-global/) here it is more important to identify the most appropriate (afaik) feature to solve the underlying problem especially as Astro supports [JSON imports](https://docs.astro.build/en/guides/imports/#json) out-of-the-box.

In Astro the final site url belongs in the [`astro.config.mjs`](https://docs.astro.build/en/guides/configuring-astro/) under the [`site` property](https://docs.astro.build/en/reference/configuration-reference/#site). That url is then available via [Astro.site](https://docs.astro.build/en/reference/api-reference/#astrosite).

```Astro
// file: astro.config.mjs

import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://issue33.com',
});
```

Meanwhile the site name can just go in a top level “configuration file”.

```TypeScript
// file: src/site-config.ts
const config = {
  siteName: 'Issue 33',
};

export { config as default };
```

```Astro
---
// file: src/components/SiteHead.astro
import Brand from './Brand.astro';
import config from '../site-config';
const { siteName } = config;
---

<a class="skip-link button" href="#main-content">
  Skip to content
</a>
<header role="banner" class="site-head">
  <div class="wrapper">
    <div class="site-head__inner">
      <a href="/" aria-label={`${siteName} - home`} class="site-head__brand">
        <Brand />
      </a>
      <nav class="nav site-head__nav font-sans" aria-label="Primary">
        <ul class="nav__list">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/work">Work</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</header>
```

Astro supports [dynamic routes](https://docs.astro.build/en/core-concepts/routing/#dynamic-routes)—it is even possibe to be [more dynamic than that](https://github.com/peerreynders/astro-reroute) if it is absolutely necessary.

However given this scenario [static routes](https://docs.astro.build/en/core-concepts/routing/#static-routes) seems to be the way to go … if it wasn't for [content collections](https://docs.astro.build/en/guides/content-collections/#generating-routes-from-content) introduced with [Astro 2.0](https://github.com/withastro/astro/releases/tag/astro%402.0.0).

But that is a topic for lesson 8.

So for the time being this will have to do:

```Astro
---
// file: src/components/SiteHead.astro
import Brand from './Brand.astro';
import config from '../site-config';
const { siteName } = config;

const navigations = [
  ['/', 'Home'],
  ['/about-us', 'About'],
  ['/work', 'Work'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const activeProps = (targetPath: string, current: string) => {
  const props: Record<string, string> = {};

  if (targetPath === current) props['aria-current'] = 'page';

  if (targetPath.length > 1 && current.startsWith(targetPath))
    props['data-active'] = 'active';

  return props;
};
---

<a class="skip-link button" href="#main-content">
  Skip to content
</a>
<header role="banner" class="site-head">
  <div class="wrapper">
    <div class="site-head__inner">
      <a href="/" aria-label={`${siteName} - home`} class="site-head__brand">
        <Brand />
      </a>
      <nav class="nav site-head__nav font-sans" aria-label="Primary">
        <ul class="nav__list">
          {navigations.map(([pathname, name]) => (
            <li>
              <a
                href={pathname}
                {...activeProps(pathname, Astro.url.pathname)}
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </div>
</header>
```

- [`Astro.url`](https://docs.astro.build/en/reference/api-reference/#astrourl)

JSON files can be easily loaded at build time like this:

```TypeScript
// file: tweet-info.ts
import tweets from '../data/tweet-info.data.json';
import type { TweetInfo } from '../lib/tweet-types';

function tweetInfo(id: string): TweetInfo | undefined {
  return (tweets as Record<string, TweetInfo>)[id];
}
```

Since Astro 2.0 content data can be handled with [Content Collections](https://docs.astro.build/en/guides/content-collections/).

Define a schema ([Defining a collection schema](https://docs.astro.build/en/guides/content-collections/#defining-a-collection-schema)):

```TypeScript
// file: src/schemas.ts
import { z } from 'astro/zod';

const cta = z.object({
  title: z.string(),
  summary: z.string(),
  buttonText: z.string(),
  buttonUrl: z.string(),
});

// …
```

Define a collection in the configuration ([`astro sync`](https://docs.astro.build/en/reference/cli-reference/#astro-sync)):

```TypeScript
// file: src/content/config.ts
// Use `npx astro sync` to generate the `astro:content` module
//
import { defineCollection } from 'astro:content';
import { cta, people, posts, work } from '../schemas';

export const collections = {
  cta: defineCollection({ schema: cta }),
  people: defineCollection({ schema: people }),
  posts: defineCollection({ schema: posts }),
  work: defineCollection({ schema: work }),
};
```

Place the data in markdown frontmatter:

```Markdown
---
# file: src/content/cta/global.md
title: 'Get in touch if we seem like a good fit'
summary: 'Vestibulum id ligula porta felis euismod semper. Praesent
  commodo cursus magna, vel scelerisque nisl consectetur et. Cras
  justo odio, dapibus ac facilisis in, egestas eget quam. Donec
  ullamcorper nulla non metus auctor fringilla.'
buttonText: 'Start a new project'
buttonUrl: '/contact'
---
```

Select it via its file [`slug`](https://docs.astro.build/en/reference/api-reference/#slug) ([`getEntryBySlug()`](https://docs.astro.build/en/reference/api-reference/#getentrybyslug)):

```TypeScript
---
// file: src/components/Cta.astro
import { getEntryBySlug } from 'astro:content';
const { cta: ctaProp } = Astro.props;
const cta = ctaProp ? ctaProp : (await getEntryBySlug('cta', 'global')).data;
---

{
  cta && (
    <article class="cta dot-shadow panel bg-dark-shade color-light">
      <div class="wrapper">
        <div class="cta__inner flow">
          <h2 class="cta__heading headline" data-highlight="quaternary">
            {cta.title}
          </h2>
          <p class="cta__summary measure-short">{cta.summary}</p>
          <div class="cta__action">
            <a class="button" data-variant="ghost" href={cta.buttonUrl}>
              {cta.buttonText}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
```

Finally nest it in the container component (note that only one of them uses the `cta` prop):

```TypeScript
// file: src/layouts/Home.astro
import Base from './Base.astro';
import Cta from '../components/Cta.astro';

const {
  frontmatter: { title, intro, primaryCTA },
} = Astro.props;
---

<Base title={title}>
  <article class="intro">
    <div class="intro__header radius frame">
      <h1 class="intro__heading weight-normal text-400 md:text-600">
        {intro.eyebrow}
        <em class="text-800 md:text-900 lg:text-major weight-bold">
          {intro.main}
        </em>
      </h1>
    </div>
    <div class="intro__content flow">
      <p class="intro__summary">{intro.summary}</p>
      <a href={intro.buttonUrl} class="button">
        {intro.buttonText}
      </a>
    </div>
    <div class="intro__media radius dot-shadow">
      <img class="intro__image radius" src={intro.image} alt={intro.imageAlt} />
    </div>
  </article>
  <Cta cta={primaryCTA} />
  <Cta />
</Base>
```

… while adding the alternate (`primaryCTA`) to the frontmatter of the page markdown.

```Markdown
---
# file: src/pages/index.md
title: Issue 33
layout: ../layouts/Home.astro
intro:
  eyebrow: Digital Marketing is our
  main: Bread & Butter
  summary: 'Let us help you create the perfect campaign with
	  our multi-faceted team of talented creatives.'
  buttonText: See our work
  buttonUrl: /work
  image: /images/bg/toast.jpg
  imageAlt: Buttered toasted white bread
primaryCTA:
  title: 'This is an agency that doesn’t actually exist'
  summary: 'This is the project site you build when you take the “Learn
    Eleventy From Scratch” course so it is all made up as a pretend
    context. You will learn a lot about Eleventy by building this site
    though. Take the course today!'
  buttonText: 'Buy a copy'
  buttonUrl: 'https://learneleventyfromscratch.com'
---

This is pretty _rad_, right?
```

---

### Lesson 6

Using components in the role of partials. While astro components are «components», they are design time components so for SSG there aren't any [runtme downsides](https://dev.to/this-is-learning/components-are-pure-overhead-hpm). In addition Astro component templates don't require a single root like JSX does ([Fragments & Multiple Elements](https://docs.astro.build/en/core-concepts/astro-syntax/#fragments--multiple-elements)).

```
/
├── public/
│   └── images/**
├── src/
│   ├── components/
│   │   ├── Brand.astro
│   │   └── SiteHead.astro
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── Home.astro
│   └── pages/
│       └── index.md
└── package.json
```

```Astro
---
// file: src/components/SiteHead.astro
import Brand from './Brand.astro';
---

<a class="skip-link button" href="#main-content">Skip to content</a>
<header role="banner" class="site-head">
  <div class="wrapper">
    <div class="site-head__inner">
      <a href="/" aria-label="Issue 33 - home" class="site-head__brand">
        <Brand />
      </a>
      <nav class="nav site-head__nav font-sans" aria-label="Primary">
        <ul class="nav__list">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/work">Work</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</header>
```

```svg
<svg
  aria-hidden="true"
  focusable="false"
  width="163"
  height="49"
  viewBox="0 0 163 49"
  xmlns="http://www.w3.org/2000/svg"
>
  <g fill-rule="nonzero" fill="none">
    <path
      d="M3.296 6.739c.914 0 1.691-.328 2.333-.984.642-.657.963-1.452.963-2.386 0-.933-.32-1.728-.963-2.385A3.143 3.143 0 003.296 0C2.383 0 1.605.328.963.984.32 1.641 0 2.436 0 3.37c0 .934.321 1.73.963 2.386.642.656 1.42.984 2.333.984zm3 21.882V8.594h-6v20.027h6zM17.74 29c1.259 0 2.431-.17 3.518-.511 1.086-.34 2.018-.814 2.796-1.42a6.737 6.737 0 001.833-2.158 5.623 5.623 0 00.667-2.688c0-1.565-.525-2.858-1.574-3.88-1.05-1.023-2.537-1.672-4.463-1.95l-3.889-.606c-.839-.126-1.432-.309-1.777-.549-.346-.24-.519-.561-.519-.965 0-.43.235-.776.704-1.041.47-.265 1.086-.398 1.852-.398.963 0 1.926.145 2.888.436.963.29 1.976.75 3.037 1.381l2.852-3.937a14.99 14.99 0 00-3.944-1.798 15.003 15.003 0 00-4.24-.625c-2.618 0-4.68.58-6.185 1.742-1.507 1.16-2.26 2.75-2.26 4.77 0 1.64.519 2.972 1.556 3.994 1.037 1.022 2.518 1.685 4.444 1.988l3.889.605c.69.101 1.197.272 1.518.511.321.24.481.55.481.928 0 .48-.29.864-.87 1.155-.58.29-1.364.435-2.352.435-.987 0-1.987-.17-3-.511-1.012-.34-2.135-.89-3.37-1.647l-2.851 4.127c1.136.858 2.5 1.508 4.092 1.95 1.593.441 3.315.662 5.167.662zm18.85 0c1.26 0 2.432-.17 3.518-.511 1.087-.34 2.019-.814 2.796-1.42a6.737 6.737 0 001.834-2.158 5.623 5.623 0 00.666-2.688c0-1.565-.524-2.858-1.574-3.88-1.049-1.023-2.537-1.672-4.462-1.95l-3.889-.606c-.84-.126-1.432-.309-1.778-.549-.345-.24-.518-.561-.518-.965 0-.43.234-.776.704-1.041.469-.265 1.086-.398 1.851-.398.963 0 1.926.145 2.889.436.963.29 1.975.75 3.037 1.381l2.851-3.937a14.99 14.99 0 00-3.944-1.798 15.003 15.003 0 00-4.24-.625c-2.617 0-4.679.58-6.185 1.742-1.506 1.16-2.259 2.75-2.259 4.77 0 1.64.518 2.972 1.555 3.994 1.037 1.022 2.519 1.685 4.445 1.988l3.888.605c.691.101 1.198.272 1.519.511.32.24.481.55.481.928 0 .48-.29.864-.87 1.155-.58.29-1.364.435-2.352.435-.988 0-1.987-.17-3-.511-1.012-.34-2.135-.89-3.37-1.647l-2.852 4.127c1.136.858 2.5 1.508 4.093 1.95 1.592.441 3.314.662 5.166.662zm18.777 0c.987 0 1.932-.151 2.833-.454a8.172 8.172 0 002.425-1.288v1.363h6V8.594h-6v13.554a4.016 4.016 0 01-1.48 1.173c-.593.278-1.272.417-2.038.417-1.061 0-1.92-.335-2.574-1.004-.654-.669-.981-1.546-.981-2.63V8.593h-6v12.342c0 2.347.729 4.278 2.185 5.792C51.194 28.243 53.07 29 55.367 29zm24.739 0c1.63 0 3.092-.24 4.388-.72 1.296-.479 2.562-1.249 3.796-2.309l-3.962-3.596a4.86 4.86 0 01-1.704 1.117c-.667.265-1.407.397-2.222.397-1.136 0-2.123-.297-2.963-.89a5.27 5.27 0 01-1.852-2.29H89.55v-1.514c0-1.565-.247-3.023-.74-4.373-.494-1.35-1.18-2.505-2.056-3.464a9.635 9.635 0 00-3.13-2.272c-1.209-.555-2.53-.833-3.962-.833-1.432 0-2.771.265-4.018.795a9.895 9.895 0 00-3.24 2.196 10.398 10.398 0 00-2.167 3.313 10.479 10.479 0 00-.796 4.07c0 1.438.277 2.795.833 4.07a10.435 10.435 0 002.259 3.312c.95.934 2.08 1.666 3.389 2.196a11.04 11.04 0 004.185.795zm3.555-12.57h-8.185c.297-1.009.803-1.791 1.519-2.346.716-.556 1.567-.833 2.555-.833.963 0 1.809.29 2.537.87.728.58 1.253 1.35 1.574 2.31z"
      fill="#263147"
    />
    <path
      d="M109.363 49c2.475 0 4.763-.308 6.865-.924 2.102-.617 3.909-1.472 5.421-2.565 1.513-1.093 2.701-2.395 3.566-3.906.864-1.511 1.296-3.161 1.296-4.95 0-2.068-.619-3.897-1.856-5.487-1.238-1.59-2.917-2.803-5.039-3.638 1.808-1.034 3.222-2.396 4.243-4.085 1.022-1.69 1.532-3.549 1.532-5.577 0-1.75-.392-3.36-1.178-4.83a11.35 11.35 0 00-3.241-3.758c-1.375-1.034-3.045-1.839-5.01-2.415-1.964-.577-4.105-.865-6.423-.865-3.142 0-6.207.646-9.192 1.938-2.986 1.292-5.48 3.072-7.484 5.338l6.482 5.904c1.728-1.789 3.31-3.031 4.744-3.727 1.433-.696 3.133-1.044 5.097-1.044 1.925 0 3.506.428 4.744 1.282 1.237.855 1.856 1.959 1.856 3.31 0 1.511-.629 2.754-1.886 3.728-1.257.974-2.868 1.461-4.832 1.461h-2.887v7.693h3.889c2.121 0 3.781.358 4.98 1.074 1.198.716 1.797 1.69 1.797 2.922 0 1.471-.698 2.644-2.092 3.52-1.395.874-3.232 1.311-5.51 1.311-2.24 0-4.115-.318-5.628-.954-1.512-.636-3.054-1.79-4.626-3.46l-6.423 5.965c1.925 2.107 4.37 3.757 7.337 4.95 2.966 1.193 6.118 1.789 9.458 1.789zm36.489 0c2.475 0 4.763-.308 6.865-.924 2.102-.617 3.909-1.472 5.421-2.565 1.513-1.093 2.701-2.395 3.566-3.906.864-1.511 1.296-3.161 1.296-4.95 0-2.068-.619-3.897-1.856-5.487-1.238-1.59-2.917-2.803-5.039-3.638 1.807-1.034 3.222-2.396 4.243-4.085 1.022-1.69 1.532-3.549 1.532-5.577 0-1.75-.393-3.36-1.178-4.83a11.35 11.35 0 00-3.241-3.758c-1.375-1.034-3.045-1.839-5.01-2.415-1.964-.577-4.105-.865-6.423-.865-3.142 0-6.207.646-9.193 1.938-2.985 1.292-5.48 3.072-7.484 5.338l6.483 5.904c1.728-1.789 3.31-3.031 4.743-3.727 1.434-.696 3.134-1.044 5.098-1.044 1.925 0 3.506.428 4.744 1.282 1.237.855 1.856 1.959 1.856 3.31 0 1.511-.629 2.754-1.886 3.728-1.257.974-2.868 1.461-4.832 1.461h-2.888v7.693h3.89c2.121 0 3.781.358 4.98 1.074 1.198.716 1.797 1.69 1.797 2.922 0 1.471-.698 2.644-2.092 3.52-1.395.874-3.232 1.311-5.51 1.311-2.24 0-4.115-.318-5.628-.954-1.512-.636-3.054-1.79-4.626-3.46l-6.423 5.965c1.925 2.107 4.37 3.757 7.336 4.95 2.967 1.193 6.12 1.789 9.459 1.789z"
      fill="#513AA6"
    />
  </g>
</svg>
```

```Astro
---
// file: src/layouts/Base.astro
import SiteHead from '../components/SiteHead.astro';
const { title } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="generator" content="{Astro.generator}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <SiteHead />
    <main tabindex="-1" id="main-content">
      <slot />
    </main>
  </body>
</html>
```

---

### Lesson 5

For the time being 11ty's [passthrough file copy](https://www.11ty.dev/docs/copy/) is largely addressed by Astro's [`public/`](https://docs.astro.build/en/core-concepts/project-structure/#public) project folder for unprocessed (by Astro's build pipeline) assets and [imports](https://docs.astro.build/en/guides/imports/) do everything else.

May have to backtrack on this if something falls through the cracks or doesn't quite fit.

---

### Lesson 4

- Removed double quotes around the braces for attribute expressions.
- Moved `images/` under the `public/` folder.

- Never been a fan of the [brackets for grouping class names](https://andy-bell.co.uk/cube-css/#heading-grouping). It's nice that web technologies are resilent but knowingly exploiting that towards non-standard ends? (I feel the same way about [ASI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#automatic_semicolon_insertion)). Navigate the browser to [`issue33`](https://issue33.com/). Open the web developer tools and run the following code in the JavaScript console:

```JavaScript
const articles = document.querySelectorAll('article');
const tokenList = articles[1].classList
console.log(`length: ${tokenList.length} value: ${tokenList.value}`);
for (const [key, value] of tokenList.entries()) console.log(`[${key}]: ${value}`);

// length: 7 value: [ cta ] [ dot-shadow panel ] [ bg-dark-shade color-light ]
// [0]: [
// [1]: cta
// [2]: ]
// [3]: dot-shadow
// [4]: panel
// [5]: bg-dark-shade
// [6]: color-light
```

The brackets pollute the `class` token list and only their first occurence is tracked as later duplicates are removed. It's a case of author time convenience introducing “runtime noise”.

```Astro
---
// file: src/layouts/Home.astro
import Base from './Base.astro';

const {
	frontmatter: { title, intro },
} = Astro.props;
---
<Base title={title}>
  <article class="intro">
    <div class="intro__header radius frame">
      <h1 class="intro__heading weight-normal text-400 md:text-600">
        {intro.eyebrow}
        <em class="text-800 md:text-900 lg:text-major weight-bold">
          {intro.main}
        </em>
      </h1>
    </div>
    <div class="intro__content flow">
      <p class="intro__summary">{intro.summary}</p>
      <a href={intro.buttonUrl} class="button">
        {intro.buttonText}
      </a>
    </div>
    <div class="intro__media radius dot-shadow">
      <img class="intro__image radius" src={intro.image} alt={intro.imageAlt} />
    </div>
  </article>
</Base>
```

---

### Lesson 3

Instead of [Nunjucks](https://mozilla.github.io/nunjucks/), use the [Astro syntax](https://docs.astro.build/en/core-concepts/astro-syntax/).

```
/
├── public/
├── src/
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── Home.astro
│   └── pages/
│       └── index.md
└── package.json
```

- [Astro.props](https://docs.astro.build/en/reference/api-reference/#astroprops)
- [Slots](https://docs.astro.build/en/core-concepts/astro-components/#slots)

```Astro
---
// file: src/layouts/Base.astro

const { title } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="generator" content="{Astro.generator}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [Markdown Layout Props](https://docs.astro.build/en/core-concepts/layouts/#markdown-layout-props)

```Astro
---
// file: src/layouts/Home.astro
import Base from './Base.astro';

const {
	frontmatter: { title },
} = Astro.props;
---

<Base title={title}>
  <article>
    <h1>{title}</h1>
    <slot />
  </article>
</Base>
```

```Markdown
---
# file: src/pages/index.md
layout: ../layouts/Home.astro
title: Hello World
---

This is pretty _rad_, right?
```

Also installed the [`prettier-plugin-astro`](https://github.com/withastro/prettier-plugin-astro) plugin.

```shell
npm run format
```

---

### Lesson 2

Installed the «minimal» Astro template which is a “Hello World” setup.

```shell
npm create astro@latest -- --template minimal
```

---

### Lesson 1

Acquired the [starter files](https://learneleventyfromscratch.com/lesson/1.html#getting-some-starter-files) ([front end](https://piccalilli.s3.eu-west-2.amazonaws.com/eleventy-from-scratch/eleventy-from-scratch-front-end-build-starter-files.zip)).
