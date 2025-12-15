const _ = require('lodash');

module.exports = (req, res, next) => {
  // Add custom headers
  res.setHeader('X-Powered-By', 'JSON-Server');
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count, X-Total-Pages');

  // Simulate API delay for realistic testing
  const delay = Math.random() * 500 + 100; // 100-600ms delay
  setTimeout(() => {
    // Authentication simulation for protected routes
    const protectedRoutes = ['/api/posts', '/api/communities', '/api/events', '/api/books', '/api/reviews'];
    const isProtected = protectedRoutes.some(route =>
      req.path.includes(route) && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' || req.method === 'PATCH')
    );

    if (isProtected) {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: "Authentication required. Please provide a valid Bearer token."
        });
      }

      const token = auth.substring(7);
      // Simple token validation (in production, use proper JWT verification)
      if (token.length < 10) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token."
        });
      }
    }

    // Input validation for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const { body } = req;

      // Post validation
      if (req.path.includes('/posts') || req.path.includes('posts')) {
        if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Post title is required and must be a non-empty string."
          });
        }

        if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Post content is required and must be a non-empty string."
          });
        }

        if (!body.author || !body.author.name || typeof body.author.name !== 'string') {
          return res.status(400).json({
            success: false,
            message: "Post author information is required."
          });
        }
      }

      // Community validation
      if (req.path.includes('/communities') || req.path.includes('communities')) {
        if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Community name is required and must be a non-empty string."
          });
        }

        if (!body.description || typeof body.description !== 'string' || body.description.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Community description is required and must be a non-empty string."
          });
        }
      }

      // Event validation (exclude click_events from this validation)
      if ((req.path.includes('/events') || req.path.includes('events')) && !req.path.includes('click_events')) {
        if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Event title is required and must be a non-empty string."
          });
        }

        if (!body.date) {
          return res.status(400).json({
            success: false,
            message: "Event date is required."
          });
        }

        if (!body.location || typeof body.location !== 'string' || body.location.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Event location is required and must be a non-empty string."
          });
        }
      }

      // Book validation
      if (req.path.includes('/books') || req.path.includes('books')) {
        if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Book title is required and must be a non-empty string."
          });
        }

        if (!body.author || typeof body.author !== 'string' || body.author.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Book author is required and must be a non-empty string."
          });
        }

        if (!body.description || typeof body.description !== 'string' || body.description.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Book description is required and must be a non-empty string."
          });
        }

        // Validate rating if provided
        if (body.rating && (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5)) {
          return res.status(400).json({
            success: false,
            message: "Book rating must be a number between 1 and 5."
          });
        }

        // Validate copy type if provided
        if (body.copy_type && !['Physical', 'Online', 'Onsite Exclusive'].includes(body.copy_type)) {
          return res.status(400).json({
            success: false,
            message: "Copy type must be one of: Physical, Online, Onsite Exclusive."
          });
        }

        // Validate licensing type if provided
        if (body.licensing_type && !['Pay-to-own', 'Rent', 'Free'].includes(body.licensing_type)) {
          return res.status(400).json({
            success: false,
            message: "Licensing type must be one of: Pay-to-own, Rent, Free."
          });
        }

        // Validate tags if provided
        if (body.tags && Array.isArray(body.tags)) {
          const validTagTypes = ['primary', 'secondary'];
          for (const tag of body.tags) {
            if (!tag.name || typeof tag.name !== 'string') {
              return res.status(400).json({
                success: false,
                message: "Each tag must have a name."
              });
            }
            if (tag.type && !validTagTypes.includes(tag.type)) {
              return res.status(400).json({
                success: false,
                message: "Tag type must be either 'primary' or 'secondary'."
              });
            }
          }
        }

        // Validate access links if provided
        if (body.access_links && Array.isArray(body.access_links)) {
          const validLinkTypes = ['purchase', 'read', 'download', 'preview', 'audiobook'];
          for (const link of body.access_links) {
            if (!link.platform || !link.url || !link.type) {
              return res.status(400).json({
                success: false,
                message: "Each access link must have platform, url, and type fields."
              });
            }
            if (!validLinkTypes.includes(link.type)) {
              return res.status(400).json({
                success: false,
                message: "Access link type must be one of: purchase, read, download, preview, audiobook."
              });
            }
          }
        }
      }

      // Review validation
      if (req.path.includes('/reviews') || req.path.includes('reviews')) {
        if (!body.book_id || typeof body.book_id !== 'number') {
          return res.status(400).json({
            success: false,
            message: "Book ID is required and must be a number."
          });
        }

        if (!body.user_name || typeof body.user_name !== 'string' || body.user_name.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "User name is required and must be a non-empty string."
          });
        }

        if (!body.review || typeof body.review !== 'string' || body.review.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Review content is required and must be a non-empty string."
          });
        }

        if (!body.rating || typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
          return res.status(400).json({
            success: false,
            message: "Review rating is required and must be a number between 1 and 5."
          });
        }

        // Validate source if provided
        if (body.source) {
          const validSources = ['Amazon Review', 'Goodreads', 'O\'Reilly Review', 'ACM Digital Library',
            'Harvard Business Review', 'Psychology Today', 'IEEE Xplore', 'Stanford CS Review'];
          if (!validSources.includes(body.source)) {
            return res.status(400).json({
              success: false,
              message: "Review source must be a valid platform name."
            });
          }
        }
      }
    }


    // Add pagination metadata and smart search for GET requests
    if (req.method === 'GET') {
      const originalJson = res.json;
      let jsonOverridden = false;

      res.json = function (data) {
        // Prevent double override
        if (jsonOverridden) {
          return originalJson.call(this, data);
        }
        jsonOverridden = true;

        // Add pagination headers for array responses
        if (Array.isArray(data) && (req.query._page || req.query._limit)) {
          const page = parseInt(req.query._page) || 1;
          const limit = parseInt(req.query._limit) || 10;
          const totalCount = data.length;
          const totalPages = Math.ceil(totalCount / limit);

          res.setHeader('X-Total-Count', totalCount);
          res.setHeader('X-Total-Pages', totalPages);
          res.setHeader('X-Current-Page', page);
          res.setHeader('X-Per-Page', limit);
        }

        // Apply book search enhancement
        if (req.path.includes('/books') && Array.isArray(data)) {
          data = enhanceBookSearchResults(data, req.query);
        }

        return originalJson.call(this, data);
      };
    }


    next();
  }, delay);
};

