<script lang="ts">
  import { showSearch } from "./CommandPaletteStore";
  import { onMount } from 'svelte';

  // Ensure search works by initializing on mount
  onMount(() => {
    // Listen for keyboard shortcut on all pages
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        $showSearch = true;
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<button
  class="search-button"
  on:click={() => {
    console.log("Search button clicked, current state:", $showSearch);
    $showSearch = true;
    console.log("Set showSearch to:", $showSearch);
  }}
  aria-label="Search"
  title="Search (⌘+K)"
>
  <div class="sr-only">search</div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
</button>

<style>
  .search-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    transition: transform 0.15s ease;
    border-radius: 0.375rem;
  }
  
  .search-button:hover {
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  :global(.dark) .search-button:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
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

<noscript>
  <style>
    .search-button {
      display: none;
    }
  </style>
</noscript> 