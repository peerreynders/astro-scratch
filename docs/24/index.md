# Lesson 24: Styling the skip link

Background: [css architecture](../css-architecture/index.md)

## Styling our site’s buttons

Anchors styled as buttons appear in multiple contexts: home layout, work (landing) layout, call to action component, and featured work component. Generally they are simply rendered as:

```astro
<a href="/work" class="c-button">See more work</a>
```

… while `src/components/cta.astro` uses the “ghost” variation:

```astro
<a class="c-button c-button--ghost" href={cta.button.url}>
  {cta.button.text}
</a>
```

`src/styles/component/_button.scss` targets these `c-button` anchors:

```scss
// file: src/styles/component/_button.scss
@use '../setting' as s;

.c-button {
  background: s.from-color('quaternary-light');
  border: 2px solid;
  border-radius: s.$border-radius;
  color: s.from-color('dark-dark');
  display: inline-block;
  font-family: s.from-font-family('sans');
  font-weight: s.from-font-weight('bold');
  padding: 0.5rem 2rem;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;

  // Make sure hover state trumps all variants with a good ol’ important
  &:hover {
    background: s.from-color('quaternary') !important;
    color: s.from-color('dark-dark') !important;
  }
}

// Add a ghost modifier
.c-button--ghost {
  background: transparent;
  color: s.from-color('quaternary-light');
}
```

## Styling the skip link

The skip link is implemented as part of the `src/components/site-head.astro` component:

```astro
<a class="c-skip-link" href="#main-content">Skip to content</a>
```

This is one of the few circumstance where [@extend](https://sass-lang.com/documentation/at-rules/extend/) is [used](https://csswizardry.com/2014/11/when-to-use-extend-when-to-use-a-mixin/) given that the skip link _is-a_ `c-button` that happens to only be visible when it has focus:

```scss
// file: src/styles/component/_skip-link.scss
@use '../setting' as s;
@use '../utility/mixin' as u;
@use 'button';

.c-skip-link {
  position: absolute;
  top: s.from-size('400');
  left: s.from-size('400');
  z-index: 99;

  &:not(:focus) {
    @include u.visually-hidden;
  }

  @extend .c-button;
}
```

## Wiring it all up

Skip link is in the site header which is part of `src/layouts/base.astro`, the foundation for all layouts, so both `c-skip-link` and `c-button` go into its style sheet:

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

[Next](../../README.md#lesson-25-home-page-intro)
