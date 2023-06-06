// file: astro.config.mjs

import { defineConfig } from 'astro/config';

import image from '@astrojs/image';

// https://astro.build/config
export default defineConfig({
	site: 'https://issue33.com',
	integrations: [
		image({
			serviceEntryPoint: '@astrojs/image/sharp',
		}),
	],
});