// Helper function for smart search and relevance scoring
function enhanceBookSearchResults(books, query) {
  let enhancedBooks = [...books];

  // Apply enhanced search if query parameters are present
  if (query.search || query.smart_search || query.recommend_for_user_id) {
    enhancedBooks = applySmartSearch(enhancedBooks, query);
  }

  // Apply partial matching for tags
  if (query['tags.name_like']) {
    const searchTerm = query['tags.name_like'].toLowerCase();
    enhancedBooks = enhancedBooks.filter(book =>
      book.tags && book.tags.some(tag =>
        tag.name.toLowerCase().includes(searchTerm)
      )
    );
  }

  // Apply description search
  if (query['description_like']) {
    const searchTerm = query['description_like'].toLowerCase();
    enhancedBooks = enhancedBooks.filter(book =>
      book.description && book.description.toLowerCase().includes(searchTerm)
    );
  }

  // Apply author search
  if (query['author_like']) {
    const searchTerm = query['author_like'].toLowerCase();
    enhancedBooks = enhancedBooks.filter(book =>
      book.author && book.author.toLowerCase().includes(searchTerm)
    );
  }

  // Apply user preferences filtering
  if (query.user_preferences) {
    enhancedBooks = applyUserPreferences(enhancedBooks, query.user_preferences);
  }

  // Apply recommendations based on mock user ID
  if (query.recommend_for_user_id) {
    enhancedBooks = generateRecommendations(enhancedBooks, query.recommend_for_user_id);
  }

  // Apply relevance scoring if sorting by relevance
  if (query._sort === 'relevance' && (query.q || query.smart_search)) {
    enhancedBooks = applyRelevanceScoring(enhancedBooks, query.q || query.smart_search);
  }

  return enhancedBooks;
}

