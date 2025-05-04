<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Search from '$lib/icons/Search.svelte';
  import SearchComponent from '$lib/components/Search.svelte';
  import { showSearch } from '$lib/stores/SearchStore';

  // Create a store for dark mode state
  const darkMode = writable(false);
  
  onMount(() => {
    // Initialize darkMode store based on HTML class
    $darkMode = document.documentElement.classList.contains('dark');
  });

  function toggleDarkMode() {
    $darkMode = !$darkMode;
    
    // Update DOM and localStorage
    if ($darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }
</script>

<svelte:head>
  <title>Andi's blog</title>
</svelte:head>

<!-- Global styles -->
<div class="app">
  <header>
    <div class="header-container">
      <a href="/" class="logo">
        <span class="emoji">😊</span>
        <span class="title">Andi's blog</span>
      </a>
      
      <nav>
        <a href="/blog?page=1">Blog</a>
        <a href="/about">About</a>
        <button 
          class="search-button" 
          aria-label="Search" 
          on:click={() => $showSearch = true}
          title="Search (⌘+K)"
        >
          <Search size={20} />
        </button>
        <button on:click={toggleDarkMode} class="theme-toggle" aria-label="Toggle dark mode">
          {#if $darkMode}
            <span>🌞</span>
          {:else}
            <span>🌙</span>
          {/if}
        </button>
      </nav>
    </div>
  </header>
  
  <main>
    <slot></slot>
  </main>
  
  <footer>
    <div class="footer-container">
      <p>© 2025 andreas erni. All rights reserved.</p>
      <div class="footer-links">
        <a href="/about">About</a>
        <a href="https://twitter.com">Twitter</a>
        <a href="https://github.com">GitHub</a>
      </div>
    </div>
  </footer>
</div>

<!-- Add the search component -->
<SearchComponent />

<style>
  :global(html) {
    --background-color: #ffffff;
    --text-color: #1a202c;
    --nav-text-color: #4a5568;
    --card-bg-color: #ffffff;
    --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --header-bg-color: #ffffff;
    --footer-bg-color: #f7fafc;
    --border-color: #e2e8f0;
    --button-bg-color: #e2e8f0;
    --button-text-color: #4a5568;
    --link-color: #4299e1;
    --link-hover-color: #2b6cb0;
    --tag-bg-color: #edf2f7;
    --tag-text-color: #4a5568;
  }

  :global(html.dark) {
    --background-color: #0f172a;
    --text-color: #e2e8f0;
    --nav-text-color: #a0aec0;
    --card-bg-color: #1a202c;
    --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    --header-bg-color: #1a202c;
    --footer-bg-color: #1a202c;
    --border-color: #2d3748;
    --button-bg-color: #2d3748;
    --button-text-color: #e2e8f0;
    --link-color: #63b3ed;
    --link-hover-color: #90cdf4;
    --tag-bg-color: #2d3748;
    --tag-text-color: #e2e8f0;
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

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--text-color);
    background-color: var(--background-color);
    margin: 0;
    padding: 0;
    transition: background-color 0.3s ease;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: background-color 0.3s ease;
  }

  header {
    background-color: var(--header-bg-color);
    border-bottom: 1px solid var(--border-color);
    padding: 0.75rem 0;
    transition: background-color 0.3s ease;
  }

  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--text-color);
    font-weight: bold;
    font-size: 1.25rem;
  }

  .emoji {
    margin-right: 0.5rem;
  }

  nav {
    display: flex;
    align-items: center;
  }

  nav a {
    color: var(--nav-text-color);
    text-decoration: none;
    margin-right: 1.5rem;
    font-weight: 500;
    transition: color 0.2s;
  }

  nav a:hover {
    color: var(--link-hover-color);
  }
  
  .search-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    color: var(--nav-text-color);
    margin-right: 0.75rem;
    transition: color 0.2s;
  }
  
  .search-button:hover {
    color: var(--link-hover-color);
  }

  .theme-toggle {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
  }

  main {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  footer {
    background-color: var(--footer-bg-color);
    border-top: 1px solid var(--border-color);
    padding: 1.5rem 0;
    transition: background-color 0.3s ease;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-links {
    display: flex;
    gap: 1.5rem;
  }

  .footer-links a {
    color: var(--nav-text-color);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-links a:hover {
    color: var(--link-hover-color);
  }

  @media (max-width: 640px) {
    .footer-container {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
  }
</style> 