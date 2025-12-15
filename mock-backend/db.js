const posts = require('./data/posts.json');
const communities = require('./data/communities.json');
const events = require('./data/events.json');
const books = require('./data/books.json');
const reviews = require('./data/reviews.json');
const comments = require('./data/comments.json');
const trending = require('./data/trending.json');
const click_events = require('./data/click_events.json');

module.exports = () => ({
  posts,
  communities,
  events,
  books,
  reviews,
  comments,
  trending,
  click_events
});