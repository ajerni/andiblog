<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { postsStore } from '$lib/stores/posts';
  import PostCard from '$lib/components/PostCard.svelte';
  
  // Change to 6 posts per page as requested
  let postsPerPage = 6;
  let totalPages = 1;
  
  // Track current URL and determine current page
  $: currentPage = parseInt($page.url.searchParams.get('page') || '1', 10);
  
  $: {
    // Calculate total pages based on posts length
    if ($postsStore.data.posts.length > 0) {
      totalPages = Math.ceil($postsStore.data.posts.length / postsPerPage);
    }
  }
  
  // Get current posts for pagination based on page number from URL
  $: paginatedPosts = $postsStore.data.posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  
  // Create an array of page numbers for pagination
  $: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Debug info
  $: console.log('Current page from URL:', currentPage, 'Total pages:', totalPages, 'Post count:', $postsStore.data.posts.length, 'Posts shown:', paginatedPosts.length);
  
  // Handle page change using goto
  function changePage(newPage: number): void {
    if (newPage < 1 || newPage > totalPages) return;
    goto(`/blog?page=${newPage}`);
  }
</script>

<svelte:head>
  <title>All Posts - Andi's blog</title>
  <meta name="description" content="Browse all blog posts about web development, tech and more" />
</svelte:head>

<section class="hero">
  <h1 class="title">All Posts</h1>
</section>

{#if $postsStore.error}
  <div class="error-container">
    <p class="error-message">Error loading posts: {$postsStore.error}</p>
    <button on:click={() => window.location.reload()}>Retry</button>
  </div>
{:else if $postsStore.isLoading && $postsStore.data.posts.length === 0}
  <div class="loading">
    <p>Loading posts...</p>
  </div>
{:else}
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
      <a 
        href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : null}
        class="page-link {currentPage === 1 ? 'disabled' : ''}"
        on:click|preventDefault={() => currentPage > 1 && changePage(currentPage - 1)}
      >
        Previous
      </a>
      
      {#each pageNumbers as pageNum}
        <a 
          href={`/blog?page=${pageNum}`}
          class="page-link page-number {currentPage === pageNum ? 'active' : ''}"
          on:click|preventDefault={() => changePage(pageNum)}
        >
          {pageNum}
        </a>
      {/each}
      
      <a 
        href={currentPage < totalPages ? `/blog?page=${currentPage + 1}` : null}
        class="page-link {currentPage === totalPages ? 'disabled' : ''}"
        on:click|preventDefault={() => currentPage < totalPages && changePage(currentPage + 1)}
      >
        Next
      </a>
    </div>
  {/if}
{/if}

<style>
  .hero {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--primary-color);
  }
  
  .title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-color);
    transition: color 0.3s ease;
  }
  

  
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .post-item {
    display: flex;
    height: 100%;
  }
  
  .loading, .error-container {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--nav-text-color);
  }
  
  .error-message {
    color: #e53e3e;
    margin-bottom: 1rem;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin: 2rem 0 3rem;
  }
  
  .page-link {
    padding: 0.5rem 1rem;
    background-color: var(--card-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    color: var(--text-color);
    cursor: pointer;
    font-size: 0.875rem;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  
  .page-link.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  .page-link:hover:not(.disabled):not(.active) {
    background-color: var(--card-hover-color);
  }
  
  .page-link.active {
    background-color: #4299e1;
    color: white;
    border-color: #4299e1;
    font-weight: bold;
    transform: scale(1.1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .page-link.page-number {
    min-width: 2rem;
    text-align: center;
  }
  
  @media (max-width: 1024px) {
    .posts-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }
  
  @media (max-width: 640px) {
    .posts-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .title {
      font-size: 1.75rem;
    }
    
    .pagination {
      flex-wrap: wrap;
    }
  }
</style> 