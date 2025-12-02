const posts = require('./data/posts.json');
const communities = require('./data/communities.json');
const events = require('./data/events.json');
const books = require('./data/books.json');
const reviews = require('./data/reviews.json');
const trending = require('./data/trending.json');

module.exports = () => ({
  posts,
  communities,
  events,
  books,
  reviews,
  trending
});