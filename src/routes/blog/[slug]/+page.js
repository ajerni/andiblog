import { postsStore, fetchAllPosts, getPostBySlug } from '$lib/stores/posts';

// Allow both prerendered and SPA mode
export const prerender = 'auto';

// Get all possible slug values for prerendering
export async function entries() {
  await fetchAllPosts();
  
  // Get post slugs from the store
  /** @type {Array<{id: number, slug: string}>} */
  let posts = [];
  const unsubscribe = postsStore.subscribe(state => {
    posts = state.data.posts;
  });
  unsubscribe();
  
  // Return entries for each post slug
  return posts.map(post => ({
    slug: post.slug
  }));
}

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch, depends }) {
  // This allows the page to be re-evaluated when data changes
  depends('app:posts');
  
  // Ensure posts are loaded
  await fetchAllPosts();
  
  // Get the specific post from the store
  const post = getPostBySlug(params.slug);
  
  // If post not found, this will let the page component handle it
  return {
    slug: params.slug,
    post
  };
} 