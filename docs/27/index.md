# Lesson 27: Styling the blog

Background: [CSS Architecture](../css-architecture/index.md)

## Creating a page header block

Recap: `src/components/page-header.astro` renders as

```Astro
<div class="c-page-header">
  <div class="c-page-header__wrapper u-flow">
    <!-- prettier-ignore -->
    <h1>{title}</h1>
    {
      Astro.slots.has('default') && (
        <div class="c-page-header__content">
          <slot />
        </div>
      )
    }
  </div>
</div>

```

… leading to the CSS component:

```scss
// file: src/styles/component/_page-header.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-page-header {
  background: s.from-color('light-light');
  padding: s.from-size('800') 0;

  &__wrapper {
    @include u.wrapper;
  }

  &__content {
    max-width: s.from-measure('long');
  }

  & h1 {
    @include u.headline('primary');
  }
}
```

Given that `src/components/page-header.astro` is used in _most_ layouts `c-page-header` is included in `src/styles/critical.scss`:

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

## Creating a post list block

Recap: `src/components/post-list.astro` renders as

```astro
<div class="c-post-list" id="post-list">
  <div class="c-post-list__wrapper u-flow">
    {
      headline && /* prettier-ignore */ <h2 class="c-post-list__header">{headline}</h2>
    }
    <div>
      <ol class="u-flow">
        {
          posts.map((item) => (
            <li class="c-post-list__item">
              <a href={hrefFromPostSlug(item.slug)} class="c-post-list__link">
                {item.data.title}
              </a>
            </li>
          ))
        }
      </ol>
    </div>
  </div>
</div>
```

… leading to the CSS component:

```scss
// file: src/styles/component/_post-list.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-post-list {
  background-color: s.from-color('secondary-light');
  @include u.page-panel;

  &__wrapper {
    --u-flow-space: #{s.from-size('700')};
  }

  &__header {
    @include u.headline('primary');
    // max-width: s.from-measure('micro');
  }

  &__item {
    line-height: s.from-line-height('tight');
    max-width: s.from-measure('long');
  }

  &__link {
    color: s.from-color('dark-dark');
    font-family: s.from-font-family('sans');
    font-size: s.from-size('700');
    font-weight: s.from-font-weight('bold');
    text-decoration-color: s.from-color('primary-dark');

    &:hover {
      color: s.from-color('primary-dark');
      text-decoration-color: s.from-color('dark-dark');
    }
  }
}
```

`src/components/post-list.astro` appears in the `feed.astro` and `post.astro` layout components. So `c-post-list` is included in both those layout's style sheets:

```scss
// file: src/styles/feed.scss
@use 'sass:meta';

@use 'setting' as s;

@include meta.load-css('component/post-list');
@include meta.load-css('component/pagination');

// utilities / overrides
@include meta.load-css('critical-epilog');
```

```scss
// file: src/styles/post.scss
@use 'sass:meta';

@use 'setting' as s;

// Generic styles
time[datetime] {
  display: block;
  color: s.from-color('primary-dark');
  font-size: s.from-size('700');
  font-style: italic;
}

@include meta.load-css('component/tag-list');
@include meta.load-css('component/post-content');
@include meta.load-css('component/post-list');

// utilities / overrides
@include meta.load-css('critical-epilog');
```

## Creating a pagination block

Recap: `src/components/pagination.astro` renders as

```Astro
<footer class="c-pagination">
  <div class="c-pagination__wrapper">
    <nav class="c-pagination__inner" aria-label="Pagination links">
      {previousHref && (
        <a href={previousHref} class="c-pagination__previous">
          <span>{previous?.label ?? 'Previous'}</span>
        </a>
      )}
      {nextHref && (
        <a href={nextHref} class="c-pagination__next">
          <span>{next?.label ?? 'Next'}</span>
        </a>
      )}
    </nav>
  </div>
</footer>
```

… leading to the CSS component:

```scss
// file: src/styles/component/_pagination.scss
@use '../setting' as s;
@use '../generic/mixin' as g;
@use '../utility/mixin' as u;

.c-pagination {
  background-color: s.from-color('light-light');
  font-family: s.from-font-family('sans');
  font-weight: s.from-font-weight('bold');
  @include u.page-panel;

  &__inner {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    & a {
      @include g.anchor;
    }
  }

  // Pushes a sole "next" link out to the right
  &__inner > &__next {
    margin-inline-start: auto;
  }
}
```

As seen further above `c-pagination` is included in the `src/styles/feed.scss` style sheet.

## Styling our blog posts

Earlier within the `c-post-list` component the `page-content` mixin was used. This will also later be reused in the `c-page` component for the [contact page](file:///home/wheatley/sbox/astro/astro-scratch/docs/29/index.md#adding-the-template) (`src/layouts/page.astro`) as it gives free form content a consistent look and feel.

```scss
// file src/styles/utility/_page-content.scss
@use '../setting' as s;

@mixin page-content {
  line-height: s.from-line-height('loose');

  > * {
    max-width: s.from-measure('long');
  }

  blockquote {
    border-inline-start: 1rem solid s.from-color('quinary');
    padding-inline-start: s.from-size('600');
    padding-top: s.from-size('500');
    padding-bottom: s.from-size('500');
    font-style: italic;
  }

  h2 {
    font-size: s.from-size('700');
  }

  h3 {
    font-size: s.from-size('600');
  }

  ol,
  ul {
    padding-inline-start: s.from-size('800');
  }

  li + li {
    margin-top: s.from-size('300');
  }

  // Add a greater flow space for heading elements so
  // they appear more like article sections
  h2,
  h3 {
    --u-flow-space: #{s.from-size('800')};
  }

  // Add tighter flow for elements that follow a heading
  h2 + *,
  h3 + * {
    --u-flow-space: #{s.from-size('300')};
  }
}
```
