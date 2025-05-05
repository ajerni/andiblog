<script lang="ts">
  import { extractDate } from '$lib/stores/posts';
  import type { Post } from '$lib/stores/posts';

  export let post: Post;
  
  function handleTagClick(event: MouseEvent | KeyboardEvent, tag: string): void {
    // Prevent the event from bubbling up to the post link
    event.preventDefault();
    event.stopPropagation();
    
    // Navigate to the tag page
    window.location.href = `/tags/${encodeURIComponent(tag)}`;
  }
</script>

<article class="post-card">
  <a href="/blog/{post.slug}" class="post-link">
    <div class="image-container">
      <img src={post.featured_image} alt={post.title} class="featured-image"/>
    </div>
    <div class="post-content">
      <h2 class="post-title">{post.title}</h2>
      <p class="post-date">{extractDate(post.published_date)}</p>
      <p class="post-excerpt">{post.excerpt}</p>
      
      <div class="post-tags">
        {#if post.tags && post.tags.length > 0}
          {#each post.tags as tag}
            <span 
              class="tag" 
              on:click={(e) => handleTagClick(e, tag)}
              on:keydown={(e) => e.key === 'Enter' && handleTagClick(e, tag)}
              tabindex="0"
              role="link"
            >
              {tag}
            </span>
          {/each}
        {/if}
      </div>
    </div>
  </a>
</article>

<style>
  .post-card {
    background-color: var(--card-bg-color);
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: var(--card-shadow);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    height: 100%;
  }
  
  .post-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  
  .post-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .image-container {
    width: 100%;
    height: 220px;
    overflow: hidden;
  }
  
  .featured-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .post-card:hover .featured-image {
    transform: scale(1.05);
  }
  
  .post-content {
    padding: 1.25rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .post-title {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
    line-height: 1.3;
  }
  
  .post-date {
    font-size: 0.875rem;
    color: var(--nav-text-color);
    margin: 0 0 0.75rem;
  }
  
  .post-excerpt {
    margin: 0 0 1rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--nav-text-color);
    flex-grow: 1;
  }
  
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }
  
  .tag {
    display: inline-block;
    background-color: var(--tag-bg-color);
    color: var(--tag-text-color);
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }
  
  .tag:hover {
    background-color: var(--primary-color);
    color: white;
    transform: translateY(-2px);
  }
  
  .tag:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
  
  @media (max-width: 640px) {
    .image-container {
      height: 180px;
    }
    
    .post-content {
      padding: 1rem;
    }
    
    .post-title {
      font-size: 1.125rem;
    }
  }
</style> 