<?php
/**
 * Blog Route definitions
 * 
 * Define all your blog API routes in this file
 */

// Helper function to handle CORS preflight requests
function handleCORS($request, $response) {
    // Add CORS headers - use wildcard for all origins
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept, Origin, X-Force-Refresh, X-Requested-With, Cache-Control, Pragma, Expires");
    header("Content-Type: application/json");
    
    // Standard cache control headers to prevent caching
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Pragma: no-cache");
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Past date to ensure no caching
    
    // Handle OPTIONS preflight request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        // For OPTIONS request, just return success with the headers
        http_response_code(200);
        exit();
    }
    
    return null; // Continue with normal request handling
}

// GET all blog posts
$app->get('/api/posts', function($request, $response) use ($pdo) {
    // Handle CORS preflight
    $corsResponse = handleCORS($request, $response);
    if ($corsResponse) return $corsResponse;
    
    error_log("API /api/posts called at " . date('Y-m-d H:i:s')); // Debug log with timestamp
    
    // Check for refresh parameters
    $params = $request->getQueryParams();
    $refresh = isset($params['refresh_db']) || isset($params['bypass_cache']) || isset($params['_force']) || isset($params['nocache']);
    
    if ($refresh) {
        // Log that we're forcing a database refresh
        error_log("NOTICE: Forcing fresh data from database due to refresh parameters");
        
        // Check if we should run a small query to ensure fresh data
        if (isset($params['refresh_db'])) {
            // Execute a small query to ensure connection is fresh
            try {
                $pdo->query("SELECT 1");
                error_log("Database connection refreshed successfully");
            } catch (PDOException $e) {
                error_log("Failed to refresh database connection: " . $e->getMessage());
            }
        }
    }
    
    try {
        $page = isset($params['page']) ? (int)$params['page'] : 1;
        $limit = isset($params['limit']) ? (int)$params['limit'] : 10;
        $offset = ($page - 1) * $limit;
        
        // Debug information for pagination
        error_log("Pagination params: page=$page, limit=$limit, offset=$offset");
        
        // Get total count for pagination
        $countStmt = $pdo->query('SELECT COUNT(*) FROM blog_posts WHERE published = 1');
        $totalPosts = $countStmt->fetchColumn();
        error_log("Total posts in database: $totalPosts");
        
        // Add standard cache control and CORS headers
        $response = $response->withHeader('Access-Control-Allow-Origin', '*');
        $response = $response->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response = $response->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Force-Refresh, X-Requested-With, Cache-Control, Pragma, Expires');
        $response = $response->withHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        $response = $response->withHeader('Pragma', 'no-cache');
        $response = $response->withHeader('Expires', 'Mon, 26 Jul 1997 05:00:00 GMT');
        
        // Query with hardcoded LIMIT/OFFSET and ALWAYS order by published_date DESC to get newest posts first
        $query = 'SELECT id, title, slug, excerpt, content, featured_image, published_date, 
                  updated_date, tags FROM blog_posts 
                  WHERE published = 1 
                  ORDER BY published_date DESC 
                  LIMIT ' . intval($limit) . ' OFFSET ' . intval($offset);
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        error_log("Query returned " . count($posts) . " posts for page $page with limit $limit");
        
        // Parse tags for each post if stored as JSON string
        foreach ($posts as &$post) {
            if (isset($post['tags']) && is_string($post['tags'])) {
                $post['tags'] = json_decode($post['tags'], true);
            }
        }
        
        $lastPage = ceil($totalPosts / $limit);
        
        error_log("Pagination info - total: $totalPosts, page: $page, limit: $limit, lastPage: $lastPage");
        
        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode([
            'posts' => $posts, 
            'pagination' => [
                'total' => $totalPosts,
                'page' => $page,
                'limit' => $limit,
                'lastPage' => $lastPage
            ],
            'timestamp' => time(),
            'status' => 'success'
        ]));
        return $response;
    } catch (PDOException $e) {
        error_log("API /api/posts error: " . $e->getMessage());
        $response = $response->withStatus(500);
        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]));
        return $response;
    }
});

// GET single blog post by slug
$app->get('/api/posts/{slug}', function($request, $response, $args) use ($pdo) {
    // Handle CORS preflight
    $corsResponse = handleCORS($request, $response);
    if ($corsResponse) return $corsResponse;
    
    try {
        $slug = $args['slug'];
        $stmt = $pdo->prepare('SELECT id, title, slug, excerpt, content, featured_image, 
                              published_date, updated_date, tags 
                              FROM blog_posts
                              WHERE slug = ? AND published = 1');
        $stmt->execute([$slug]);
        $post = $stmt->fetch();
        
        $response = $response->withHeader('Content-Type', 'application/json');
        
        if (!$post) {
            $response = $response->withStatus(404);
            $response->getBody()->write(json_encode([
                'status' => 'error', 
                'message' => 'Post not found'
            ]));
            return $response;
        }
        
        // If tags is stored as JSON string, decode it
        if (isset($post['tags']) && is_string($post['tags'])) {
            $post['tags'] = json_decode($post['tags'], true);
        }
        
        $response->getBody()->write(json_encode(['post' => $post, 'status' => 'success']));
        return $response;
    } catch (PDOException $e) {
        $response = $response->withStatus(500);
        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]));
        return $response;
    }
});

