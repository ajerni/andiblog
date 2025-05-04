import { fetchAllPosts } from '$lib/stores/posts';

/** @type {import('./$types').PageLoad} */
export async function load() {
  // Just ensure posts are loaded
  await fetchAllPosts();
  
  return {
    meta: {
      title: 'All Posts - Andi\'s blog',
      description: 'Browse all blog posts about web development, tech and more'
    }
  };
} 