// Smart search function that combines multiple fields
function applySmartSearch(books, query) {
  const searchTerm = query.search || query.smart_search || query.q;
  if (!searchTerm) return books;

  const searchLower = searchTerm.toLowerCase();
  return books.map(book => {
    let relevanceScore = 0;

    // Title match (highest weight)
    if (book.title && book.title.toLowerCase().includes(searchLower)) {
      relevanceScore += 10;
      if (book.title.toLowerCase() === searchLower) relevanceScore += 20; // Exact match bonus
    }

    // Author match (high weight)
    if (book.author && book.author.toLowerCase().includes(searchLower)) {
      relevanceScore += 8;
    }

    // Description match (medium weight)
    if (book.description) {
      const descMatches = (book.description.toLowerCase().match(new RegExp(searchLower, 'g')) || []).length;
      relevanceScore += Math.min(descMatches * 2, 6); // Cap description matches
    }

    // Tag match (medium weight)
    if (book.tags) {
      book.tags.forEach(tag => {
        if (tag.name && tag.name.toLowerCase().includes(searchLower)) {
          relevanceScore += 5;
        }
      });
    }

    return { ...book, _relevanceScore: relevanceScore };
  }).filter(book => book._relevanceScore > 0);
}

// User preferences filtering
function applyUserPreferences(books, preferences) {
  const prefTags = preferences.split(',').map(p => p.trim().toLowerCase());

  return books.map(book => {
    let preferenceScore = 0;

    if (book.tags) {
      book.tags.forEach(tag => {
        if (prefTags.includes(tag.name.toLowerCase())) {
          preferenceScore += tag.type === 'primary' ? 10 : 5;
        }
      });
    }

    return { ...book, _preferenceScore: preferenceScore };
  }).filter(book => book._preferenceScore > 0);
}

// Generate recommendations based on mock user ID
function generateRecommendations(books, userId) {
  // Mock user profiles based on ID
  const userProfiles = {
    '123': { interests: ['Web Development', 'JavaScript', 'Frontend'], level: 'intermediate' },
    '456': { interests: ['Backend Development', 'PHP', 'Database'], level: 'beginner' },
    '789': { interests: ['Clean Code', 'Software Engineering', 'Best Practices'], level: 'advanced' },
    '101': { interests: ['Web Design', 'HTML', 'CSS'], level: 'beginner' },
    '202': { interests: ['Vue.js', 'Frontend Frameworks'], level: 'intermediate' }
  };

  const userProfile = userProfiles[userId] || { interests: ['Programming'], level: 'intermediate' };

  return books.map(book => {
    let recommendationScore = 0;

    if (book.tags) {
      book.tags.forEach(tag => {
        if (userProfile.interests.includes(tag.name)) {
          recommendationScore += tag.type === 'primary' ? 15 : 8;
        }
      });
    }

    // Boost rating-based recommendations for advanced users
    if (userProfile.level === 'advanced' && book.rating >= 4.5) {
      recommendationScore += 10;
    }

    // Boost beginner-friendly books for beginners
    if (userProfile.level === 'beginner' && book.rating >= 4.0) {
      recommendationScore += 8;
    }

    return { ...book, _recommendationScore: recommendationScore };
  }).filter(book => book._recommendationScore > 0);
}

// Apply relevance scoring sorting
function applyRelevanceScoring(books, searchTerm) {
  return books.sort((a, b) => (b._relevanceScore || 0) - (a._relevanceScore || 0));
}