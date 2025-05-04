import { postsStore, fetchAllPosts, getPostBySlug } from '$lib/stores/posts';

// Allow both prerendered and SPA mode
export const prerender = 'auto';

// Get all possible slug values for prerendering
export async function entries() {
  try {
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
  } catch (error) {
    console.error('Error fetching posts for entries:', error);
    return [];
  }
}

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch, depends }) {
  // This allows the page to be re-evaluated when data changes
  depends('app:posts');
  
  try {
    // Ensure posts are loaded
    await fetchAllPosts();
    
    // Get the specific post from the store
    const post = getPostBySlug(params.slug);
    
    // If post not found, this will let the page component handle it
    return {
      slug: params.slug,
      post
    };
  } catch (error) {
    console.error('Error loading post:', error);
    // Return the slug so the component can try to load the post on the client
    return {
      slug: params.slug,
      post: null
    };
  }
} 