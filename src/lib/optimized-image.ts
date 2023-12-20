// file src/lib/optimized-image.ts
import { getImage } from 'astro:assets';

type ImageTransform = Omit<Parameters<typeof getImage>[0], 'src'> & {
	src: string;
};

type DynamicImageMetadata = () => Promise<{ default: ImageMetadata }>;

const images = import.meta.glob('/src/assets/**/*.{jpeg,jpg,png,gif}');

function fromImage(imageTransform: ImageTransform) {
	const path = imageTransform.src;
	const image = images[path];
	if (typeof image !== 'function')
		throw new Error(
			`'${path}' cannot be found among: \n${Object.keys(images).join('\n')}`
		);

	return getImage({
		...imageTransform,
		src: (image as DynamicImageMetadata)(),
	});
}

export { fromImage };
