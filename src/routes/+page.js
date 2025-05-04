import { fetchAllPosts } from '$lib/stores/posts';

export async function load() {
  await fetchAllPosts();
  
  return {
    meta: {
      title: 'Andi\'s blog - Home',
      description: 'Welcome to Andi\'s blog - a modern blog about web development, tech and more'
    }
  };
} 