<script lang="ts">
  import { fade } from "svelte/transition";
  import { showSearch } from "../stores/SearchStore";
  import { onMount } from 'svelte';
  import { postsStore } from '../stores/posts';
  import type { Post } from "../stores/posts";

  export let showResults = true;
  export let placeholder = "Search...";
  export let results: { title: string; content: string; href: string }[] = [];
  export let noResults = "No results found";

  let currentSelection = 0;
  let input: HTMLInputElement;
  let isSearching = false;
  let availablePosts: Post[] = [];
  let searchContainer: HTMLDivElement;
  
  export let value: string = "";

  // Subscribe to the store
  const unsubscribe = postsStore.subscribe(state => {
    if (state.data.posts && state.data.posts.length > 0) {
      availablePosts = [...state.data.posts];
    }
  });

  onMount(() => {
    // Set up a click event listener on the document to detect clicks outside the search
    const handleClickOutside = (event: MouseEvent) => {
      if ($showSearch && searchContainer && !searchContainer.contains(event.target as Node)) {
        $showSearch = false;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  export const show = () => {
    $showSearch = true;
    setTimeout(() => {
      input?.focus();
    }, 200);
  };

  // Search through the already loaded posts
  function search() {
    if (value.trim() === "") {
      results = [];
      showResults = false;
      return;
    }

    try {
      isSearching = true;
      
      // Extract the search term and make it case-insensitive
      const searchTerm = value.trim().toLowerCase();
      
      // Filter posts that contain the search term in title or content
      const filteredPosts = availablePosts.filter(post => {
        const titleMatch = post.title?.toLowerCase().includes(searchTerm) || false;
        const contentMatch = post.content?.toLowerCase().includes(searchTerm) || false;
        const excerptMatch = post.excerpt?.toLowerCase().includes(searchTerm) || false;
        const tagsMatch = post.tags ? post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) : false;
        
        return titleMatch || contentMatch || excerptMatch || tagsMatch;
      });
      
      if (!filteredPosts || filteredPosts.length === 0) {
        results = [];
        showResults = true;
        isSearching = false;
        return;
      }

      results = filteredPosts.map(post => {
        // Create a simple excerpt from content if needed
        const excerpt = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '');
        
        // Highlight the search term in the content and title
        const highlightedExcerpt = highlightSearchTerm(excerpt, value);
        const highlightedTitle = highlightSearchTerm(post.title, value);

        return {
          title: highlightedTitle,
          content: highlightedExcerpt,
          href: `/blog/${post.slug}`
        };
      });
      
      showResults = true;
    } catch (error) {
      console.error("Error searching:", error);
      results = [];
    } finally {
      isSearching = false;
    }
  }

  // Function to highlight search terms in content
  function highlightSearchTerm(text: string, term: string): string {
    if (!text) return '';
    
    // Create a case-insensitive RegExp to match the search term
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    
    // Replace matches with highlighted span
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  // Debounce function with proper types
  function debounce<F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Debounced search
  const debouncedSearch = debounce(search, 300);

  // Trigger search when value changes
  $: if (value.trim() === "") {
    results = [];
    showResults = false;
  } else {
    debouncedSearch();
  }

  // Focus input when search is opened
  $: if ($showSearch) {
    currentSelection = 0;
    setTimeout(() => {
      input?.focus();
    }, 200);
  } else {
    value = "";
  }
</script>

<svelte:window
  on:keydown={(event) => {
    // show/hide on command + k
    if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
      $showSearch = !$showSearch;
      event.preventDefault();
    }

    // close on escape
    if (event.key === "Escape" && $showSearch) {
      $showSearch = false;
    }
  }}
/>

{#if $showSearch}
  <div
    class="search-overlay"
    transition:fade={{ duration: 150 }}
  >
    <div 
      class="search-container"
      bind:this={searchContainer}
    >
      <div class="search-box">
        <input
          type="text"
          placeholder={placeholder}
          bind:value
          bind:this={input}
          on:keydown={(event) => {
            if (event.key === "Enter") {
              if (value.trim() === "") {
                $showSearch = false;
              }

              // navigate to current selection
              if (currentSelection >= 0 && currentSelection < results.length) {
                $showSearch = false;
                window.location.href = results[currentSelection].href;
              } else {
                $showSearch = false;
              }
            }

            // Arrow down
            if (event.key === "ArrowDown") {
              event.preventDefault();
              currentSelection++;
              if (currentSelection >= results.length) currentSelection = 0;
            }
            
            // Arrow up
            if (event.key === "ArrowUp") {
              event.preventDefault();
              currentSelection--;
              if (currentSelection < 0) currentSelection = results.length - 1;
            }

            // Escape to close
            if (event.key === "Escape") {
              $showSearch = false;
            }
          }}
        />
        <button 
          class="search-icon-button" 
          on:click={search}
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <!-- Results -->
      {#if value.trim() !== "" && showResults}
        <div class="search-results">
          {#if isSearching}
            <div class="searching">
              <div class="spinner"></div>
              <p>Searching...</p>
            </div>
          {:else if results.length > 0}
            <div class="results-list">
              {#each results as result, i}
                <!-- Use a real anchor tag with data-sveltekit attributes -->
                <a 
                  href={result.href}
                  class="result-item {i === currentSelection ? 'selected' : ''}"
                  on:mousemove={() => (currentSelection = i)}
                  data-sveltekit-preload-data="hover"
                  data-sveltekit-reload
                  on:click={() => { $showSearch = false; }}
                >
                  <h3>{@html result.title}</h3>
                  <p>{@html result.content}</p>
                </a>
              {/each}
            </div>
          {:else}
            <div class="no-results">
              <p>{noResults}</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 120px;
    z-index: 50;
  }

  .search-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .search-box {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  :global(.dark) .search-box {
    background-color: #1a202c;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  input {
    flex: 1;
    padding: 16px;
    border: none;
    background: transparent;
    font-size: 16px;
    color: #1a202c;
    outline: none;
  }

  :global(.dark) input {
    color: #e2e8f0;
  }

  input::placeholder {
    color: #a0aec0;
  }

  .search-icon-button {
    background: transparent;
    border: none;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #718096;
  }

  :global(.dark) .search-icon-button {
    color: #a0aec0;
  }

  .search-icon-button svg {
    width: 20px;
    height: 20px;
  }

  .search-results {
    background-color: white;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    margin-top: 1px;
    max-height: 360px;
    overflow-y: auto;
  }

  :global(.dark) .search-results {
    background-color: #1a202c;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  .results-list {
    padding: 0;
  }

  .result-item {
    display: block;
    width: 100%;
    padding: 16px;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid #f1f1f1;
    text-decoration: none;
    color: inherit;
  }

  :global(.dark) .result-item {
    border-bottom: 1px solid #2d3748;
  }

  .result-item:last-child {
    border-bottom: none;
  }

  .result-item:hover,
  .result-item.selected {
    background-color: #f7fafc;
  }

  :global(.dark) .result-item:hover,
  :global(.dark) .result-item.selected {
    background-color: #2d3748;
  }

  .result-item h3 {
    margin: 0 0 6px 0;
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
  }

  :global(.dark) .result-item h3 {
    color: #e2e8f0;
  }

  .result-item p {
    margin: 0;
    font-size: 14px;
    color: #718096;
    line-height: 1.4;
  }

  :global(.dark) .result-item p {
    color: #a0aec0;
  }

  .searching,
  .no-results {
    padding: 24px;
    text-align: center;
    color: #718096;
  }

  :global(.dark) .searching,
  :global(.dark) .no-results {
    color: #a0aec0;
  }

  .spinner {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-bottom: 8px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4299e1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  :global(.dark) .spinner {
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-left-color: #63b3ed;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Highlight style for search results */
  :global(.highlight) {
    background-color: rgba(245, 158, 11, 0.2);
    font-weight: bold;
    padding: 0 0.1rem;
    border-radius: 0.125rem;
  }
  
  :global(.dark .highlight) {
    background-color: rgba(245, 158, 11, 0.3);
  }
</style> 