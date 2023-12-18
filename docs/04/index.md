# Lesson 4: Front matter basics

## Adding Front Matter to our home page

Add the `intro` data into the home page's ([YAML](https://yaml.org/spec/1.2.2/)) front matter

```markdown
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
---
```

Note:

- how strings don't require quotes
- `>` is used for multi-line string properties ([folded style](https://yaml.org/spec/1.2.2/#folded-style))
- both `button` and `image` have been split into their own subtree

The `src/layouts/home.astro` layout can now use the `intro` data in the page:

```astro
// file: src/layouts/home.astro
import Base from './base.astro';

const {
  frontmatter: { title, intro },
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
      <img class="c-intro__image" src={intro.image.src} alt={intro.image.alt} />
    </div>
  </article>
</Base>
```

## Aside

Never been a fan of the [brackets for grouping class names](https://andy-bell.co.uk/cube-css/#heading-grouping). It's nice that web technologies are resilent but knowingly exploiting that towards non-standard ends? (I feel the same way about [ASI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#automatic_semicolon_insertion)). Navigate the browser to [`issue33`](https://issue33.com/). Open the web developer tools and run the following code in the JavaScript console:

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

[Next](file:///home/wheatley/sbox/astro/astro-scratch/README.md#lesson-5-passthrough-basics)
