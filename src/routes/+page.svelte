<script lang="ts">
  import { postsStore } from '$lib/stores/posts';
  import PostCard from '$lib/components/PostCard.svelte';
  import Search from '$lib/icons/Search.svelte';
</script>

<svelte:head>
  <title>Andi's blog - Home</title>
  <meta name="description" content="Welcome to Andi's blog - a modern blog about web development, tech and more" />
</svelte:head>

<section class="hero">
  <h1 class="title">Latest Posts</h1>
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
    {#each $postsStore.data.posts as post (post.id)}
      <div class="post-item">
        <PostCard {post} />
      </div>
    {/each}
  </div>
{/if}

<style>
  .hero {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-color);
  }
  
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
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
  }
</style>
