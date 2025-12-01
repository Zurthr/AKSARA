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

      // Event validation
      if (req.path.includes('/events') || req.path.includes('events')) {
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

    // Add pagination metadata for GET requests
    if (req.method === 'GET' && req.path.includes('/')) {
      const originalJson = res.json;
      res.json = function(data) {
        if (Array.isArray(data)) {
          const page = parseInt(req.query._page) || 1;
          const limit = parseInt(req.query._limit) || 10;
          const totalCount = data.length;
          const totalPages = Math.ceil(totalCount / limit);

          res.setHeader('X-Total-Count', totalCount);
          res.setHeader('X-Total-Pages', totalPages);
          res.setHeader('X-Current-Page', page);
          res.setHeader('X-Per-Page', limit);
        }
        return originalJson.call(this, data);
      };
    }

    // Custom error responses for common scenarios
    const originalStatus = res.status;
    res.status = function(code) {
      if (code === 404) {
        return originalStatus.call(this, 404).json({
          success: false,
          message: "Resource not found."
        });
      }

      if (code === 500) {
        return originalStatus.call(this, 500).json({
          success: false,
          message: "Internal server error. Please try again later."
        });
      }

      return originalStatus.call(this, code);
    };

    next();
  }, delay);
};