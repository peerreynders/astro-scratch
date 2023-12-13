# Astro from Scratch

Objective: Go through the [Learn Eleventy from Scratch](https://learneleventyfromscratch.com/) lessons ([MIT Licence](https://github.com/Andy-set-studio/learneleventyfromscratch.com#licence-mit-licence)) but build [the site](https://issue33.com/) with [Astro](https://docs.astro.build/en/getting-started/) instead.

## Background

Initially paid, later the lessons [were free](https://twitter.com/piccalilli_/status/1404403153890578432) and the site was [open sourced](https://piccalil.li/blog/learn-eleventy-from-scratch-is-now-open-source/).

Having completed the lessons in August 2020, I somehow got off the [11ty](https://www.11ty.dev/) track (reliance on Common JS rather than ES Modules ultimately put me off—petty, I know). Then Astro came to my attention beginning of 2022 and once I figured out what it was it seemed like the perfect package (and [then some](https://twitter.com/NFS__21/status/1517377812298342400)).

Remaking the 11ty (& [Nunjucks](https://mozilla.github.io/nunjucks/)) `issue33` site with Astro 2.x seems like an interesting way to get reacquainted with [it](https://github.com/withastro/astro/releases/tag/astro%402.0.0).

## Notes

- [What are design tokens?](https://piccalil.li/tutorial/what-are-design-tokens/)
- [I used Tailwind for the U in CUBE CSS and I liked it](https://andy-bell.co.uk/i-used-tailwind-for-the-u-in-cube-css-and-i-liked-it/)
- [Learn Eleventy From Scratch could really do with an update](https://andy-bell.co.uk/learn-eleventy-from-scratch-could-really-do-with-an-update/)

… in reverse chronological order:

---

…temporarily parked…

- [Building for static output](https://docs.astro.build/en/guides/content-collections/#building-for-static-output-default)
- [Static (SSG) Mode](https://docs.astro.build/en/core-concepts/routing/#static-ssg-mode)

---

### Lesson 29

- Create the `page` layout.
- Create the contact page contents.

[Details](docs/lessons/29.md)

---

### Lesson 21 (take two)

Rework to align with the upcoming Astro 3.0 optimized asset support.

- Collection schema updates
- Collection function updates
- `Cta.astro` component update
- `StudioFeed.astro` component update
- `Home.astro` layout update
- `blog` layout update
- `tag` layout update

[Details](docs/lessons/21-2.md)

---

### Lesson 21

- Install the [`@astrojs/image`](https://docs.astro.build/en/guides/integrations-guide/image/) integration.
- Install [sharp](https://sharp.pixelplumbing.com/) ([`@squoosh/lib`](https://www.npmjs.com/package/@squoosh/lib) is no longer actively maintained).
- Update the `tsconfig.json`.
- Update the `astro.config.mjs`.
- Create a (shim) `Image` component.
- Add a class rule to `src/styles/styles.scss`.
- Add `imageSchema` to `src/schemas.ts` and reference it where it is appropriate.
- Update the `src/content` files under `people` and `work`.
- Update the `src/layouts` `Home.astro`, `WorkLanding.astro`, `WorkItem.astro` components and the `src/components` `People.astro`, `FeaturedWork.astro` components accordingly.

[Details](docs/lessons/21.md)

---

### Lesson 20

Just used [Fontsource](https://github.com/fontsource/fontsource) instead.

```shell
npm i @fontsource/literata,
npm i @fontsource/red-hat-display
```

In `src/styles/styles.scss`:

```scss
@import '@fontsource/literata/index.css';
@import '@fontsource/literata/400-italic.css';
@import '@fontsource/literata/400.css';
@import '@fontsource/literata/900.css';
@import '@fontsource/red-hat-display/index.css';
@import '@fontsource/red-hat-display/400.css';
@import '@fontsource/red-hat-display/900.css';

/* … */
```

---

### Lesson 19

[Details](docs/lessons/19.md)

---

### Lesson 18

Don't foresee needing Gulp.

---

### Lesson 17

- Add the following key-value to the `src/pages/index.md` front matter.
- Create the `MetaInfo.astro` component.
- Add the `src/const.ts` module.
- Alter the `Base.astro` layout to use the `MetaInfo.astro` component.
- Update `Home.astro` to pick up and pass on the optional `metaTitle`, `metaDesc`, `summary` and `socialImage` props from the markdown front matter of the content page.
- Install the [@astrojs/rss](https://docs.astro.build/en/guides/rss/) package.
- Create the `src/pages/rss.xml.ts` RSS 2.0 feed page.

[Details](docs/lessons/17.md)

---

### Lesson 16

- Add the `fromWorkToStaticPaths()` and `keepSlugEntries` functions to `src/lib/collections.ts`.
- Create the `WorkItem.astro` layout.
- Create `src/pages/work/[...slug].astro`.

[Details](docs/lessons/16.md)

---

### Lesson 15

- Create `src/pages/work/index.md`.
- Create the `WorkLanding.astro` layout.

[Details](docs/lessons/15.md)

---

### Lesson 14

- Create `about-us.md`.
- Add a `fromPeople()` function.
- Create the `About.astro` layout.
- Create the `People.astro` component.

[Details](docs/lessons/14.md)

---

### Lesson 13

- Add a `fromPostRecommend()` function.
- Use the `fromPostRecommend()` function in the `Post.astro` layout and feed the selected posts into the `PostList` component in a footer.

[Details](docs/lessons/13.md)

---

### Lesson 12

- Refactor `PageHeader`, `Feed`, and `/blog` to use [slots](https://docs.astro.build/en/core-concepts/astro-components/#slots).
- Add `fromPostsToStaticPaths()` to the `src/lib/collections.ts` module.
- Introduce the `src/route-path.ts` and `src/lib/helpers.ts` support modules.
- Add the `PostArgs` type to the global types.
- Create the `Post` layout.
- Create the Post page.

[Details](docs/lessons/12.md)

---

### Lesson 11

- Add the markdown data (not to be confused with the content) for the `\blog` and `\tag` route headings.
- Add some functions to assist in the transformation of some of the [content collections](https://docs.astro.build/en/guides/content-collections/).
- Introduce a new type to pass on parameters to a `Pagination` component.
- Create the `Pagination` component.
- Create the `PagerHeader` component.
- Create the `PostList` component.
- Create the `Feed` layout.
- Create the page for the `/blog` route.
- Create the page for the `/tag` route.

[Details](docs/lessons/11.md)

---

### Lesson 10

- Add the `<div>` wrapper around the `<article>` in the `Home` layout.

[Details](docs/lessons/10.md)

---

### Lesson 9

- Define a minimal DIY `cachedFetch()` function.
- Have `studio` pass the fetch url and file paths.
- Use the `studio` wrapper in the `StudioFeed` component.
- Add the `studioFeed` `title` to the markdown front matter.
- Add the `StudioFeed` component to the `Home` layout.

[Details](docs/lessons/09.md)

---

### Lesson 8

- Define the schema for the “`work`” collection.
- Include the “`work`” collection schema in the content configuration.
- Author some helper functions for the “`work`” and “`featuredWork`” collections.
- Create the `FeaturedWork` component which sources its content from the “`featuredWork`” collection.
- Add the summary data into the markdown content front matter.
- Use the front matter data and the `FeaturedWork` component in the `Home` layout.

[Details](docs/lessons/08.md)

---

### Lesson 7

- Add the site url to the Astro configuration to make it available via `Astro.site`.
- Add a custom site configuration file to hold the site's name and use it in the `SiteHead` component.
- Add a list of anchor elements generated from a list of navigations to the `SiteHead` component.
- Define the schema for the “`cta`” collection.
- Include the “`cta`” collection schema in the content configuration.
- Author the “`global`” `CollectionEntry<'cta'>` by placing the information in markdown front matter.
- Create the `Cta` component which sources its default content from the “`global`” `CollectionEntry<'cta'>` of the “`cta`” collection.
- Add the `primaryCTA` data into the markdown content front matter.
- Use the front matter data and the `Cta` component in the `Home` layout.

[Details](docs/lessons/07.md)

---

### Lesson 6

- Author the `Brand` component to hold the SVG logo.
- Author the `SiteHead` component and nest the `Brand` component.
- Swap the `SiteHead` component into the `Home` layout compoment.

[Details](docs/lessons/06.md)

---

### Lesson 5

For the time being 11ty's [passthrough file copy](https://www.11ty.dev/docs/copy/) is largely addressed by Astro's [`public/`](https://docs.astro.build/en/core-concepts/project-structure/#public) project folder for unprocessed (by Astro's build pipeline) assets and [imports](https://docs.astro.build/en/guides/imports/) do everything else.

May have to backtrack on this if something falls through the cracks or doesn't quite fit.

---

### Lesson 4

- Expand the `Home` layout component to use the `intro` front matter data.

[Details](docs/lessons/04.md)

---

### Lesson 3

- Author the `Base` layout (Astro) component.
- Author the `Home` layout component based on the `Base` component.
- Author the markdown content to include some front matter data used by the layout.

[Details](docs/lessons/03.md)

---

### Lesson 2

Installed the «minimal» Astro template which is a “Hello World” setup.

```shell
npm create astro@latest -- --template minimal
```

---

### Lesson 1

Acquired the [starter files](https://learneleventyfromscratch.com/lesson/1.html#getting-some-starter-files) ([front end](https://piccalilli.s3.eu-west-2.amazonaws.com/eleventy-from-scratch/eleventy-from-scratch-front-end-build-starter-files.zip)).
