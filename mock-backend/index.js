module.exports = () => ({
  posts: require('./data/posts.json'),
  communities: require('./data/communities.json'),
  events: require('./data/events.json'),
  books: require('./data/books.json'),
  reviews: require('./data/reviews.json'),
  trending: require('./data/trending.json'),
  click_events: require('./data/click_events.json')
});