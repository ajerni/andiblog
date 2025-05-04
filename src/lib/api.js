/**
 * API service for the blog
 * Re-exports functions from the store for backward compatibility
 */

import { fetchAllPosts, formatDate, extractDate, getPostBySlug, postsStore } from './stores/posts';

// Re-export from store
export { formatDate, extractDate };

/**
 * Fetch all blog posts - now just a wrapper around the store function
 * @param {number} [page] - Page number (unused, kept for backwards compatibility)
 * @param {number} [limit] - Number of posts per page (unused, kept for backwards compatibility)
 * @returns {Promise<Record<string, any>>} - Promise resolving to the posts data
 */
export async function fetchPosts(page, limit) {
  // Parameters are not used, but kept for backwards compatibility
  
  // Fetch all posts if not already loaded
  await fetchAllPosts();
  
  // Return data from the store
  let data = {};
  const unsubscribe = postsStore.subscribe(state => {
    data = state.data;
  });
  unsubscribe();
  
  return data;
}

/**
 * Fetch a single blog post by slug - now just gets from the store
 * @param {string} slug - The post slug
 * @returns {Promise<Record<string, any>>} - Promise resolving to the post data
 */
export async function fetchPostBySlug(slug) {
  // Fetch all posts if not already loaded
  await fetchAllPosts();
  
  // Get post from store
  const post = getPostBySlug(slug);
  
  // Return in the same format as the original API
  return {
    post: post,
    status: post ? 'success' : 'error'
  };
} 