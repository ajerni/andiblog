<script lang="ts">
  import { showSearch } from "../stores/SearchStore";
  import { onMount } from 'svelte';
  import CommandPalette from './CommandPalette.svelte';
  import { fetchAllPosts } from '../stores/posts';

  // Initialize search by fetching all posts when component mounts
  onMount(() => {
    // Load all posts for search
    fetchAllPosts();
    
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

<!-- Add the command palette component -->
<CommandPalette />

<!-- This is a convenience function to avoid needing to import the store in the layout -->
<slot></slot> 