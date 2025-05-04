import { browser } from '$app/environment';
import { fetchAllPosts } from '$lib/stores/posts';

// Tell SvelteKit to prerender everything for static hosting
export const prerender = true;

// This ensures SSR is used for the prerendering
export const ssr = true;

/**
 * Load all posts when the app starts
 * On the server preload all posts for SSR
 * On the client fetch all posts for reactivity
 */
export async function load() {
  // Fetch all posts from the API - this loads them into the store
  if (browser) {
    // On client-side load, fetch data into the store
    fetchAllPosts();
  } else {
    // On server-side, we need to await the fetch to ensure data is ready for SSR
    await fetchAllPosts();
  }
  
  return {};
} 