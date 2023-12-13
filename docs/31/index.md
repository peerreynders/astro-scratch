# Lesson 31: Wrapping Up

## Adding a social image and favicon

[Original assets](https://piccalilli.s3.eu-west-2.amazonaws.com/eleventy-from-scratch/eleventy-from-scratch-meta-images.zip)

Copy `meta/social-share.png` to `src/assets/meta/social-share.png` and `meta/favicon.svg` to `public/favicon.svg` (there is no need to optimize SVGs).

Add the `optimized-image.ts` module to `src/lib`:

```TypeScript
// file src/lib/optimized-image.ts
import { getImage } from 'astro:assets';

type ImageTransform = Omit<Parameters<typeof getImage>[0], 'src'> & {
  src: string;
};

const images = import.meta.glob('/src/assets/**/*.{jpeg,jpg,png,gif}');

function fromImage(imageTransform: ImageTransform) {
  const path = imageTransform.src;
  const image = images[path];
  if (typeof image !== 'function')
    throw new Error(
      `'${path}' cannot be found among: \n${Object.keys(images).join('\n')}`
    );

  return getImage({ ...imageTransform, src: image() });
}

export { fromImage };
```

The Vite [glob import](https://vitejs.dev/guide/features#glob-import) is used to prepare any image under `src/assets` for dynamic import. `fromImage()` performs the optimization if it can find the specified image path among thoses in `images` with any requested [options](https://docs.astro.build/en/guides/images/#properties). `fromImage()` returns a [`Promise<GetImageResult>`](https://docs.astro.build/en/guides/images/#generating-images-with-getimage)

Now modify the frontmatter of `src/components/meta-info.astro`:

```TypeScript
// file: src/components/meta-info.astro
import { fromImage } from '../lib/optimized-image'

interface Props {
  args: {
    siteName: string;
    title: string;
    metaTitle?: string;
    metaDesc?: string;
    summary?: string;
    socialImage?: string;
  };
}

const { args } = Astro.props;

const pageTitle = args.metaTitle
  ? args.metaTitle
  : args.siteName === args.title
  ? args.siteName
  : `${args.title} - ${args.siteName}`;
const metaDesc = args.metaDesc ? args.metaDesc : args.summary;
const { siteName, socialImage: maybePath } = args;
const socialImage =
  typeof maybePath === 'string' ?
    maybePath :
    (await fromImage({src: '/src/assets/meta/social-share.png'})).src;
const currentUrl = Astro.url;
```

Now every page should have a social image regardless whether it specifies on via props.

To the end of `src/components/meta-info.astro` append:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

For more background see: [`getImage()`](https://docs.astro.build/en/guides/images/#generating-images-with-getimage), [Dynamically import images](https://docs.astro.build/en/recipes/dynamically-importing-images).

## Minifying HTML output

Astro compresses the HTML output by default. See [`compressHTML`](https://docs.astro.build/en/reference/configuration-reference/#compresshtml).

## Netlify config

Deploying to Netlify requires the [`@astrojs/netlify`](https://docs.astro.build/en/guides/integrations-guide/netlify) integration:

- Astro Docs: [Deploy your Astro Site to Netlify](https://docs.astro.build/en/guides/deploy/netlify)
- Netlify Docs: [Astro on Netlify](https://docs.netlify.com/integrations/frameworks/astro/)

## Production build

- [`astro build`](https://docs.astro.build/en/reference/cli-reference/#astro-build) builds the production site
- [`astro preview`](https://docs.astro.build/en/reference/cli-reference/#astro-preview) previews the production site after it is built.
