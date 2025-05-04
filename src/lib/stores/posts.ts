import { writable } from 'svelte/store';

// Types for the blog post API
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  published_date: string;
  updated_date: string;
  tags: string[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface PostsData {
  posts: Post[];
  pagination: Pagination;
  timestamp?: number;
  status?: string;
}

export interface ApiResponse {
  post?: Post;
  status?: string;
}

// Initialize the store with a loading state and empty data
interface PostsStore {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  data: PostsData;
}

const initialState: PostsStore = {
  isLoaded: false,
  isLoading: false,
  error: null,
  data: {
    posts: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      lastPage: 1
    }
  }
};

// Create the writable store
export const postsStore = writable<PostsStore>(initialState);

// API URL for fetching posts
const API_URL = 'https://phpapi.andierni.ch/api';

// Keep track of fetch promises to prevent multiple simultaneous calls
let fetchPromise: Promise<void> | null = null;

/**
 * Fetch all posts from the API and update the store
 */
export async function fetchAllPosts(): Promise<void> {
  // If we have an existing fetch in progress, return that promise
  if (fetchPromise) return fetchPromise;
  
  // Get current state first
  let currentState: PostsStore;
  const unsubscribe = postsStore.subscribe(state => {
    currentState = state;
  });
  unsubscribe();
  
  // If already loaded and not in an error state, just return
  if (currentState!.isLoaded && !currentState!.error) {
    return Promise.resolve();
  }
  
  // Set loading state
  postsStore.update(state => ({ ...state, isLoading: true }));

  // Create the fetch promise
  fetchPromise = new Promise(async (resolve) => {
    try {
      // Request 100 posts to make sure we get all of them
      const response = await fetch(`${API_URL}/posts?limit=100&_=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: PostsData = await response.json();
      
      postsStore.update(state => ({
        ...state,
        isLoaded: true,
        isLoading: false,
        error: null,
        data
      }));

      console.log('Loaded posts count:', data.posts.length);
      resolve();
    } catch (error) {
      console.error('Error fetching posts:', error);
      postsStore.update(state => ({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
      resolve();
    } finally {
      // Clear the promise when done
      fetchPromise = null;
    }
  });
  
  return fetchPromise;
}

/**
 * Get a post by slug from the store
 * @param slug - The post slug to find
 * @returns The post or null if not found
 */
export function getPostBySlug(slug: string): Post | null {
  let post: Post | null = null;
  
  const unsubscribe = postsStore.subscribe(state => {
    post = state.data.posts.find(p => p.slug === slug) || null;
  });
  unsubscribe();
  
  return post;
}

/**
 * Format a date string
 * @param dateString - ISO date string
 * @returns Formatted date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Extract the date part from a datetime string
 * @param datetimeString - Datetime string
 * @returns Date part (YYYY-MM-DD)
 */
export function extractDate(datetimeString: string): string {
  return datetimeString.split(' ')[0];
} 