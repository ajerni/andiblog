<script>
  import { page } from '$app/stores';
</script>

<div class="error-container">
  <h1>{$page.status}</h1>
  <p class="error-message">
    {$page.error?.message || 'An unexpected error occurred in tags page'}
  </p>
  <a href="/blog" class="back-link">← Back to Blog</a>
</div>

<style>
  .error-container {
    max-width: 800px;
    margin: 4rem auto;
    padding: 2rem;
    text-align: center;
    background-color: var(--card-bg-color);
    border-radius: 0.5rem;
    box-shadow: var(--card-shadow);
  }
  
  h1 {
    font-size: 4rem;
    margin: 0 0 1rem;
    color: #e53e3e;
  }
  
  .error-message {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    color: var(--text-color);
  }
  
  .back-link {
    display: inline-block;
    color: var(--link-color);
    text-decoration: none;
    font-weight: 500;
    padding: 0.75rem 1.5rem;
    background-color: var(--button-bg-color);
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }
  
  .back-link:hover {
    background-color: var(--primary-color);
    color: white;
  }
</style> 