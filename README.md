# Astro from Scratch

Objective: Go through the [Learn Eleventy from Scratch](https://learneleventyfromscratch.com/) lessons ([MIT Licence](https://github.com/Andy-set-studio/learneleventyfromscratch.com#licence-mit-licence)) but build [the site](https://issue33.com/) with [Astro](https://docs.astro.build/en/getting-started/) instead.

## Background

Initially paid, later the lessons [were free](https://twitter.com/piccalilli_/status/1404403153890578432) and the site was [open sourced](https://piccalil.li/blog/learn-eleventy-from-scratch-is-now-open-source/).

Having completed the lessons in August 2020, I somehow got off the [11ty](https://www.11ty.dev/) track (reliance on Common JS rather than ES Modules ultimately put me off—petty, I know). Then Astro came to my attention beginning of 2022 and once I figured out what it was it seemed like the perfect package (and [then some](https://twitter.com/NFS__21/status/1517377812298342400)).

Remaking the 11ty (& [Nunjucks](https://mozilla.github.io/nunjucks/)) `issue33` site with Astro 2.x seems like an interesting way to get reacquainted with [it](https://github.com/withastro/astro/releases/tag/astro%402.0.0).

## Notes

… in reverse chronological order:

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
