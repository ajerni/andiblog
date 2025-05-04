import { postsStore, fetchAllPosts } from '$lib/stores/posts';

// Explicitly set these routes to be prerendered
export const prerender = true;

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
export function load({ params }) {
  return {
    slug: params.slug
  };
} 