# Lesson 19: Setting up Sass

## Critical CSS

Just follow the [Sass and SCSS](https://docs.astro.build/en/guides/styling/#sass-and-scss) instructions:

```shell
pnpm add -D sass
```

Astro can process `sass`/`scss` syntax inline, however here Sass ([lesson 22](#lesson-22-global-css-and-design-tokens)) will process the entire `scss` for a layout first and then Astro [`import`](https://docs.astro.build/en/guides/styling/#import-a-local-stylesheet)s it—all completely handled by Astro.

`scss` common across most pages is referenced in `src/styles/critical.scss` and imported inside `src/layouts/base.astro`:

```Astro
---
// file: src/layouts/base.astro
import MetaInfo from '../components/meta-info.astro';

// …

import '../styles/critical.scss';

// …
```

## Getting the CSS on the page

`scss` specific to any given layout is referenced in a style sheet specific to that layout component, e.g.:

```Astro
---
// file: src/layouts/home.astro
import Base from './base.astro';

// …

import '../styles/home.scss';

// …
```

Any [assets generated](https://docs.astro.build/en/guides/integrations-guide/node/#assets) by Astro are placed under `dist/client/_astro` and are automatically named with a hash. CSS in particular is minified and if it is small enough it's inlined into the page.

---

[Next](file:///home/wheatley/sbox/astro/astro-scratch/README.md#lesson-20-setting-up-fonts)
