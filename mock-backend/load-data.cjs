const fs = require('fs');
const path = require('path');

// Load all the separate JSON files
const posts = require('./data/posts.json');
const communities = require('./data/communities.json');
const events = require('./data/events.json');
const books = require('./data/books.json');
const reviews = require('./data/reviews.json');
const comments = require('./data/comments.json');
const trending = require('./data/trending.json');
const click_events = require('./data/click_events.json');

// Combine all data into a single object
const db = {
  posts,
  communities,
  events,
  books,
  reviews,
  comments,
  trending,
  click_events
};

// Write the combined data to db.json
fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));

console.log('✅ db.json has been generated from modular data files');
