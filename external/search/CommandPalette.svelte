<script lang="ts">
  import { fade } from "svelte/transition";
  import { showSearch } from "./CommandPaletteStore";
  import { onMount } from 'svelte';
  import { allPostsStore, initialDataLoaded } from '../../lib/store';
  import { get } from 'svelte/store';
  import type { Post } from "../../lib/api";

  export let showResults = true;
  export let placeholder = "Search...";
  export let results: { title: string; content: string; href: string }[] = [];
  export let noResults = "No results found";
  // We'll still accept initialPosts for SSR, but will prioritize store data
  export let initialPosts: Post[] = [];

  let currentSelection = 0;
  let input: HTMLInputElement;
  let isSearching = false;
  let availablePosts: Post[] = [];
  
  export let value: string = "";

  // Subscribe to the store
  const unsubscribe = allPostsStore.subscribe(posts => {
    if (posts && posts.length > 0) {
      availablePosts = [...posts];
      console.log('CommandPalette: Store updated, available posts:', availablePosts.length);
    }
  });

  // When the component mounts, ensure we have the posts available
  onMount(() => {
    console.log('CommandPalette mounted');
    
    // First check store
    const storeValue = get(allPostsStore);
    const dataLoaded = get(initialDataLoaded);
    
    if (storeValue && storeValue.length > 0) {
      availablePosts = [...storeValue];
      console.log('CommandPalette: Using posts from store:', availablePosts.length);
    } 
    // Fall back to initialPosts from SSR if store is empty
    else if (initialPosts && initialPosts.length > 0) {
      availablePosts = [...initialPosts];
      console.log('CommandPalette: Using initial posts:', availablePosts.length);
    }
    // If both are empty, check window global
    else if (typeof window !== 'undefined') {
      // Use type assertion and optional chaining for type safety
      const windowPosts = (window as any).allPostsStore;
      if (windowPosts && Array.isArray(windowPosts) && windowPosts.length > 0) {
        availablePosts = [...windowPosts];
        console.log('CommandPalette: Using window global posts:', availablePosts.length);
      }
    }
    // If still empty, we'll rely on the parent to provide updates
    
    return () => {
      unsubscribe();
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
    console.log("Starting search for:", value);
    console.log("Available posts to search:", availablePosts.length);
    
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
      
      console.log("Filtered posts:", filteredPosts.length);
      
      if (!filteredPosts || filteredPosts.length === 0) {
        results = [];
        showResults = true;
        isSearching = false;
        return;
      }

      results = filteredPosts.map(post => {
        // Create a simple excerpt from content if needed
        const excerpt = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '');
        
        // Highlight the search term in the content
        const highlightedExcerpt = highlightSearchTerm(excerpt, value);

        return {
          title: post.title,
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
    class="relative z-50"
    role="dialog"
    aria-modal="true"
    transition:fade={{ duration: 100 }}
  >
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto p-4 pt-20 md:p-20">
      <button
        on:click={() => ($showSearch = false)}
        class="fixed inset-0 bg-gray-500/30 dark:bg-gray-900/70 transition-opacity z-0 cursor-default backdrop-blur-sm"
      >
        <div class="sr-only">hide search</div>
      </button>

      <div
        class="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black dark:ring-white/20 ring-opacity-5 transition-all"
      >
        <div class="relative flex flex-grow items-stretch focus-within:z-10 border-b border-gray-200 dark:border-gray-700">
          <input
            on:keydown={(event) => {
              if (event.key === "Enter") {
                if (value.trim() === "") {
                  $showSearch = false;
                }

                // navigate to current selection
                if (currentSelection >= 0 && currentSelection < results.length) {
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
            }}
            type="text"
            class="h-12 w-full border-0 bg-transparent pl-4 pr-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
            {placeholder}
            role="combobox"
            aria-expanded="false"
            aria-controls="options"
            bind:value
            bind:this={input}
          />
          <button
            on:click={search}
            type="button"
            class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <!-- Results -->
        {#if value.trim() !== ""}
          <div>
            {#if isSearching}
              <div class="p-4 text-center">
                <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></div>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
              </div>
            {:else if results.length > 0}
              <div
                class="max-h-80 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
              >
                {#each results as result, i}
                  <a
                    href={result.href}
                    class="group block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors {i === currentSelection ? 'bg-rose-50 dark:bg-gray-800/60' : ''}"
                    on:mousemove={() => (currentSelection = i)}
                  >
                    <h3 class="truncate text-base font-semibold leading-6 text-gray-900 dark:text-gray-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                      {result.title}
                    </h3>
                    <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                      {@html result.content}
                    </p>
                  </a>
                {/each}
              </div>
            {:else}
              <div class="p-4 text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">{noResults}</p>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Apply consistent style to highlighted text */
  :global(.highlight) {
    background-color: rgba(245, 158, 11, 0.2);
    font-weight: bold;
    padding: 0 0.1rem;
    border-radius: 0.125rem;
  }
  
  /* Dark mode version of highlighted text */
  :global(.dark .highlight) {
    background-color: rgba(245, 158, 11, 0.3);
  }
  
  /* Define sr-only for accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style> 