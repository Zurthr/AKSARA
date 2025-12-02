const jsonServer = require('json-server');
const routes = require('./routes.json');
const middleware = require('./middleware.js');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Use default middlewares (CORS, static, etc.)
server.use(middlewares);

// Use custom middleware
server.use(middleware);

// Use custom routes
server.use(jsonServer.rewriter(routes));

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
  console.log(`\n💡 Enhanced Search Examples:`);
  console.log(`   • http://localhost:${PORT}/api/books?search=php`);
  console.log(`   • http://localhost:${PORT}/api/books?tags.name_like=Web%20Development`);
  console.log(`   • http://localhost:${PORT}/api/books?recommend_for_user_id=123`);
});