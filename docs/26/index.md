# Lesson 26: Home page panels

Background: [CSS Architecture](../css-architecture/index.md)

## Call to action block

Recap: `src/components/cta.astro` appears as

```Astro
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
```

… which is targeted by the `c-cta` CSS component:

```scss
// file: src/styles/component/_cts.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-cta {
  @include u.page-panel;
  background-color: s.from-color('dark-dark');
  color: s.from-color('light');

  // This is a dark panel, so we need to flip the selection styles
  ::selection {
    // We set this as an RGBA because that’s how you get a solid color, by using 0.99
    // alpha value. Browsers are wild.
    background: rgba(s.from-color('light'), 0.99);
    color: s.from-color('dark-dark');
  }

  &__outer {
    @include u.wrapper;
  }

  &__heading {
    @include u.headline('quaternary');
  }

  &__summary {
    max-width: s.from-measure('short');
  }

  @include s.at-breakpoint('md') {
    &__inner {
      display: grid;
      grid-gap: s.from-size('700') s.from-size('500');
      grid-template-columns: repeat(12, 1fr);

      @supports (display: grid) {
        > * {
          margin: 0;
        }
      }
    }

    &__heading {
      grid-area: 1/1/1/9;
    }

    &__summary {
      // Pull the content in from the right, by reversing columns
      grid-area: 2/5/2/12;
    }

    &__action {
      grid-area: 3/3/3/12;
    }
  }

  @include s.at-breakpoint('lg') {
    &__inner {
      grid-gap: s.from-size('500');
    }

    &__summary {
      grid-area: 2/7/2/12;
    }

    &__action {
      grid-area: 3/6/3/12;
    }
  }
}
```

## Headline utility

The `headline` mixin takes an optional `$highlight-name` argument which supplies the name of the color to be applied to the closing period of the headline:

```scss
// file: src/styles/utility.scss
@use '../setting' as s;

@mixin headline($highlight-name: null) {
  $color-maybe: if($highlight-name, s.from-color($highlight-name), null);

  font-size: s.from-size('700');
  max-width: 18ch;

  @include s.at-breakpoint('md') {
    font-size: s.from-size('800');
  }

  @include s.at-breakpoint('lg') {
    font-size: s.from-size('900');
  }

  &::after {
    content: '.';
    @if $color-maybe {
      color: $color-maybe;
    }
  }
}
```

## Adding our CSS to critical CSS

As `src/components/cta.astro` appears in almost every layout `c-cta` is included in the base style sheet:

```scss
// file: src/styles/critical.scss
@use 'sass:meta';
@use 'setting' as s;
@use 'generic/anchor' as a;

@include meta.load-css('generic/reset');

// …

// blocks/components
@include meta.load-css('component/_site-wrap');
@include meta.load-css('component/_button');
@include meta.load-css('component/_skip-link');
@include meta.load-css('component/_site-head');
@include meta.load-css('component/_nav');
@include meta.load-css('component/_page-header');
@include meta.load-css('component/_cta');
@include meta.load-css('component/_site-foot');

// …
```

## Featured work feed

Recap: `src/components/featured-work.astro` renders as

```Astro
<article class="c-featured-work">
  <div class="c-featured-work__wrapper u-flow">
    <div class="c-featured-work__inner u-flow">
      <div class="c-featured-work__intro u-flow">
        <!-- prettier-ignore -->
        <h2 class="c-featured-work__title">{featuredWork.title}</h2>
        <p class="c-featured-work__summary">
          {featuredWork.summary}
        </p>
      </div>
      {
        collection.map(({ slug, data: { title, hero } }) => (
          <a
            href={`/work/${slug}`}
            aria-label={`See ${title}`}
            class="c-featured-work__item"
          >
            <Image
              src={hero.src}
              alt={hero.alt}
            />
          </a>
        ))
      }
    </div>
    <div class="c-featured-work__action">
      <a href="/work" class="c-button">See more work</a>
    </div>
  </div>
</article>
```

… which is targeted by the `c-featured-work` CSS component:

```scss
// file: src/styles/component/_featured-work.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-featured-work {
  background-color: s.from-color('light-light');
  @include u.page-panel;

  &__intro {
    --u-flow-space: #{s.from-size('300')};
  }

  &__title {
    @include u.headline('dark');
    color: s.from-color('quinary-dark');
  }

  &__summary {
    max-width: s.from-measure('compact');
  }

  &__item {
    display: block;

    @include u.frame;
    &::before {
      border-color: s.from-color('quaternary');
    }

    img {
      border-radius: s.$border-radius;
    }
  }

  &__action {
    --u-flow-space: #{s.from-size('700')};
    text-align: center;
  }

  @include s.at-breakpoint('md') {
    &__inner {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: s.from-size('700') s.from-size('500');

      @supports (display: grid) {
        > * {
          margin: 0;
        }
      }
    }

    &__intro {
      grid-column: 1/13;
      align-self: end;
    }

    &__item {
      &:nth-child(odd) {
        grid-column: 1/8;
      }

      &:nth-child(even) {
        grid-column: 13/6;
      }
    }
  }

  @include s.at-breakpoint('lg') {
    grid-template-columns: repeat(2, 1fr);

    //    &__title {
    //      max-width: s.from-measure('micro');
    //    }

    &__intro,
    &__item {
      &:nth-child(odd) {
        grid-column: 1/7;
      }

      &:nth-child(even) {
        grid-column: 13/7;
      }
    }
  }
}
```

`src/components/featured-work` being part of the `home.astro` layout gets `c-featured-work` included in the layout's style sheet:

```scss
// file: src/styles/home.scss
@use 'sass:meta';

@include meta.load-css('component/intro');
@include meta.load-css('component/featured-work');
@include meta.load-css('component/studio-feed');

// utilities / overrides
@include meta.load-css('critical-epilog');
```

## Studio feed

Recap: `src/components/studio-feed.astro` appears as

```Astro
<article class="c-studio-feed">
  <div class="c-studio-feed__wrapper u-flow">
    {/* prettier-ignore */}
    <h2 class="c-studio-feed__title">{studioFeed.title}</h2>
    <p class="u-visually-hidden" id="studio-feed-desc">
      A collection of images from around our studio and the people who work
      here.
    </p>
    <div>
      <ul class="c-studio-feed__list">
        {feed.map(({ src, alt, width, quality }) => (
          <li>
            <Image
              src={src}
              alt={alt}
              width={width}
              quality={quality}
              draggable="false"
            />
          </li>
        ))}
      </ul>
    </div>
  </div>
</article>
```

… which is targeted by the `c-studio-feed` CSS component:

```scss
// file: src/styles/component/_studio-feed.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-studio-feed {
  @include u.page-panel;
  background-color: s.from-color('tertiary-light');

  &__wrapper {
    --u-flow-space: #{s.from-size('300')};

    & > div:last-child {
      --u-flow-space: #{s.from-size('700')};
    }
  }

  &__title {
    @include u.headline('secondary');
  }

  &__list {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    img {
      border-radius: s.$border-radius;
    }

    > * {
      width: 16rem;
      height: 13rem;
      flex-shrink: 0;
      padding: 0 0 s.from-size('400') 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    > * + * {
      margin-inline-start: s.from-size('500');
    }
  }

  @include s.at-breakpoint('md') {
    //    &__title {
    //      max-width: s.from-measure('micro');
    //    }

    &__list {
      > * {
        width: 28rem;
        height: 17rem;
      }
    }
  }
}
```

As indicated earlier `c-studio-feed` also is included in the `home.astro` layout's style sheet.
