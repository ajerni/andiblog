/**
 * API service for the blog
 */

const API_URL = 'https://phpapi.andierni.ch/api';

/**
 * Fetch all blog posts
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of posts per page (default: 10)
 * @returns {Promise<Object>} - Promise resolving to the posts data
 */
export async function fetchPosts(page = 1, limit = 10) {
  try {
    const response = await fetch(`${API_URL}/posts?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

/**
 * Fetch a single blog post by slug
 * @param {string} slug - The post slug
 * @returns {Promise<Object>} - Promise resolving to the post data
 */
export async function fetchPostBySlug(slug) {
  try {
    const response = await fetch(`${API_URL}/posts/${slug}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    throw error;
  }
}

/**
 * Format a date string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Extract the date part from a datetime string
 * @param {string} datetimeString - Datetime string
 * @returns {string} - Date part (YYYY-MM-DD)
 */
export function extractDate(datetimeString) {
  return datetimeString.split(' ')[0];
} 