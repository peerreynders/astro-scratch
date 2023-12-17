# Lesson 25: Home page intro

Background: [CSS Architecture](../css-architecture/index.md)

## Wiring up our block and critical CSS

Recap: The `src/layouts/home.astro` layout is responsible for rendering the intro fragment:

```Astro
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
```

… which is targeted by `src/styles/component/_intro.scss`:

```scss
// file: src/styles/component/_intro.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-intro {
  // Default is a single column layout where the header overlaps the media
  display: grid;
  grid-template-rows: s.from-size('700') minmax(0, 1fr) s.from-size('700') auto;
  gap: s.from-size('500');

  // Force items to span 1 column
  > * {
    grid-column: 1;
  }

  &__header {
    @include u.frame;

    // Prevents it from stretching to fill the space
    align-self: center;
    background: rgba(s.from-color('tertiary'), 0.95);
    border-radius: s.$border-radius;
    grid-row: 2;
    margin: 0 s.from-size('500'); // Adds a horizontal gutter
    padding: s.from-size('300') s.from-size('500');
    z-index: 1;
  }

  &__heading {
    font-size: s.from-size('400');
    font-weight: s.from-font-weight('normal');

    em {
      font-size: s.from-size('800');
      font-style: normal;
      font-weight: s.from-font-weight('bold');
      display: block;

      // The weight change creates a weird indent, so this
      // optical adjustment fixes it
      transform: translateX(-3px);
    }
  }

  &__media {
    @include u.dot-shadow;
    border-radius: s.$border-radius;
    grid-row: 1/4;
    position: relative;

    img {
      border-radius: s.$border-radius;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    grid-row: 4;

    p {
      max-width: 30ch;
    }
  }

  // Switch to an inline layout with some vert space
  // above the header and content
  @include s.at-breakpoint('md') {
    grid-template-rows: s.from-size('500') auto auto auto;
    grid-template-columns: minmax(15rem, 1fr) 2fr;

    &__header {
      padding: s.from-size('500');
      margin: 0;
      grid-column: 1/3;
      justify-self: start;
      align-self: end;
    }

    &__heading {
      font-size: s.from-size('600');

      em {
        font-size: s.from-size('900');
      }
    }

    &__media {
      grid-column: 3/2;
      grid-row: 1/5;
    }

    &__content {
      grid-row: 3/4;
      grid-column: 1;
    }
  }

  // Flip the ratio for larger breakpoints
  @include s.at-breakpoint('lg') {
    grid-template-columns: 1fr minmax(44rem, 1fr);

    &__heading {
      em {
        font-size: s.from-size('major');
      }
    }

    // Because it's so large, it make sense to limit the image height too
    &__media {
      height: 28rem;
    }
  }
}
```

FYI: [Grid by Example](https://gridbyexample.com/)

As the “intro” fragment is part of the `home.astro` layout, `c-intro` is included in the layout's style sheet:

```scss
// file: src/styles/home.scss
@use 'sass:meta';

@include meta.load-css('component/intro');
@include meta.load-css('component/featured-work');
@include meta.load-css('component/studio-feed');

// utilities / overrides
@include meta.load-css('critical-epilog');
```

---

[Next](../../README.md#lesson-26-home-page-panels)
