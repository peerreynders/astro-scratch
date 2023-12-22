# Lesson 20: Setting up fonts

## Adding fonts

The desired [Google Fonts](https://fonts.google.com/) are installed with the package manager via [Fontsource](https://fontsource.org/).

```shell
pnpm add @fontsource/literata,
pnpm add @fontsource/red-hat-display
```

Then in the `src/layouts/base.astro` layout component the necessary fonts are [`import`](https://docs.astro.build/en/guides/fonts/#using-fontsource)ed—Astro then takes care of the rest:

```Astro
---
// file: src/layouts/base.astro

// …

import '@fontsource/literata/index.css';
import '@fontsource/literata/400-italic.css';
import '@fontsource/literata/400.css';
import '@fontsource/literata/900.css';
import '@fontsource/red-hat-display/index.css';
import '@fontsource/red-hat-display/400.css';
import '@fontsource/red-hat-display/900.css';

// …
```

This also keeps any font [`@import`](https://sass-lang.com/documentation/at-rules/import/)s out of the `scss` making it possible to fully leverage [Sass modules](https://sass-lang.com/documentation/at-rules/use/).

---

[Next](../../README.md#lesson-21-setting-up-images)
