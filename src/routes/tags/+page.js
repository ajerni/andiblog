import { fetchAllPosts } from '$lib/stores/posts';

// Use auto prerendering mode
export const prerender = 'auto';

/**
 * Load function ensures posts data is available
 * @type {import('./$types').PageLoad}
 */
export async function load() {
  console.log('Tags page load function called');
  
  try {
    // Ensure posts are loaded from the central store
    await fetchAllPosts();
  } catch (error) {
    console.error('Error loading posts for tags page:', error);
  }
  
  return {};
} 