# Lesson 29: Add a contact page

Background: [CSS Architecture](../css-architecture/index.md)

## Adding the template

Starting with the markdown `src/pages/contact.md`:

```markdown
---
# file: src/pages/contact.md
title: Contact us
layout: ../layouts/page.astro
---

This is a made up agency that is being used as a context for the project that you build when you [learn Eleventy from scratch](https://learneleventyfromscratch.com), so ideally, you shouldn’t try to contact us.

You can go ahead and purchase the course to build this page—amongst [the rest of the site](/)—by visiting [Piccalilli](https://learneleventyfromscratch.com).
```

… which requires the `src/layouts/page.astro` layout component:

```Astro
---
// file: src/layouts/page.astro
import Base from './base.astro';
import PageHeader from '../components/page-header.astro';

import '../styles/page.scss';

interface Props {
  frontmatter: {
    title: string;
  };
}

const {
  frontmatter: { title },
} = Astro.props;
---

<Base title={title}>
  <article>
    <PageHeader title={title} />
    <div class="c-page">
      <div class="c-page__wrapper u-flow" >
        <slot />
      </div>
    </div>
  </article>
</Base>
```

The markdown content will be placed in the [`<slot />`](https://docs.astro.build/en/guides/markdown-content/#frontmatter-layout).

The matching `src/styles/component/_page.scss` CSS component:

```scss
// file: src/styles/component/_page.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-page {
  background-color: s.from-color('tertiary-light');
  @include u.page-panel;

  &__wrapper {
    --u-flow-space: #{s.from-size('700')};
    @include u.page-content;
  }
}
```

… which is included in the layout's style sheet `src/styles/page.scss`:

```scss
// file: src/styles/page.scss
@use 'sass:meta';

@include meta.load-css('component/page');

// utilities / overrides
@include meta.load-css('critical-epilog');
```

---

[Next](../../README.md#lesson-30-styling-the-work-section)
