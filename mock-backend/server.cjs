const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');
const routes = require('./routes.json');
const middleware = require('./middleware.js');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Use default middlewares (CORS, static, etc.)
server.use(middlewares);

// IMPORTANT: Parse JSON body BEFORE custom endpoints
server.use(jsonServer.bodyParser);

// Custom endpoint for click_events persistence (BEFORE delay middleware)
server.post('/click_events', (req, res) => {
  try {
    const clickEventPath = path.join(__dirname, 'data', 'click_events.json');
    const dbPath = path.join(__dirname, 'db.json');

    // Read existing click events from persistent file
    let clickEvents = [];
    if (fs.existsSync(clickEventPath)) {
      const data = fs.readFileSync(clickEventPath, 'utf-8');
      clickEvents = JSON.parse(data);
    }

    // Add new event with auto-incrementing ID
    const newEvent = {
      id: clickEvents.length > 0 ? Math.max(...clickEvents.map(e => e.id || 0)) + 1 : 1,
      ...req.body,
      timestamp: req.body.timestamp || new Date().toISOString()
    };

    clickEvents.push(newEvent);

    // Save to persistent file (data/click_events.json)
    fs.writeFileSync(clickEventPath, JSON.stringify(clickEvents, null, 2));

    // Also update db.json for consistency
    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      db.click_events = clickEvents;
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    }

    console.log(`[ClickEvent] Saved: ${newEvent.event_type} - ${newEvent.item_title}`);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('[ClickEvent] Error:', error);
    res.status(500).json({ error: 'Failed to save click event' });
  }
});

// Use custom routes
server.use(jsonServer.rewriter(routes));

// Use custom middleware (with delay) AFTER custom endpoints
server.use(middleware);

// Use default router
server.use(router);

// Start server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server is running on http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   • http://localhost:${PORT}/api/posts`);
  console.log(`   • http://localhost:${PORT}/api/communities`);
  console.log(`   • http://localhost:${PORT}/api/events`);
  console.log(`   • http://localhost:${PORT}/api/books`);
  console.log(`   • http://localhost:${PORT}/api/reviews`);
  console.log(`   • http://localhost:${PORT}/api/trending`);
  console.log(`   • http://localhost:${PORT}/click_events (Persistent tracking)`);
  console.log(`\n💡 Enhanced Search Examples:`);
  console.log(`   • http://localhost:${PORT}/api/books?search=php`);
  console.log(`   • http://localhost:${PORT}/api/books?tags.name_like=Web%20Development`);
  console.log(`   • http://localhost:${PORT}/api/books?recommend_for_user_id=123`);
});