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

---

### Lesson 22: [Global CSS and design tokens](https://learneleventyfromscratch.com/lesson/22.html)

This lesson uses [CUBE](https://cube.fyi/) and [Gorko](https://github.com/Andy-set-studio/gorko). Here a slightly different approach was taken. For more details see [CSS Architecture](docs/css-architecture/index.md).
