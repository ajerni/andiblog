import { fetchAllPosts } from '$lib/stores/posts';

// Allow prerendering
export const prerender = true;

/**
 * Load function ensures posts data is available and passes slug param
 * @type {import('./$types').PageLoad}
 */
export async function load({ params }) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  
  console.log('Tag detail page load function called for tag:', decodedSlug);
  
  try {
    // Ensure posts are loaded from the central store
    await fetchAllPosts();
  } catch (error) {
    console.error('Error loading posts for tag detail page:', error);
  }
  
  return {
    slug: decodedSlug
  };
} 