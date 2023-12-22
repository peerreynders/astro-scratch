# Astro from Scratch

Objective: Go through the [Learn Eleventy from Scratch](https://learneleventyfromscratch.com/) lessons ([MIT Licence](https://github.com/Andy-set-studio/learneleventyfromscratch.com#licence-mit-licence)) but build [the site](https://issue33.com/) with [Astro](https://docs.astro.build/en/getting-started/) instead.

## Background

Initially paid, later the lessons [were free](https://twitter.com/piccalilli_/status/1404403153890578432) and the site was [open sourced](https://piccalil.li/blog/learn-eleventy-from-scratch-is-now-open-source/).

Having completed the lessons in August 2020, I somehow got off the [11ty](https://www.11ty.dev/) track (reliance on Common JS rather than ES Modules ultimately put me off—petty, I know). Then Astro came to my attention beginning of 2022 and once I figured out what it was it seemed like the perfect package (and [then some](https://twitter.com/NFS__21/status/1517377812298342400)).

> If you choose a Hugo or an 11ty or something like that you hit this wall if you need anything dynamic.
>
> The web is _mostly_ static content and I think Astro saw really high potential as many websites are almost entirely static content.
> But there's a little bit that's not, a newsletter opt in, a like button, where something dynamic needs to happen.
>
> And if you're doing it in one of the other traditional static site generators, it puts you in this boat where you're on your own; you got to roll it yourself.
> You're completely in charge of managing all of your client side interaction because those static site generators have a clear stance—that's not what they do.
> And that's what makes them powerful as they have a very clear scope and they stick to it. And I love that for those types of sites.
>
> But as we get into more modern marketing sites and stuff, you're almost never going to hit that point where you don't need _anything_ dynamic.
>
> So Astro was very smart.

— Jason Lengstorf: [Why I'll choose Astro (almost) every time in 2024](https://youtu.be/kssIEqSJeMI?t=46)

Remaking the 11ty (& [Nunjucks](https://mozilla.github.io/nunjucks/)) `issue33` site with Astro [2.x](https://github.com/withastro/astro/releases/tag/astro%402.0.0) (then [3.x](https://github.com/withastro/astro/releases/tag/astro%403.0.0) and [4.x](https://github.com/withastro/astro/releases/tag/astro%404.0.0)) seemed like an interesting way to get reacquainted with it.

## Notes

The previous `README` can be found [here](docs/v00/README.md).

I'd recommend to look at [Lesson 8: Creating our first collection](#lesson-8-creating-our-first-collection) and [Lesson 21: Setting up images](#lesson-21-setting-up-images) at the earliest point where it makes sense to.

---

### Lesson 1: [Intro](https://learneleventyfromscratch.com/lesson/1.html)

Starter files:

- [Markdown and template files](https://piccalilli.s3.eu-west-2.amazonaws.com/eleventy-from-scratch/eleventy-from-scratch-starter-files.zip)
- [`*.scss` files](https://piccalilli.s3.eu-west-2.amazonaws.com/eleventy-from-scratch/eleventy-from-scratch-front-end-build-starter-files.zip)
- [Social media images](https://piccalilli.s3.eu-west-2.amazonaws.com/eleventy-from-scratch/eleventy-from-scratch-meta-images.zip)
- The [demo site](https://issue33.com/) being implemented
- `reference/issue33.zip` holds the files to run the demo site locally at port `3551` for comparison and inspection.

---

### Lesson 2: [Hello world](https://learneleventyfromscratch.com/lesson/2.html)

[Start](https://docs.astro.build/en/install/auto/) with the «minimal» Astro template which is a “Hello World” setup:

```shell
pnpm create astro@latest -- --template minimal
```

To start the development server:

```shell
pnpm run dev
```

---

### Lesson 3: [Nunjucks basics](https://learneleventyfromscratch.com/lesson/3.html)

Astro uses [Astro syntax](https://docs.astro.build/en/core-concepts/astro-syntax/) for the rendered portion of [Astro components](https://docs.astro.build/en/core-concepts/astro-components/#the-component-template) (in contrast to [framework components](https://docs.astro.build/en/core-concepts/framework-components/)) which take on the role of static page/ static partial /server side templates .

- [Getting started](docs/03/index.md#getting-started)
- [Assigning our template to our page](docs/03/index.md#assigning-our-template-to-our-page)

---

### Lesson 4: [Front matter basics](https://learneleventyfromscratch.com/lesson/4.html)

- [Adding Front Matter to our home page](docs/04/index.md#adding-front-matter-to-our-home-page)

---

### Lesson 5: [Passthrough basics](https://learneleventyfromscratch.com/lesson/5.html)

In Astro unprocessed static contents is placed in the [`/public`](https://docs.astro.build/en/core-concepts/project-structure/#public) directory. Astro has it's own [`<Image />`](https://docs.astro.build/en/guides/images/#image--astroassets) component which will optimize images stored under `/src/` but they have to be [imported](https://docs.astro.build/en/guides/imports/) by the component (see also: [Dynamically import images](https://docs.astro.build/en/recipes/dynamically-importing-images)).

So Astro really doesn't have a use case for [Eleventy's passthrough file copy](https://www.11ty.dev/docs/copy/).

For the time being images can be placed under `/public/images` but in [lesson 21](#lesson-21-setting-up-images) images are moved under `/src/assets` for optimization through the [image service](https://docs.astro.build/en/guides/images/#default-image-service).

---

### Lesson 6: [Partials basics](https://learneleventyfromscratch.com/lesson/6.html)

- [Adding our site header](docs/06/index.md#adding-our-site-header)

---

### Lesson 7: [Data basics](https://learneleventyfromscratch.com/lesson/7.html)

- [Wiring up our navigation](docs/07/index.md#wiring-up-our-navigation)
- [Cascading data](docs/07/index.md#cascading-data)

---

### Lesson 8: [Creating our first collection](https://learneleventyfromscratch.com/lesson/8.html)

- [Creating our first collection](docs/08/index.md#creating-our-first-collection)
- [Rendering our featured work partial](docs/08/index.md#rendering-our-featured-work-partial)

---

### Lesson 9: [Adding remote data](https://learneleventyfromscratch.com/lesson/9.html)

- [Rendering our new data](docs/09/index.md#rendering-our-new-data)

---

### Lesson 10: [Home page complete and recap](https://learneleventyfromscratch.com/lesson/10.html)

- [Complete home page](docs/10/index.md#complete-home-page)

---

### Lesson 11: [Blog feeds, tags and pagination](https://learneleventyfromscratch.com/lesson/11.html)

- [Blog post view, directory data and filters](docs/11/index.md#our-blog-data)
- [Creating our feeds](docs/11/index.md#creating-our-feeds)
- [Creating our feed](docs/11/index.md#creating-our-feed)
- [Wiring up our data](docs/11/index.md#wiring-up-our-data)
- [Tag feeds](docs/11/index.md#tags-feeds)

---

### Lesson 12: [Blog post view, directory data and filters](https://learneleventyfromscratch.com/lesson/12.html)

- [Creating our blog post layout](docs/12/index.md#creating-our-blog-post-layout)
- [Filters](docs/12/index.md#filters)
- [Default layout and permalinks](docs/12/index.md#default-layout-and-permalinks)

---

### Lesson 13: [Recommended content](https://learneleventyfromscratch.com/lesson/13.html)

- [Adding our helper](docs/13/index.md#adding-our-helper)
- [Implementing our recommended content](docs/13/index.md#implementing-our-recommended-content)

---

### Lesson 14: [Adding our about page](https://learneleventyfromscratch.com/lesson/14.html)

- [Add an about page](docs/14/index.md#add-about-page-layout)
- [Create a people partial](docs/14/index.md#create-a-people-partial)
- [Create a people collection](docs/14/index.md#create-a-people-collection)
- [Add an about page](docs/14/index.md#add-an-about-page)

---

### Lesson 15: [Adding our work landing page](https://learneleventyfromscratch.com/lesson/15.html)

- [Add a work landing layout](docs/15/index.md#add-a-work-landing-layout)

---

### Lesson 16: [Creating a work item page](https://learneleventyfromscratch.com/lesson/16.html)

- [Adding our template](docs/16/index.md#adding-our-template)
- [Adding related content](16/index.md#adding-related-content)
- [Assigning our layout to our work items](docs/16/index.md#assigning-our-layout-to-our-work-items)

---

### Lesson 17: [Meta info, RSS feeds and module recap](https://learneleventyfromscratch.com/lesson/17.html)

- [Adding meta info](docs/17/index.md#adding-meta-info)
- [Adding an RSS feed](docs/17/index.md#adding-an-rss-feed)
- [Adding the RSS meta tag](docs/17/index.md#adding-the-rss-meta-tag)

---

### Lesson 18: [Setting up Gulp](https://learneleventyfromscratch.com/lesson/18.html)

The original course installed [gulp.js](https://gulpjs.com/) to automate/integrate beyond the capabilities of the [Sass command-line interface](https://sass-lang.com/documentation/cli/dart-sass/). As Astro does everything we need to do, gulp.js isn't necessary.

---

### Lesson 19: [Setting up Sass](https://learneleventyfromscratch.com/lesson/19.html)

- [Critical CSS](docs/19/index.md#critical-css)
- [Getting the CSS on the page](docs/19/index.md#getting-the-css-on-the-page)

---

### Lesson 20: [Setting up fonts](https://learneleventyfromscratch.com/lesson/20.html)

- [Adding fonts](docs/20/index.md#adding-fonts)

---

### Lesson 21: [Setting up images](https://learneleventyfromscratch.com/lesson/21.html)

- [Fundamentals](docs/21/index.md#fundamentals)
- [Case: Work item layout](docs/21/index.md#case-work-item-layout)
- [Case: Studio feed component](docs/21/index.md#case-studio-feed-component)

---

### Lesson 22: [Global CSS and design tokens](https://learneleventyfromscratch.com/lesson/22.html)

This lesson uses [CUBE](https://cube.fyi/) and [Gorko](https://github.com/Andy-set-studio/gorko). Here a slightly different approach was taken. For more details see:

- [CSS Architecture](docs/css-architecture/index.md)

---

### Lesson 23: [Styling global blocks](https://learneleventyfromscratch.com/lesson/23.html)

- [Styling the site header and navigation](docs/23/index.md#styling-the-site-header-and-navigation)
- [Styling the navigation](docs/23/index.md#styling-the-navigation)
- [Styling the site footer](docs/23/index.md#styling-the-site-footer)
- [Wiring it all up](docs/23/index.md#wiring-it-all-up)

---

### Lesson 24: [Styling the skip link](https://learneleventyfromscratch.com/lesson/24.html)

- [Styling our site’s buttons](docs/24/index.md#styling-our-sites-buttons)
- [Styling the skip link](docs/24/index.md#styling-the-skip-link)
- [Wiring it all up](docs/24/index.md#wiring-it-all-up)

---

### Lesson 25: [Home page intro](https://learneleventyfromscratch.com/lesson/25.html)

- [Wiring up our block and critical CSS](docs/25/index.md#wiring-up-our-block-and-critical-css)

---

### Lesson 26: [Home page panels](https://learneleventyfromscratch.com/lesson/26.html)

- [Call to action block](docs/26/index.md#call-to-action-block)
- [Headline utility](docs/26/index.md#headline-utility)
- [Adding our CSS to critical CSS](docs/26/index.md#adding-our-css-to-critical-css)
- [Featured work feed](docs/26/index.md#featured-work-feed)
- [Studio feed](docs/26/index.md#studio-feed)

---

### Lesson 27: [Styling the blog](https://learneleventyfromscratch.com/lesson/27.html)

- [Creating a page header block](docs/27/index.md#creating-a-page-header-block)
- [Creating a post list block](docs/27/index.md#creating-a-post-list-block)
- [Creating a pagination block](docs/27/index.md#creating-a-pagination-block)
- [Styling our blog posts](docs/27/index.md#styling-our-blog-posts)

---

### Lesson 28: [Styling the about page](https://learneleventyfromscratch.com/lesson/28.html)

- [Adding an auto-grid utility](docs/28/index.md#adding-an-auto-grid-utility)
- [Adding a people block](docs/28/index.md#adding-a-people-block)
- [Adding a person block](docs/28/index.md#adding-a-person-block)

---

### Lesson 29: [Add a contact page](https://learneleventyfromscratch.com/lesson/29.html)

- [Adding the template](docs/29/index.md#adding-the-template)

---

### Lesson 30: [Styling the work section](https://learneleventyfromscratch.com/lesson/30.html)

- [Styling the work page](docs/30/index.md#styling-the-work-page)
- [Styling work items](docs/30/index.md#styling-work-items)

---

### Lesson 31: [Wrapping up](https://learneleventyfromscratch.com/lesson/31.html)

- [Adding a social image and favicon](docs/31/index.md#adding-a-social-image-and-favicon)
- [Minifying HTML output](docs/31/index.md#minifying-html-output)
- [Netlify config](docs/31/index.md#netlify-config)
- [Production build](docs/31/index.md#production-build)
