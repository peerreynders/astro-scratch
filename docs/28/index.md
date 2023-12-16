# Lesson 28: Styling the about page

Background: [CSS Architecture](../css-architecture/index.md)

## Adding an auto-grid utility

The concept of the auto-grid is explained in [Create a responsive grid layout](https://piccalil.li/tutorial/create-a-responsive-grid-layout-with-no-media-queries-using-css-grid/). Here it's a mixin that can be composed into a CSS component:

```scss
@use '../setting' as s;
//  AUTO GRID
//  Set the minimum item size with `--u-auto-grid-min-size`
//  and you’ll get a fully responsive grid with no media queries.
//
//  https://piccalil.lihttps://piccalil.li/tutorial/create-a-responsive-grid-layout-with-no-media-queries-using-css-grid/
@mixin auto-grid($min-size: 16rem, $grid-gap: s.from-size('500')) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($min-size, 1fr));
  grid-gap: #{$grid-gap};
}
```

## Adding a people block

Recap: The `src/components/people-panel.astro` renders as follows:

```Astro
<article class="c-people-panel">
  <div class="c-people-panel__wrapper u-flow">
    {/* prettier-ignore */}
    <h2>{title}</h2>
    <People people={people} />
  </div>
</article>
```

… which is targeted by the `c-people-panel` CSS component:

```scss
// file: src/styles/component/_people-panel.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-people-panel {
  background-color: s.from-color('light-light');
  @include u.page-panel;

  &__wrapper {
    --u-flow-space: #{s.from-size('700')};

    & h2 {
      @include u.headline('dark');
      color: s.from-color('quinary');
    }
  }
}
```

The nested `src/components/people.astro` component appears as:

```Astro
<div class="c-people">
  <ol>
    {people.map(({ data: { title, name, image } }) => (
      <li>
        <figure class="c-person">
          <Image
            class="c-person__image"
            src={image.src}
            alt={'Image of ' + name}
            draggable="false"
          />
          <figcaption class="c-person__details">
            <span class="c-person__name">{name}</span>
            <span>{title}</span>
          </figcaption>
        </figure>
      </li>
    ))}
  </ol>
</div>
```

The auto-grid can now be included in the `c-people` CSS component, where the ordered list acts as the grid container:

```scss
// file: src/styles/component/_people.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-people > ol {
  padding: 0;
  list-style: none;
  @include u.auto-grid($grid-gap: s.from-size('700'));
}
```

## Adding a person block

The contents of the grid items are targeted with the `c-person` CSS component:

```scss
// file: src/styles/component/_people.scss
@use '../setting' as s;
@use '../utility/mixin' as u;

.c-person {
  position: relative;
  height: 100%;

  @include u.frame;
  &::before {
    border-color: s.from-color('quaternary');
  }

  &__details {
    background: s.from-color('quaternary');
    bottom: 0.5rem;
    line-height: s.from-line-height('tight');
    left: -0.25rem;
    padding: 0.8rem;
    position: absolute;
    width: calc(100% - 0.5rem);
  }

  &__image {
    filter: grayscale(1);
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: s.$border-radius;
  }

  &__name {
    display: block;
    font-family: s.from-font-family('sans');
    font-size: s.from-size('600');
    font-weight: s.from-font-weight('bold');
  }
}
```

Both `src/layouts/about.astro` and `src/layouts/work-item.astro` use the `src/components/people-panel.astro` component which renders content targeted by the `c-people-panel`, `c-people` and `c-person` CSS components; this is reflected in their respective style sheets:

```scss
// file: src/styles/about.scss
@use 'sass:meta';

@use 'setting' as s;

@include meta.load-css('component/people-panel');
@include meta.load-css('component/people');
@include meta.load-css('component/person');

// utilities / overrides
@include meta.load-css('critical-epilog');
```

```scss
// file: src/styles/work-item.scss
@use 'sass:meta';

@use 'setting' as s;

@include meta.load-css('component/hero');
@include meta.load-css('component/facts-panel');
@include meta.load-css('component/gallery');
@include meta.load-css('component/people-panel');
@include meta.load-css('component/people');
@include meta.load-css('component/person');

// utilities / overrides
@include meta.load-css('critical-epilog');
```