// Create a new blog post
$app->post('/api/posts', function($request, $response) use ($pdo) {
    // Handle CORS preflight
    $corsResponse = handleCORS($request, $response);
    if ($corsResponse) return $corsResponse;
    
    try {
        $data = $request->getParsedBody();
        
        // Validate required fields
        if (empty($data['title']) || empty($data['content'])) {
            $response = $response->withStatus(400);
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode([
                'status' => 'error',
                'message' => 'Title and content are required'
            ]));
            return $response;
        }
        
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
        }
        
        // Prepare tags as JSON if they're provided as an array
        $tags = isset($data['tags']) ? $data['tags'] : [];
        if (is_array($tags)) {
            $tags = json_encode($tags);
        }
        
        // Set default values
        $excerpt = isset($data['excerpt']) ? $data['excerpt'] : '';
        $featuredImage = isset($data['featured_image']) ? $data['featured_image'] : '';
        $published = isset($data['published']) ? (int)$data['published'] : 1;
        $now = date('Y-m-d H:i:s');
        
        // Insert the new post
        $stmt = $pdo->prepare('INSERT INTO blog_posts 
                              (title, slug, excerpt, content, featured_image, 
                               published_date, tags, published) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['title'], 
            $data['slug'], 
            $excerpt, 
            $data['content'], 
            $featuredImage,
            $now, 
            $tags, 
            $published
        ]);
        
        $postId = $pdo->lastInsertId();
        
        $response = $response->withStatus(201);
        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode([
            'status' => 'success',
            'message' => 'Post created successfully',
            'postId' => $postId
        ]));
        return $response;
    } catch (PDOException $e) {
        $response = $response->withStatus(500);
        $response = $response->withHeader('Content-Type', 'application/json');
        $errorMessage = $e->getMessage();
        
        // Check for duplicate slug
        if (strpos($errorMessage, 'Duplicate entry') !== false && strpos($errorMessage, 'slug') !== false) {
            $response->getBody()->write(json_encode([
                'status' => 'error',
                'message' => 'A post with this slug already exists'
            ]));
        } else {
            $response->getBody()->write(json_encode([
                'status' => 'error',
                'message' => 'Database error: ' . $errorMessage
            ]));
        }
        return $response;
    }
});

// Update a blog post
$app->put('/api/posts/{id}', function($request, $response, $args) use ($pdo) {
    // Handle CORS preflight
    $corsResponse = handleCORS($request, $response);
    if ($corsResponse) return $corsResponse;
    
    try {
        $id = $args['id'];
        $data = $request->getParsedBody();
        
        // Check if post exists
        $stmt = $pdo->prepare('SELECT id FROM blog_posts WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            $response = $response->withStatus(404);
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode([
                'status' => 'error', 
                'message' => 'Post not found'
            ]));
            return $response;
        }
        
        // Build update query dynamically based on provided fields
        $updateFields = [];
        $params = [];
        
        if (!empty($data['title'])) {
            $updateFields[] = 'title = ?';
            $params[] = $data['title'];
        }
        
        if (!empty($data['slug'])) {
            $updateFields[] = 'slug = ?';
            $params[] = $data['slug'];
        } else if (!empty($data['title']) && empty($data['slug'])) {
            // Auto-update slug if title changes and slug isn't explicitly provided
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
            $updateFields[] = 'slug = ?';
            $params[] = $slug;
        }
        
        if (isset($data['excerpt'])) {
            $updateFields[] = 'excerpt = ?';
            $params[] = $data['excerpt'];
        }
        
        if (isset($data['content'])) {
            $updateFields[] = 'content = ?';
            $params[] = $data['content'];
        }
        
        if (isset($data['featured_image'])) {
            $updateFields[] = 'featured_image = ?';
            $params[] = $data['featured_image'];
        }
        
        if (isset($data['tags'])) {
            $tags = $data['tags'];
            if (is_array($tags)) {
                $tags = json_encode($tags);
            }
            $updateFields[] = 'tags = ?';
            $params[] = $tags;
        }
        
        if (isset($data['published'])) {
            $updateFields[] = 'published = ?';
            $params[] = (int)$data['published'];
        }
        
        // Always update the updated_date
        $updateFields[] = 'updated_date = ?';
        $params[] = date('Y-m-d H:i:s');
        
        if (empty($updateFields)) {
            $response = $response->withStatus(400);
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode([
                'status' => 'error',
                'message' => 'No fields to update'
            ]));
            return $response;
        }
        
        // Add ID to parameters
        $params[] = $id;
        
        // Execute update
        $sql = 'UPDATE blog_posts SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode([
            'status' => 'success',
            'message' => 'Post ' . $id . ' updated successfully'
        ]));
        return $response;
    } catch (PDOException $e) {
        $response = $response->withStatus(500);
        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]));
        return $response;
    }
});

// Delete a blog post
$app->delete('/api/posts/{id}', function($request, $response, $args) use ($pdo) {
    // Handle CORS preflight
    $corsResponse = handleCORS($request, $response);
    if ($corsResponse) return $corsResponse;
    
    try {
        $id = $args['id'];
        
        // Check if post exists
        $stmt = $pdo->prepare('SELECT id FROM blog_posts WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            $response = $response->withStatus(404);
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode([
                'status' => 'error', 
                'message' => 'Post not found'
            ]));
            return $response;
        }
        
        // Delete post
        $stmt = $pdo->prepare('DELETE FROM blog_posts WHERE id = ?');
        $stmt->execute([$id]);
        
        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode([
            'status' => 'success',
            'message' => 'Post ' . $id . ' deleted successfully'
        ]));
        return $response;
    } catch (PDOException $e) {
        $response = $response->withStatus(500);
        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]));
        return $response;
    }
}); 