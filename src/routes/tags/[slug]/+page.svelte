<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { postsStore, fetchAllPosts } from '$lib/stores/posts';
  import PostCard from '$lib/components/PostCard.svelte';
  
  // Get the tag slug from the URL params and data
  export let data: { slug: string };
  
  // Use the decoded tag from the +page.js load function
  $: decodedTag = data.slug;
  
  // Initialize loading state
  let isLoading = true;
  
  // Ensure posts are loaded
  onMount(async () => {
    console.log("Tag detail page mounted for tag:", decodedTag);
    if (!$postsStore.isLoaded && !$postsStore.isLoading) {
      try {
        await fetchAllPosts();
      } catch (error) {
        console.error('Error loading posts in tag page:', error);
      }
    }
    isLoading = false;
    
    console.log("Store state:", {
      isLoaded: $postsStore.isLoaded,
      isLoading: $postsStore.isLoading,
      postCount: $postsStore.data.posts.length
    });
  });
  
  // Filter posts by the specified tag
  $: {
    if (decodedTag) {
      console.log("Filtering posts for tag:", decodedTag);
    }
  }
  
  $: filteredPosts = $postsStore.data.posts.filter(post => 
    post.tags && Array.isArray(post.tags) && post.tags.includes(decodedTag)
  );
  
  $: if (filteredPosts.length > 0) {
    console.log(`Found ${filteredPosts.length} posts with tag "${decodedTag}"`);
  }
  
  // Pagination
  let postsPerPage = 6;
  let totalPages = 1;
  
  // Track current page from URL
  $: currentPage = parseInt($page.url.searchParams.get('page') || '1', 10);
  
  // Calculate total pages based on filtered posts
  $: {
    if (filteredPosts.length > 0) {
      totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    }
  }
  
  // Get current posts for pagination
  $: paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  
  // Create an array of page numbers for pagination
  $: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Handle page change
  function changePage(newPage: number): void {
    if (newPage < 1 || newPage > totalPages) return;
    goto(`/tags/${encodeURIComponent(decodedTag)}?page=${newPage}`);
  }
</script>

<svelte:head>
  <title>Posts tagged with {decodedTag} - Andi's blog</title>
  <meta name="description" content="Browse posts tagged with {decodedTag} on Andi's blog" />
</svelte:head>

<section class="container">
  <div class="header-container">
    <div class="nav-links">
      <a href="/blog" class="back-link">← Blog</a>
      <a href="/tags" class="back-link">All Tags</a>
    </div>
    <h1 class="title">Posts tagged with <span class="tag-highlight">{decodedTag}</span></h1>
  </div>
  
  {#if $postsStore.error}
    <div class="error-container">
      <p class="error-message">Error loading posts: {$postsStore.error}</p>
      <button on:click={() => window.location.reload()}>Retry</button>
    </div>
  {:else if isLoading || $postsStore.isLoading}
    <div class="loading">
      <p>Loading posts...</p>
    </div>
  {:else if filteredPosts.length === 0}
    <div class="empty-container">
      <p>No posts found with tag: {decodedTag}</p>
      <a href="/tags" class="view-all-button">View All Tags</a>
    </div>
  {:else}
    <div class="posts-count">
      <p>Found {filteredPosts.length} posts</p>
    </div>
    
    <div class="posts-grid">
      {#each paginatedPosts as post (post.id)}
        <div class="post-item">
          <PostCard {post} />
        </div>
      {/each}
    </div>
    
    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="pagination">
        <button 
          class="pagination-button" 
          disabled={currentPage === 1}
          on:click={() => changePage(currentPage - 1)}
        >
          Previous
        </button>
        
        <div class="page-numbers">
          {#each pageNumbers as pageNum}
            <button 
              class="page-number {currentPage === pageNum ? 'active' : ''}"
              on:click={() => changePage(pageNum)}
            >
              {pageNum}
            </button>
          {/each}
        </div>
        
        <button 
          class="pagination-button" 
          disabled={currentPage === totalPages}
          on:click={() => changePage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    {/if}
  {/if}
</section>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .header-container {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .nav-links {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .back-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  
  .back-link:hover {
    color: var(--primary-color-dark);
  }
  
  .title {
    font-size: 2rem;
    margin: 0;
    color: var(--text-color);
  }
  
  .tag-highlight {
    color: var(--primary-color);
  }
  
  .posts-count {
    margin-bottom: 1.5rem;
    color: var(--nav-text-color);
  }
  
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .post-item {
    height: 100%;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    gap: 1rem;
  }
  
  .pagination-button {
    background-color: var(--card-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-button:not(:disabled):hover {
    background-color: var(--primary-color);
    color: white;
  }
  
  .page-numbers {
    display: flex;
    gap: 0.5rem;
  }
  
  .page-number {
    background-color: var(--card-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .page-number:hover {
    background-color: var(--primary-color-light);
  }
  
  .page-number.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  
  .loading, .error-container, .empty-container {
    text-align: center;
    padding: 2rem;
  }
  
  .view-all-button {
    display: inline-block;
    margin-top: 1rem;
    background-color: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.25rem;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .view-all-button:hover {
    background-color: var(--primary-color-dark);
  }
  
  @media (max-width: 768px) {
    .posts-grid {
      grid-template-columns: 1fr;
    }
    
    .page-numbers {
      display: none;
    }
  }
</style> 