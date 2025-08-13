# Blog Application

A simple, responsive blog application built with Node.js, Express, and EJS templating.

## Features

- Create, read, update, and delete blog posts
- Responsive design that works on all devices
- Clean and modern UI
- In-memory storage (can be easily extended to use a database)
- RESTful API endpoints

## Project Structure

```
blog-app/
├── app.js                 # Main application file
├── package.json           # Project dependencies
├── public/                # Static files
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   └── main.js        # Client-side JavaScript
│   └── images/            # Images directory
├── views/                 # EJS templates
│   ├── index.ejs          # Home page template
│   ├── create.ejs         # Create post template
│   ├── edit.ejs           # Edit post template
│   └── partials/          # Reusable template components
│       ├── header.ejs     # Header partial
│       └── footer.ejs     # Footer partial
└── README.md              # Project documentation
```

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```
   or for development with auto-restart:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Create your first blog post by clicking "Create Post" in the navigation

## API Endpoints

- `GET /` - Display all blog posts
- `GET /posts/new` - Display create post form
- `POST /posts` - Create a new post
- `GET /posts/:id/edit` - Display edit post form
- `PUT /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **EJS** - Templating engine
- **CSS3** - Styling
- **HTML5** - Markup

## Future Enhancements

- Add database integration (MongoDB, PostgreSQL, etc.)
- User authentication and authorization
- Comments system
- Categories and tags
- Search functionality
- Image upload
- Markdown support
- RSS feed
- SEO optimization

