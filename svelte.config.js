import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		
		// Enable path rewriting in the browser for SPA mode
		paths: {
			relative: false,
			base: ''
		},
		
		// Handle prerendering errors
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore search param related errors on blog pages
				if ((path === '/blog' || path.startsWith('/blog/')) && message.includes('Cannot access url.searchParams')) {
					return { status: 200 };
				}
				
				// Let other errors fail the build
				throw new Error(`${message} (${path}${referrer ? ` - referrer: ${referrer}` : ''})`);
			}
		}
	}
};

export default config;
