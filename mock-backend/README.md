# AKSARA Mock Backend

Enhanced mock API backend for the AKSARA community platform, built with JSON Server.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 14.0.0
- npm

### Installation
```bash
# Install dependencies
npm install

# Start the mock API server
npm start
```

The server will start on `http://localhost:3002`

## 📡 Available Endpoints

### Core Resources
- **Posts**: `http://localhost:3002/posts` - Community posts and discussions
- **Communities**: `http://localhost:3002/communities` - Community groups and information
- **Events**: `http://localhost:3002/events` - Community events and meetups
- **Books**: `http://localhost:3002/books` - Literature and reading materials
- **Reviews**: `http://localhost:3002/reviews` - Book reviews and ratings
- **Trending**: `http://localhost:3002/trending` - Trending content across the platform

### Enhanced Books Features
The books endpoint includes advanced filtering and search capabilities:

#### Filtering Options
- **Copy Types**: `?copy_type=free,paid,premium`
- **License Types**: `?license_type=open,copyright,creative_commons`
- **Sources**: `?source=github,medium,dev.to,personal_blog`
- **Tags**: `?tag=javascript,web_development,tutorial`

#### Search Features
- **Smart Search**: `?search=keyword` - Searches across title, description, and tags
- **Title Search**: `?title=keyword` - Search in book titles only
- **Author Search**: `?author=keyword` - Search by author names

#### Personalization
- **User Preferences**: Include `X-User-ID` header for personalized recommendations
- **User Tags**: `?user_tags=frontend,vuejs` for content based on user interests

#### Social Features
- **Twitter Embeds**: Books include Twitter discussions and social proof
- **Access Links**: Multiple access points (GitHub, website, etc.)
- **Bookmark Tracking**: Track bookmark counts and user interactions

## 🛠️ Available Scripts

```bash
# Start the mock API server (default)
npm start

# Development mode with file watching
npm run dev

# Production mode (accessible from external networks)
npm run prod

# Simple server setup
npm run simple

# Enhanced server with middleware and custom routes
npm run enhanced
```

## 📁 Project Structure

```
mock-backend/
├── package.json          # Backend dependencies and scripts
├── db.json              # Main database with sample data
├── server.cjs           # Enhanced server with middleware
├── middleware.js        # Custom middleware for advanced features
├── routes.json          # Custom route configurations
├── json-server.json     # JSON Server configuration
└── README.md           # This documentation
```

## 🎯 Features

### Enhanced Books System
- **15 Sample Books** with comprehensive metadata
- **Advanced Filtering** by copy type, license, source, and tags
- **Smart Search** with relevance scoring across multiple fields
- **Twitter Embeds** for social proof and discussions
- **Multiple Access Links** for each book
- **User Personalization** based on preferences and reading history
- **Review System** with detailed user feedback

### Community Platform Data
- **Posts** with community discussions
- **Communities** with user groups and topics
- **Events** with meetup information and schedules
- **Reviews** with user ratings and detailed feedback

### Smart Search & Filtering
- Relevance-based search scoring
- Multi-field search capabilities
- Tag-based filtering
- User preference integration
- Category-specific browsing

## 🔧 Configuration

### Server Configuration
- **Port**: 3002 (configurable via scripts)
- **Database**: `db.json` (auto-watches for changes)
- **Static Files**: Serves from `public/` directory if exists

### Custom Routes
The `routes.json` file defines custom endpoints for better API organization:
- Books reviews with ID-based access
- Community-specific routes
- Event management endpoints

### Middleware Features
The `middleware.js` provides:
- Request logging and debugging
- Advanced search functionality
- User preference filtering
- Smart recommendations
- Input validation and sanitization

## 📱 Usage Examples

### Get All Books
```bash
curl http://localhost:3002/books
```

### Filter by Copy Type
```bash
curl "http://localhost:3002/books?copy_type=free"
```

### Search Books
```bash
curl "http://localhost:3002/books?search=javascript"
```

### Get Personalized Recommendations
```bash
curl -H "X-User-ID: user123" "http://localhost:3002/books?recommendations=true"
```

### Get Trending Books
```bash
curl "http://localhost:3002/books?sort_by=popularity&limit=5"
```

## 🎨 Frontend Integration

### Vue.js/Nuxt.js Integration
From your main project directory, use these scripts:

```bash
# Start mock API for development
npm run mock:api

# Start in development mode
npm run mock:dev

# Start in production mode
npm run mock:prod

# Start enhanced server with middleware
npm run mock:enhanced
```

### API Base URL
```javascript
// In your Vue/Nuxt app
const API_BASE_URL = 'http://localhost:3002'
```

## 🔍 Advanced Features

### User Personalization
Send user information in headers for personalized content:

```javascript
headers: {
  'X-User-ID': 'user123',
  'X-User-Tags': 'frontend,javascript,vuejs'
}
```

### Smart Recommendations
The system provides personalized book recommendations based on:
- User's reading history
- Tag preferences
- Popular content in user's communities
- Trending topics

### Social Proof Integration
Books include Twitter embeds for:
- Author discussions
- Community reviews
- Technical discussions
- Learning resources

## 🚦 Development

### Adding New Data
1. Edit `db.json` to add new books, posts, or communities
2. Changes are automatically reflected (file watching enabled)

### Custom Endpoints
1. Modify `routes.json` for new route definitions
2. Update `middleware.js` for custom logic
3. Restart the server

### Extending the Schema
The current data structure supports:
- Books with metadata, tags, and social features
- Communities with user engagement
- Events with scheduling and attendance
- Reviews with detailed feedback
- Posts with community interactions

## 📊 Data Schema

### Book Schema
```json
{
  "id": 1,
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "copy_type": "free|paid|premium",
  "license_type": "open|copyright|creative_commons",
  "source": "github|medium|dev.to|personal_blog",
  "tags": ["tag1", "tag2"],
  "published_date": "2024-01-01",
  "difficulty_level": "beginner|intermediate|advanced",
  "estimated_reading_time": "5 hours",
  "language": "en",
  "page_count": 250,
  "rating": 4.5,
  "bookmark_count": 150,
  "review_count": 25,
  "twitter_embeds": ["tweet1", "tweet2"],
  "access_links": [
    {"type": "github", "url": "..."},
    {"type": "website", "url": "..."}
  ],
  "table_of_contents": [...],
  "cover_image": "https://...",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## 🤝 Contributing

1. Modify `db.json` for data changes
2. Update `middleware.js` for business logic changes
3. Test thoroughly with the frontend application
4. Maintain backward compatibility

## 📝 License

ISC License - See LICENSE file for details

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill existing json-server processes
pkill -f json-server

# Or use a different port
npm run dev -- --port 3003
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Server Not Starting
- Check Node.js version: `node --version` (should be >= 14.0.0)
- Verify dependencies installed: `ls node_modules`
- Check logs for specific error messages

---

**AKSARA Mock Backend** - Part of the AKSARA community platform for DISPUSIPDA Jawa Barat