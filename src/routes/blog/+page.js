import { fetchAllPosts } from '$lib/stores/posts';

// Allow both prerendered and SPA mode
export const prerender = 'auto';

/** @type {import('./$types').PageLoad} */
export async function load({ url, depends }) {
  // This allows the page to be re-evaluated when data changes
  depends('app:posts');
  
  // Ensure posts are loaded
  await fetchAllPosts();
  
  return {
    // Get current page from URL query parameter
    page: parseInt(url.searchParams.get('page') || '1', 10)
  };
} 