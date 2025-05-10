<script>
  // About page component
</script>

<svelte:head>
  <title>About | Andi's blog</title>
  <meta name="description" content="Learn more about Andi and this blog." />
</svelte:head>

<div class="about-container">
  <h1 class="title">About</h1>
  
  <div class="about-content">
    <div class="profile-section">
      <div class="profile-image-container">
        <img src="andiprofile.jpg" alt="Profile" class="profile-image" />
      </div>
      
      <div class="bio">
        <h2>Andi Erni</h2>
        <p class="tagline">Developer & Tech Enthusiast</p>
        
        <div class="social-links">
          <a href="https://x.com/andreas_erni" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://github.com/ajerni" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </div>
    
    <div class="content-section">
      <h3>About Me</h3>
      <p>Hi there! I'm Andi Erni, a passionate hobby developer and tech enthusiast. This blog is my platform to share insights, tutorials, and thoughts on web development, programming, and technology. Well, it's not - it's just to test automated AI content generation and to showcase my skills 😉.</p>
      
      <h3>About This Blog</h3>
      <p>This blog serves mainly as my test platform for automation and AI tools. The content might change over time and is not always up to date and should not be taken seriously at all 🐛. It's not about the content, but about the technology and tools behind it.</p>

      <p>Some features of this blog include:</p>
      <ul>
        <li>AI generated blog posts 📝 and images 📷</li>
        <li>Automated publishing 🤖 of the blog post</li>
        <li>Super sophisticated search 👀 functionality</li>
        <li>...</li>
      </ul>
      
      <h3>Get in Touch</h3>
      <p>Have questions, project ideas, or just want to say hello? Feel free to reach out through any of the social links above or visit my website at <a href="https://www.andierni.tech" target="_blank" rel="noopener noreferrer">www.andierni.ch</a>.</p>
    </div>
  </div>
</div>

<style>
  .about-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .about-content {
    background-color: var(--card-bg-color);
    border-radius: 0.5rem;
    box-shadow: var(--card-shadow);
    overflow: hidden;
  }
  
  .profile-section {
    display: flex;
    padding: 2rem;
    background-color: var(--tag-bg-color);
    border-bottom: 1px solid var(--border-color);
  }
  
  .profile-image-container {
    flex-shrink: 0;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .bio {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .bio h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
  }
  
  .tagline {
    font-size: 1.125rem;
    color: var(--nav-text-color);
    margin: 0 0 1rem;
  }
  
  .social-links {
    display: flex;
    gap: 1rem;
  }
  
  .social-links a {
    color: var(--link-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  
  .social-links a:hover {
    color: var(--link-hover-color);
  }
  
  .content-section {
    padding: 2rem;
  }
  
  .content-section h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem;
    padding-top: 1.5rem;
  }
  
  .content-section h3:first-child {
    padding-top: 0;
  }
  
  .content-section p {
    margin: 0 0 1.25rem;
    line-height: 1.6;
  }
  
  .content-section ul {
    margin: 0 0 1.25rem;
    padding-left: 1.5rem;
  }
  
  .content-section li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  .content-section a {
    color: var(--link-color);
    text-decoration: none;
    border-bottom: 1px solid var(--link-color);
    transition: border-color 0.2s;
  }
  
  .content-section a:hover {
    border-color: transparent;
  }
  
  @media (max-width: 768px) {
    .profile-section {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .profile-image-container {
      margin-right: 0;
      margin-bottom: 1.5rem;
    }
    
    .social-links {
      justify-content: center;
    }
  }
  
  @media (max-width: 640px) {
    .title {
      font-size: 2rem;
    }
    
    .profile-section, .content-section {
      padding: 1.5rem;
    }
    
    .profile-image-container {
      width: 120px;
      height: 120px;
    }
    
    .bio h2 {
      font-size: 1.5rem;
    }
  }
</style> 