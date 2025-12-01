import jsonServer from 'json-server';
import routes from './routes.json' with { type: 'json' };
import middleware from './middleware.js';

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
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server is running on http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   • http://localhost:${PORT}/api/posts`);
  console.log(`   • http://localhost:${PORT}/api/communities`);
  console.log(`   • http://localhost:${PORT}/api/events`);
  console.log(`   • http://localhost:${PORT}/api/reads`);
  console.log(`   • http://localhost:${PORT}/api/trending`);
});