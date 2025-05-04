import { fetchAllPosts } from '$lib/stores/posts';
import { dev } from '$app/environment';

// Disable prerendering for the blog page with query params
export const prerender = false;

// Enable SPA navigation for this route
export const ssr = dev;

/** @type {import('./$types').PageLoad} */
export async function load({ url, depends }) {
  // This allows the page to be re-evaluated when data changes
  depends('app:posts');
  
  // Ensure posts are loaded
  await fetchAllPosts();
  
  // Get the page query parameter or default to page 1
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  
  return { page };
} 