# Lesson 23: Styling global blocks

Background: [CSS Architecture](../css-architecture/index.md)

In `src/layouts/base.astro` the [Astro template](https://docs.astro.build/en/core-concepts/astro-syntax/) content of the `<body>` element renders as:

```astro
<div class="c-site-wrap">
  <SiteHead />
  <main tabindex="-1" id="main-content">
    <slot />
  </main>
  <footer role="contentinfo" class="c-site-foot">
    <div>
      <p>This is a made up agency for the course, <a href="https://piccalil.li/course/learn-eleventy-from-scratch/">“Learn Eleventy From Scratch”</a>.</p>
    </div>
  </footer>
</div>
```

## Styling the site header and navigation

The `<header>` portion of the `src/components/site-head.astro` component appears as:

```astro
<header role="banner" class="c-site-head">
  <div class="u-wrapper">
    <div class="c-site-head__inner">
      <a href="/" aria-label={`${SITE_NAME} - home`} class="c-site-head__brand">
        <Brand />
      </a>
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
    </div>
  </div>
</header>
```

… where `src/styles/component/_site-head.scss` maps onto `c-site-head` as:

```scss
// file: src/styles/component/_site-head.scss
@use '../setting' as s;

.c-site-head {
  padding: s.from-size('600') 0;

  &__inner {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  &__brand {
    flex-shrink: 0;
    margin-inline-end: s.from-size(
      '600'
    ); // Prevents nav bunching up to the logo

    // Optical adjustment to account for the offset the sunken 3s create
    transform: translateY(0.25rem);

    svg {
      width: 100px;
    }
  }

  @include s.at-breakpoint('md') {
    &__brand {
      svg {
        width: 160px;
      }
    }
  }
}
```

## Styling the navigation

Nested inside `c-site-head` is the `c-nav` component:

```scss
// file: src/styles/component/_nav.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

@include u.nav($name: 'c-nav') {
  font-family: s.from-font-family('sans');
  padding: s.from-size('300') 0;
}
```

… using the `nav` mixin:

```scss
// file: src/styles/utility/_nav.scss
@use '../setting' as s;

@mixin nav($name) {
  $underline-active: $name + '-active-underline';

  // Adds the fake underline to active state items
  %#{$underline-active},
  .js\:#{$name}--active:before {
    content: '';
    display: block;
    width: 100%;
    height: 0.25rem;
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.25rem;
    background: s.from-color('quinary-dark');
  }

  .#{$name} {
    line-height: 1;
    font-weight: 900;
    margin-top: -#{s.from-size('400')};
    margin-inline-start: -#{s.from-size('400')};

    &__list {
      display: flex;
      flex-wrap: wrap;

      > * {
        padding-top: s.from-size('400');
        padding-inline-start: s.from-size('400');
      }
    }

    a {
      text-decoration: none;
      display: block;
      position: relative;

      &[aria-current='page'] {
        &:before {
          @extend %#{$underline-active};
        }
      }
    }

    // At the end in case of overrides.
    @content;
  }
}
```

## Styling the site footer

The footer looks like this:

```astro
<footer role="contentinfo" class="c-site-foot">
  <div>
    <p>This is a made up agency for the course, <a href="https://piccalil.li/course/learn-eleventy-from-scratch/">“Learn Eleventy From Scratch”</a>.</p>
  </div>
</footer>
```

… and targeted with `c-site-foot`:

```scss
// file: src/styles/component/_site-foot.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-site-foot {
  padding: s.from-size('500') 0 s.from-size('700') 0;
  text-align: center;

  & > div:last-child {
    @include u.wrapper;
  }
}
```

## Wiring it all up

Being part of the site head component and/or the base layout `c-site-head`, `c-nav`, and `c-site-foot` all go into the style sheet for `src/layouts/base.astro`:

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

---

[Next](../../README.md#lesson-24-styling-the-skip-link)
