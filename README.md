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

<details>
<summary>Getting Started</summary>

```shell
$ cd astro-scratch
$ pnpm install
Lockfile is up to date, resolution step is skipped
Packages: +496
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

Progress: resolved 496, reused 496, downloaded 0, added 496, done
node_modules/.pnpm/esbuild@0.19.8/node_modules/esbuild: Running postinstall script, done in 69ms
node_modules/.pnpm/sharp@0.33.0/node_modules/sharp: Running install script, done in 81ms
node_modules/.pnpm/sharp@0.32.6/node_modules/sharp: Running install script, done in 532ms

dependencies:
+ @astrojs/check 0.3.3
+ @astrojs/rss 4.0.1
+ astro 4.0.6
+ github-slugger 2.0.0
+ sharp 0.33.0

devDependencies:
+ @fontsource/literata 5.0.17
+ @fontsource/red-hat-display 5.0.17
+ @types/markdown-it 13.0.7
+ @types/node 20.10.0
+ @types/sanitize-html 2.9.5
+ markdown-it 13.0.2
+ prettier 3.1.0
+ prettier-plugin-astro 0.12.2
+ sanitize-html 2.11.0
+ sass 1.69.5
+ typescript 5.3.2

Done in 2s

$ pnpm run build

> astro-scratch@0.0.0 build /astro-scratch
> astro build

19:04:30 Types generated 318ms
19:04:30 [build] output: "static"
19:04:30 [build] directory: /astro-scratch/dist/
19:04:30 [build] Collecting build info...
19:04:30 [build] ✓ Completed in 333ms.
19:04:30 [build] Building static entrypoints...
19:04:33 [build] ✓ Completed in 2.84s.

 generating static routes
19:04:33 ▶ src/pages/index.md
19:04:33   └─ /index.html (+21ms)
19:04:33 ▶ src/pages/about-us.md
19:04:33   └─ /about-us/index.html (+7ms)
19:04:33 ▶ src/pages/contact.md
19:04:33   └─ /contact/index.html (+2ms)
19:04:33 λ src/pages/rss.xml.ts
19:04:33   └─ /rss.xml (+36ms)
19:04:33 ▶ src/pages/blog/post/[...slug].astro
19:04:33   ├─ /blog/post/a-complete-guide-to-wireframe-design/index.html (+5ms)
19:04:33   ├─ /blog/post/a-font-for-people-with-dyslexia/index.html (+4ms)
19:04:33   ├─ /blog/post/why-cross-cultural-design-really-matters/index.html (+4ms)
19:04:33   ├─ /blog/post/laws-of-ux/index.html (+6ms)
19:04:33   ├─ /blog/post/design-thinking-understanding-the-product-design-process/index.html (+4ms)
19:04:33   ├─ /blog/post/how-to-create-a-remote-usability-test-for-fast-actionable-insights/index.html (+4ms)
19:04:33   ├─ /blog/post/10-tips-for-website-redesign-in-2020/index.html (+4ms)
19:04:33   ├─ /blog/post/making-design-tokens-a-single-source-of-truth/index.html (+4ms)
19:04:33   ├─ /blog/post/typography-tips-for-the-web/index.html (+4ms)
19:04:33   ├─ /blog/post/how-to-test-usability-of-websites-remotely/index.html (+5ms)
19:04:33   ├─ /blog/post/color-palette-generator/index.html (+4ms)
19:04:33   └─ /blog/post/quick-and-simple-image-placeholder/index.html (+5ms)
19:04:33 ▶ src/pages/blog/[...page].astro
19:04:33   ├─ /blog/index.html (+4ms)
19:04:33   ├─ /blog/2/index.html (+3ms)
19:04:33   └─ /blog/3/index.html (+3ms)
19:04:33 ▶ src/pages/work/index.md
19:04:33   └─ /work/index.html (+3ms)
19:04:33 ▶ src/pages/work/[...slug].astro
19:04:33   ├─ /work/outgoings/index.html (+4ms)
19:04:33   ├─ /work/behind-the-scenes/index.html (+4ms)
19:04:33   ├─ /work/brunch-and-brew/index.html (+6ms)
19:04:33   ├─ /work/breakfast-club/index.html (+3ms)
19:04:33   └─ /work/travel-today/index.html (+3ms)
19:04:33 ▶ src/pages/tag/[tag].astro
19:04:33   ├─ /tag/tutorial/index.html (+2ms)
19:04:33   ├─ /tag/learning/index.html (+2ms)
19:04:33   ├─ /tag/typography/index.html (+2ms)
19:04:33   ├─ /tag/resources/index.html (+2ms)
19:04:33   ├─ /tag/culture/index.html (+1ms)
19:04:33   ├─ /tag/design-thinking/index.html (+2ms)
19:04:33   ├─ /tag/ux/index.html (+2ms)
19:04:33   ├─ /tag/testing/index.html (+2ms)
19:04:33   ├─ /tag/tips-and-tricks/index.html (+2ms)
19:04:33   ├─ /tag/design-systems/index.html (+2ms)
19:04:33   └─ /tag/tools/index.html (+1ms)
19:04:33 ✓ Completed in 248ms.

 generating optimized images
19:04:34   ▶ /_astro/toast.lIutO6IL_Z1NKDjt.webp (before: 356kB, after: 166kB) (+333ms) (1/32)
19:04:34   ▶ /_astro/notepad.ktNw2ZUg_Z2fPaN3.webp (before: 303kB, after: 13kB) (+92ms) (2/32)
19:04:34   ▶ /_astro/outgoings-hero.Wlsc-FjP_28vogo.webp (before: 143kB, after: 92kB) (+336ms) (3/32)
19:04:34   ▶ /_astro/brunch-and-brew-hero.thO5ctzO_1EDUwt.webp (before: 171kB, after: 111kB) (+430ms) (4/32)
19:04:34   ▶ /_astro/behind-the-scenes-hero.fxpS3gup_Z1Lwh0l.webp (before: 300kB, after: 285kB) (+432ms) (5/32)
19:04:34   ▶ /_astro/screens.XO1QsTKv_1lzWR7.webp (before: 804kB, after: 66kB) (+128ms) (6/32)
19:04:34   ▶ /_astro/sketching.JjuLWFNR_1nsJ1J.webp (before: 516kB, after: 38kB) (+139ms) (7/32)
19:04:34   ▶ /_astro/smiling.-yc429Nd_Z1GNXwV.webp (before: 302kB, after: 15kB) (+124ms) (8/32)
19:04:34   ▶ /_astro/social-share.Ue-paWZP_1MKkD8.webp (before: 90kB, after: 33kB) (+126ms) (9/32)
19:04:34   ▶ /_astro/studio.KnfDUw93_ZmqBLo.webp (before: 1133kB, after: 87kB) (+160ms) (10/32)
19:04:34   ▶ /_astro/table-tennis.nTJk98Ls_21JNbo.webp (before: 1034kB, after: 75kB) (+216ms) (11/32)
19:04:34   ▶ /_astro/1.8DyVJ8ID_ZOUlQA.webp (before: 239kB, after: 87kB) (+204ms) (12/32)
19:04:34   ▶ /_astro/2.SFcUG2zH_Z1l2RtH.webp (before: 189kB, after: 71kB) (+244ms) (13/32)
19:04:34   ▶ /_astro/4.7q82XlFW_Z1Dkdzs.webp (before: 144kB, after: 69kB) (+201ms) (14/32)
19:04:34   ▶ /_astro/3.xpYuojzb_Zi8EIL.webp (before: 302kB, after: 172kB) (+348ms) (15/32)
19:04:34   ▶ /_astro/6.AdWqI43V_ZlJBst.webp (before: 268kB, after: 139kB) (+246ms) (16/32)
19:04:34   ▶ /_astro/5.RJqrwHk4_2b7tNv.webp (before: 336kB, after: 239kB) (+330ms) (17/32)
19:04:34   ▶ /_astro/breakfast-club-hero.tSYQJP6i_Z1hpLPE.webp (before: 117kB, after: 98kB) (+289ms) (18/32)
19:04:34   ▶ /_astro/outgoings-gallery-2.knf9RTL__Z1628HV.webp (before: 45kB, after: 30kB) (+119ms) (19/32)
19:04:35   ▶ /_astro/outgoings-gallery-1._sXtgECD_17NNpU.webp (before: 45kB, after: 31kB) (+225ms) (20/32)
19:04:35   ▶ /_astro/outgoings-gallery-3.vBElM6Sy_S0IyV.webp (before: 49kB, after: 31kB) (+176ms) (21/32)
19:04:35   ▶ /_astro/behind-the-scenes-gallery-1.LR8mkV_z_USKyQ.webp (before: 74kB, after: 68kB) (+202ms) (22/32)
19:04:35   ▶ /_astro/behind-the-scenes-gallery-3.AUr406Gs_ZUtHAI.webp (before: 161kB, after: 154kB) (+223ms) (23/32)
19:04:35   ▶ /_astro/brunch-and-brew-gallery-1.2Nm8JBrf_26mUPL.webp (before: 44kB, after: 29kB) (+140ms) (24/32)
19:04:35   ▶ /_astro/brunch-and-brew-gallery-2.WzaPO1XS_NE7JS.webp (before: 67kB, after: 48kB) (+176ms) (25/32)
19:04:35   ▶ /_astro/brunch-and-brew-gallery-3.650rTWoi_Z1aTtAo.webp (before: 35kB, after: 22kB) (+137ms) (26/32)
19:04:35   ▶ /_astro/breakfast-club-gallery-2.Han_ZTaV_aQivE.webp (before: 39kB, after: 31kB) (+135ms) (27/32)
19:04:35   ▶ /_astro/breakfast-club-gallery-3.9mvE0-Gv_avLEv.webp (before: 59kB, after: 49kB) (+104ms) (28/32)
19:04:35   ▶ /_astro/breakfast-club-gallery-1.CIxdI5Bp_hX6jj.webp (before: 81kB, after: 65kB) (+175ms) (29/32)
19:04:35   ▶ /_astro/travel-today-hero.uK17OT4f_Z2kG9df.webp (before: 358kB, after: 283kB) (+684ms) (30/32)
19:04:35   ▶ /_astro/travel-today-gallery-1.IAooTzJY_Ze9ceN.webp (before: 89kB, after: 63kB) (+193ms) (31/32)
19:04:35   ▶ /_astro/travel-today-gallery-2.Vud2a_MU_22VP8E.webp (before: 74kB, after: 49kB) (+153ms) (32/32)
19:04:35 ✓ Completed in 1.60s.

19:04:35 [build] 35 page(s) built in 5.05s
19:04:35 [build] Complete!
$ pnpm run preview

> astro-scratch@0.0.0 preview /astro-scratch
> astro preview

 astro  v4.0.6 ready in 19 ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose
```

</details>

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
