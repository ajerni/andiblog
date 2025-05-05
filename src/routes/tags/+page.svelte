<script lang="ts">
  import { onMount } from 'svelte';
  import { postsStore, fetchAllPosts } from '$lib/stores/posts';
  
  interface TagCount {
    name: string;
    count: number;
  }
  
  // Use only store data
  let allTags: TagCount[] = [];
  let isLoading = true;
  
  // Ensure posts are loaded
  onMount(async () => {
    console.log("Tags page mounted");
    if (!$postsStore.isLoaded && !$postsStore.isLoading) {
      try {
        await fetchAllPosts();
      } catch (error) {
        console.error('Error loading posts in tags index page:', error);
      }
    }
    isLoading = false;
  });
  
  // Calculate tags from store
  $: {
    if ($postsStore.data && $postsStore.data.posts && $postsStore.data.posts.length > 0) {
      console.log('Posts available in store, calculating tags...');
      console.log('Number of posts:', $postsStore.data.posts.length);
      
      // Create a map to count tags
      const tagMap = new Map<string, number>();
      
      // Count occurrences of each tag
      $postsStore.data.posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => {
            const currentCount = tagMap.get(tag) || 0;
            tagMap.set(tag, currentCount + 1);
          });
        } else {
          console.warn('Post without tags or non-array tags:', post.id, post.title);
        }
      });
      
      // Convert to array and sort by count (descending)
      allTags = Array.from(tagMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      
      console.log('All tags calculated:', allTags);
    } else {
      console.log('No posts available yet');
    }
  }
</script>

<svelte:head>
  <title>All Tags - Andi's blog</title>
  <meta name="description" content="Browse all tags on Andi's blog" />
</svelte:head>

<section class="container">
  <div class="header-container">
    <a href="/blog" class="back-link">
      ← Back to Blog
    </a>
    <h1 class="title">All Tags</h1>
  </div>
  
  {#if $postsStore.error}
    <div class="error-container">
      <p class="error-message">Error loading tags: {$postsStore.error}</p>
      <button on:click={() => window.location.reload()}>Retry</button>
    </div>
  {:else if isLoading || $postsStore.isLoading}
    <div class="loading">
      <p>Loading tags...</p>
    </div>
  {:else if allTags.length === 0}
    <div class="empty-container">
      <p>No tags found.</p>
    </div>
  {:else}
    <div class="tags-grid">
      {#each allTags as tag}
        <a href="/tags/{encodeURIComponent(tag.name)}" class="tag-card">
          <div class="tag-info">
            <h2 class="tag-name">{tag.name}</h2>
            <div class="tag-count">({tag.count})</div>
          </div>
        </a>
      {/each}
    </div>
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
  
  .back-link {
    display: inline-flex;
    align-items: center;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    margin-bottom: 1rem;
    transition: color 0.2s;
  }
  
  .back-link:hover {
    color: var(--primary-color-dark);
  }
  
  .title {
    font-size: 2.5rem;
    margin: 0;
    color: var(--text-color);
  }
  
  .tags-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .tag-card {
    background-color: var(--card-bg-color);
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: var(--card-shadow);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-decoration: none;
    color: inherit;
    padding: 1.5rem;
  }
  
  .tag-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  
  .tag-info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  
  .tag-name {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
    text-align: center;
  }
  
  .tag-count {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--nav-text-color);
  }
  
  .loading, .error-container, .empty-container {
    text-align: center;
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    .tags-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
</style> 