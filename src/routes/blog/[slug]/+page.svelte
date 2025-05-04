<script lang="ts">
  import { onMount } from 'svelte';
  import { postsStore, formatDate, getPostBySlug } from '$lib/stores/posts';
  import type { Post } from '$lib/stores/posts';
  
  export let data: { slug: string };
  
  let post: Post | null = null;
  
  onMount(() => {
    // Try to get post from the store
    post = getPostBySlug(data.slug);
  });
</script>

<svelte:head>
  {#if post}
    <title>{post.title} | Andi's blog</title>
    <meta name="description" content={post.excerpt} />
  {:else}
    <title>Loading... | Andi's blog</title>
  {/if}
</svelte:head>

<div class="post-container">
  {#if $postsStore.error}
    <div class="error-container">
      <h1>Error</h1>
      <p class="error-message">{$postsStore.error}</p>
      <a href="/" class="back-link">← Back to home</a>
    </div>
  {:else if $postsStore.isLoading && !post}
    <div class="loading">
      <p>Loading post...</p>
    </div>
  {:else if post}
    <article class="post">
      <header class="post-header">
        <h1 class="post-title">{post.title}</h1>
        <div class="post-meta">
          <time datetime={post.published_date}>{formatDate(post.published_date)}</time>
          <div class="post-tags">
            {#each post.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </div>
      </header>
      
      <div class="featured-image-container">
        <img src={post.featured_image} alt={post.title} class="featured-image" />
      </div>
      
      <div class="post-content">
        {@html post.content}
      </div>
      
      <footer class="post-footer">
        <a href="/" class="back-link">← Back to all posts</a>
      </footer>
    </article>
  {:else}
    <div class="error-container">
      <h1>Not Found</h1>
      <p>The requested post could not be found.</p>
      <a href="/" class="back-link">← Back to home</a>
    </div>
  {/if}
</div>

<style>
  .post-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .post-header {
    margin-bottom: 2rem;
  }
  
  .post-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    font-size: 0.875rem;
    color: var(--nav-text-color);
    margin-bottom: 1rem;
  }
  
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tag {
    display: inline-block;
    background-color: var(--tag-bg-color);
    color: var(--tag-text-color);
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
  }
  
  .featured-image-container {
    margin-bottom: 2rem;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: var(--card-shadow);
  }
  
  .featured-image {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .post-content {
    font-size: 1.125rem;
    line-height: 1.8;
    margin-bottom: 2rem;
  }
  
  .post-content :global(h2) {
    font-size: 1.75rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  .post-content :global(h3) {
    font-size: 1.5rem;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
  }
  
  .post-content :global(p) {
    margin-bottom: 1.5rem;
  }
  
  .post-content :global(ul), .post-content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
  }
  
  .post-content :global(li) {
    margin-bottom: 0.5rem;
  }
  
  .post-content :global(a) {
    color: var(--link-color);
    text-decoration: none;
    border-bottom: 1px solid var(--link-color);
    transition: border-color 0.2s;
  }
  
  .post-content :global(a:hover) {
    border-color: transparent;
  }
  
  .post-footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color);
  }
  
  .back-link {
    display: inline-block;
    color: var(--link-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  
  .back-link:hover {
    color: var(--link-hover-color);
  }
  
  .loading, .error-container {
    text-align: center;
    padding: 3rem 1rem;
  }
  
  .error-message {
    color: #e53e3e;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 640px) {
    .post-title {
      font-size: 1.875rem;
    }
    
    .post-content {
      font-size: 1rem;
    }
  }
</style> 