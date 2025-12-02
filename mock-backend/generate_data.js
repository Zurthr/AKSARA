const fs = require('fs');
const path = require('path');

const postsPath = path.join(__dirname, 'data', 'posts.json');
const commentsPath = path.join(__dirname, 'data', 'comments.json');

const authors = [
    { name: "Orang Kmplang", avatar: "https://i.pravatar.cc/150?u=kmplang", tagline: "A stupid one" },
    { name: "Alfan Gunadar", avatar: "https://i.pravatar.cc/150?u=alfan", tagline: "Something Vanity!" },
    { name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?u=sarah", tagline: "Photography enthusiast" },
    { name: "John Doe", avatar: "https://i.pravatar.cc/150?u=john", tagline: "Tech Explorer" },
    { name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=jane", tagline: "Bookworm" },
    { name: "Mike Ross", avatar: "https://i.pravatar.cc/150?u=mike", tagline: "Legal Eagle" },
    { name: "Rachel Zane", avatar: "https://i.pravatar.cc/150?u=rachel", tagline: "Foodie" },
    { name: "Harvey Specter", avatar: "https://i.pravatar.cc/150?u=harvey", tagline: "Closer" },
    { name: "Donna Paulsen", avatar: "https://i.pravatar.cc/150?u=donna", tagline: "I know everything" },
    { name: "Louis Litt", avatar: "https://i.pravatar.cc/150?u=louis", tagline: "Cat Lover" }
];

const communities = ["literacy-circle", "gaming-hub", "photography-club", "tech-talk", "food-lovers", "travel-bugs"];

const titles = [
    "Best Books for Aspiring Web Developers",
    "Is FNAF 2 going to debut in Minecraft alongside Herobrine",
    "Tips for Street Photography Beginners",
    "The Future of AI in 2024",
    "Top 10 Hidden Gems in Southeast Asia",
    "How to Cook the Perfect Steak",
    "Why I Switched from iOS to Android",
    "The Art of Minimalist Living",
    "Understanding Quantum Computing",
    "My Journey to Becoming a Senior Dev",
    "Review: The Latest Marvel Movie",
    "Gardening 101: How to Keep Your Plants Alive",
    "The Best Coffee Shops in Tokyo",
    "Fitness Myths You Should Stop Believing",
    "How to Build a PC from Scratch",
    "The Psychology of Color in Design",
    "Why You Should Learn Rust",
    "Travel on a Budget: Tips and Tricks",
    "The History of Video Games",
    "Meditation for Beginners"
];

const contents = [
    "Hey everyone! I've been diving deeper into this topic lately, and I realized there's a ton of great resources out there. Thought I'd share a few and see what you all recommend too!",
    "Okay, so I've been seeing some weird stuff in the latest teasers and community rumors. People are saying there might be a huge update coming soon. What do you think?",
    "Just wanted to share some tips I've learned from my journey over the past year. The most important thing is to be patient and observe your surroundings.",
    "I've been thinking a lot about the future of this industry. With all the new tech coming out, it's hard to keep up. What are your predictions?",
    "I recently visited this amazing place and I have to share it with you all. The food, the people, the views... everything was perfect.",
    "Does anyone else feel like this is getting out of hand? I mean, the prices are skyrocketing and the quality is dropping.",
    "I'm looking for recommendations for a new project I'm working on. Any tools or libraries you swear by?",
    "Here's a quick tutorial on how to get started with this. It's easier than you think!",
    "I'm struggling with this concept. Can anyone explain it in simple terms?",
    "Just finished this book and it blew my mind. Highly recommend it to everyone here."
];

const tagsList = [
    { label: "Tech", type: "category" },
    { label: "Hobbies", type: "category" },
    { label: "Lifestyle", type: "category" },
    { label: "Travel", type: "category" },
    { label: "Food", type: "category" },
    { label: "#New", type: "topic" },
    { label: "#Trending", type: "topic" },
    { label: "#Help", type: "topic" },
    { label: "#Discussion", type: "topic" },
    { label: "#Review", type: "topic" }
];

const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const posts = [];
const comments = [];
let commentIdCounter = 1;

for (let i = 1; i <= 50; i++) {
    const author = authors[Math.floor(Math.random() * authors.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const content = contents[Math.floor(Math.random() * contents.length)];
    const communityId = communities[Math.floor(Math.random() * communities.length)];

    // Random tags (2-4 tags)
    const postTags = [];
    const numTags = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < numTags; j++) {
        postTags.push(tagsList[Math.floor(Math.random() * tagsList.length)]);
    }

    // Random related books (0-3 books)
    const relatedBooks = [];
    const numBooks = Math.floor(Math.random() * 4);
    for (let k = 0; k < numBooks; k++) {
        const bookId = Math.floor(Math.random() * 10) + 1; // Assuming book IDs 1-10 exist
        if (!relatedBooks.includes(bookId)) {
            relatedBooks.push(bookId);
        }
    }

    const createdAt = generateRandomDate(new Date(2023, 0, 1), new Date());

    posts.push({
        id: i,
        author: author,
        timeAgo: `${Math.floor(Math.random() * 23) + 1} hrs ago`, // Simplified
        title: `${title} #${i}`, // Append ID to make unique
        content: content,
        tags: postTags,
        stars: Math.floor(Math.random() * 1000),
        community_id: communityId,
        related_books: relatedBooks,
        created_at: createdAt,
        updated_at: createdAt
    });

    // Generate comments for this post (1-5 comments)
    const numComments = Math.floor(Math.random() * 5) + 1;
    for (let c = 0; c < numComments; c++) {
        const commentAuthor = authors[Math.floor(Math.random() * authors.length)];
        const hasReplies = Math.random() > 0.7;
        const replies = [];

        if (hasReplies) {
            const numReplies = Math.floor(Math.random() * 3) + 1;
            for (let r = 0; r < numReplies; r++) {
                const replyAuthor = authors[Math.floor(Math.random() * authors.length)];
                replies.push({
                    id: commentIdCounter + 1000, // Offset for reply IDs
                    author: {
                        name: replyAuthor.name,
                        avatar: replyAuthor.avatar
                    },
                    timeAgo: `${Math.floor(Math.random() * 59) + 1} min ago`,
                    text: "This is a reply to the comment. Very insightful!",
                    likes: Math.floor(Math.random() * 20)
                });
                commentIdCounter++;
            }
        }

        comments.push({
            id: commentIdCounter,
            post_id: i,
            author: {
                name: commentAuthor.name,
                avatar: commentAuthor.avatar,
                isPro: Math.random() > 0.8
            },
            timeAgo: `${Math.floor(Math.random() * 10) + 1} hours ago`,
            text: "This is a generated comment. " + contents[Math.floor(Math.random() * contents.length)].substring(0, 50) + "...",
            likes: Math.floor(Math.random() * 50),
            replies: replies
        });
        commentIdCounter++;
    }
}

fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2));

console.log('Successfully generated 50 posts and related comments.');
