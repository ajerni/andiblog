import { browser } from '$app/environment';
import { fetchAllPosts } from '$lib/stores/posts';

// Allow both prerendered and SPA mode
export const prerender = 'auto';

// This ensures SSR is used for the prerendering
export const ssr = true;

// Enable client-side routing
export const csr = true;

/**
 * Load all posts when the app starts
 * On the server preload all posts for SSR
 * On the client fetch all posts for reactivity
 */
export async function load({ depends }) {
  // Mark dependency for reactivity
  depends('app:posts');

  // Fetch all posts from the API - this loads them into the store
  if (browser) {
    // On client-side load, fetch data into the store
    fetchAllPosts().catch(error => {
      console.error('Error fetching posts in layout:', error);
    });
  } else {
    // On server-side, we need to await the fetch to ensure data is ready for SSR
    await fetchAllPosts();
  }
  
  return {};
} 