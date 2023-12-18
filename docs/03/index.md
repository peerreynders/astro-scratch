# Lesson 3: Template (Astro component) basics

## Getting started

Here the objective is to modify the [minimal](https://github.com/withastro/astro/tree/main/examples/minimal) starter to the first step towards the site:

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   ├── base.astro
│   │   └── home.astro
│   └── pages/
│       └── index.md
└── package.json
```

The `src/layouts/base.astro` layout is the foundational shell used by all of the site's layouts:

```Astro
---
// file: src/layouts/base.astro

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

The `title` [prop](https://docs.astro.build/en/reference/api-reference/#astroprops) is expected to be set by the container layout. The content provided by the container (as a nested template to `<Base />`) replaces [`<slot />`](https://docs.astro.build/en/core-concepts/astro-components/#slots).

The initial incarnation of `src/layouts/home.astro` layout starts with `src/layouts/base.astro` as its foundation:

```Astro
---
// file: src/layouts/home.astro
import Base from './base.astro';

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

The `title` is retrieved from the markdown file's [frontmatter](https://docs.astro.build/en/core-concepts/layouts/#markdown-layout-props) and then passed to the `Base` layout via it's `title` prop.

## Assigning our template to our page

The `src/pages/index.astro` component is replaced with the `src/pages/index.md` markdown page.

```markdown
---
# file: src/pages/index.md
layout: ../layouts/home.astro
title: Hello World
---

This is pretty _rad_, right?
```

The layout of markdown content is associated with the [`layout` frontmatter property](https://docs.astro.build/en/core-concepts/layouts/#markdownmdx-layouts).

---

[Next](file:///home/wheatley/sbox/astro/astro-scratch/README.md#lesson-4-front-matter-basics)
