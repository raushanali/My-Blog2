// app.js - Main Express Application File
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/auth');

// In-memory storage for blog posts (will reset on server restart)
let posts = [
  {
    id: 1,
    title: "Welcome to Our Blog",
    content: "This is your first blog post! You can create, edit, and delete posts using this application.",
    author: "Admin Rasuhan",
    createdAt: new Date('2025-08-09')
  },
  {
    id: 2,
    title: "Getting Started with page",
    content: "Explore your ideas with this blog post and learn more about user thoughts.",
    author: "Developer Raushan",
    createdAt: new Date('2025-08-09')
  },
  {
    id: 3,
    title: "Getting Started with page",
    content: "Really this a amazing page for blog Content post edit,dalete also features available of this console.",
    author: "User Raushan",
    createdAt: new Date('2025-08-09')
  }
];

// Counter for generating unique post IDs
let nextId = 3;

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON data
app.use(methodOverride('_method')); // Support PUT and DELETE methods in forms

// Session middleware
app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret in production
  resave: false,
  saveUninitialized: false
}));

// Auth routes
app.use('/', authRoutes);

// Helper function to format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Routes

// Home page - Display all posts
app.get('/', (req, res) => {
  const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.render('index', { 
    posts: sortedPosts, 
    formatDate: formatDate,
    title: 'Home - My Blog' 
  });
});

// Show create post form
app.get('/create', (req, res) => {
  res.render('create', { 
    title: 'Create New Post - My Blog',
    errors: null 
  });
});

// Create a new post
app.post('/posts', (req, res) => {
  const { title, content, author } = req.body;
  
  // Basic validation
  const errors = [];
  if (!title || title.trim() === '') errors.push('Title is required');
  if (!content || content.trim() === '') errors.push('Content is required');
  if (!author || author.trim() === '') errors.push('Author is required');
  
  if (errors.length > 0) {
    return res.render('create', { 
      title: 'Create New Post - My Blog',
      errors: errors,
      formData: req.body
    });
  }
  
  // Create new post
  const newPost = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    author: author.trim(),
    createdAt: new Date()
  };
  
  posts.push(newPost);
  res.redirect('/');
});

// Show individual post
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).render('error', { 
      message: 'Post not found',
      title: 'Error - My Blog'
    });
  }
  
  res.render('post', { 
    post: post, 
    formatDate: formatDate,
    title: `${post.title} - My Blog`
  });
});

// Show edit post form
app.get('/posts/:id/edit', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).render('error', { 
      message: 'Post not found',
      title: 'Error - My Blog'
    });
  }
  
  res.render('edit', { 
    post: post,
    title: `Edit ${post.title} - My Blog`,
    errors: null
  });
});

// Update a post
app.put('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).render('error', { 
      message: 'Post not found',
      title: 'Error - My Blog'
    });
  }
  
  const { title, content, author } = req.body;
  
  // Basic validation
  const errors = [];
  if (!title || title.trim() === '') errors.push('Title is required');
  if (!content || content.trim() === '') errors.push('Content is required');
  if (!author || author.trim() === '') errors.push('Author is required');
  
  if (errors.length > 0) {
    return res.render('edit', { 
      post: { ...post, ...req.body },
      title: `Edit ${post.title} - My Blog`,
      errors: errors
    });
  }
  
  // Update post
  post.title = title.trim();
  post.content = content.trim();
  post.author = author.trim();
  post.updatedAt = new Date();
  
  res.redirect('/');
});

// Delete a post
app.delete('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  posts.splice(postIndex, 1);
  res.redirect('/');
});

// API endpoint to get all posts (for potential AJAX requests)
app.get('/api/posts', (req, res) => {
  const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sortedPosts);
});

// API endpoint to get a single post
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Page not found',
    title: '404 - My Blog'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).render('error', { 
    message: 'Something went wrong!',
    title: 'Error - My Blog'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Blog application is running on http://localhost:${PORT}`);
  console.log(`📝 You can start creating blog posts!`);
});

module.exports = app;