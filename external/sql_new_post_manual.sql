INSERT INTO blog_posts (
    title,
    slug,
    excerpt,
    content,
    featured_image,
    published_date,
    updated_date,
    tags,
    published
) VALUES (
    'Building a Modern Blog with Astro and PHP',
    'building-modern-blog-astro-php',
    'Learn how to create a fast, modern blog using Astro for the frontend and PHP for the backend API.',
    'In this post, we\'ll explore how to build a modern blog using Astro as our frontend framework and PHP as our backend API. We\'ll cover topics like:

- Setting up Astro with TypeScript
- Creating reusable components
- Implementing dark mode
- Building a PHP REST API
- Managing blog posts with MySQL
- Adding authentication for the admin interface

Stay tuned for more detailed insights into this tech stack!',
    'https://picsum.photos/800/400',
    NOW(),
    NOW(),
    '["Astro", "PHP", "Web Development", "TypeScript"]',
    1
);


INSERT INTO blog_posts (
    title,
    slug,
    excerpt,
    content,
    featured_image,
    published_date,
    updated_date,
    tags,
    published
) VALUES (
    'Andother day',
    'another-day',
    'Where is this going? I am the excerpt.',
    'And I am the content',
    'https://picsum.photos/800/400',
    NOW(),
    NOW(),
    '["Andi", "Days"]',
    1
);

INSERT INTO blog_posts (
    title,
    slug,
    excerpt,
    content,
    featured_image,
    published_date,
    updated_date,
    tags,
    published
) VALUES (
    'My shiny apple',
    'my-shiny-apple',
    'This is a test post to see how images work.',
    'With an apple for example. Stored at imagekit.io. In my mywine folder. And I am the content of this post. I am a test post to see how images work.',
    'https://ik.imagekit.io/mywine/andiblog/tr:w-800,h-400/apfel.jpg',
    NOW(),
    NOW(),
    '["Andi", "test"]',
    1
);