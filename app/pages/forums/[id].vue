<template>
  <div class="forum-page">
    <div class="forum-container">
      <main class="forum-main">
        <ForumPost :post="post" />

        <div class="comments-section">
          <div class="comments-header">
            <h3>Comments ({{ comments.length }})</h3>
            <div class="sort-options">
              <button class="active">Top</button>
              <button>Newest</button>
            </div>
          </div>

          <div class="comment-input-wrapper">
            <img src="https://i.pravatar.cc/150?u=me" alt="Me" class="user-avatar">
            <div class="input-box">
              <input type="text" placeholder="Add a comment...">
              <div class="input-actions">
                <button class="btn-post">Post</button>
              </div>
            </div>
          </div>

          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">
                <img :src="comment.author.avatar" :alt="comment.author.name">
              </div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author" :class="{ 'is-pro': comment.author.isPro }">
                    {{ comment.author.name }}
                    <span v-if="comment.author.isPro" class="pro-badge">PRO</span>
                  </span>
                  <span class="comment-time">{{ comment.timeAgo }}</span>
                </div>
                <p class="comment-text">{{ comment.text }}</p>
                <div class="comment-actions">
                  <button class="action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    {{ comment.likes }}
                  </button>
                  <button class="action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>
                  </button>
                  <button class="action-btn">Reply</button>
                </div>

                <!-- Nested replies -->
                <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                  <div v-for="reply in comment.replies" :key="reply.id" class="comment-item reply-item">
                     <div class="comment-avatar">
                        <img :src="reply.author.avatar" :alt="reply.author.name">
                      </div>
                      <div class="comment-content">
                        <div class="comment-header">
                          <span class="comment-author">{{ reply.author.name }}</span>
                          <span class="comment-time">{{ reply.timeAgo }}</span>
                        </div>
                        <p class="comment-text">{{ reply.text }}</p>
                        <div class="comment-actions">
                           <button class="action-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                            {{ reply.likes }}
                          </button>
                          <button class="action-btn">Reply</button>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ForumRightSidebar />
    </div>
  </div>
</template>

<script setup lang="ts">
const post = {
  author: {
    name: "User123",
    avatar: "https://i.pravatar.cc/150?u=user123",
    badge: "PRO"
  },
  timeAgo: "2 hours ago",
  title: "The Evolution of Indonesian Literature in the Digital Age",
  content: "In recent years, we've seen a significant shift in how Indonesian literature is consumed and produced. The rise of digital platforms has democratized access to stories, but has it diluted the quality? From Wattpad sensations to Twitter threads becoming novels, the landscape is changing rapidly. What are your thoughts on this evolution?",
  tags: ["Literature", "Indonesia", "Digital"],
  stats: {
    comments: 21,
    likes: 50,
    shares: 12
  }
};

const comments = [
  {
    id: 1,
    author: {
      name: "SastraLover",
      avatar: "https://i.pravatar.cc/150?u=sastra",
      isPro: false
    },
    timeAgo: "1 hour ago",
    text: "This is such an important discussion! I think digital platforms have actually helped discover new voices that wouldn't have been published otherwise.",
    likes: 15,
    replies: [
      {
        id: 11,
        author: {
          name: "BookWorm99",
          avatar: "https://i.pravatar.cc/150?u=bookworm",
        },
        timeAgo: "45 min ago",
        text: "Totally agree! Access is key.",
        likes: 5
      }
    ]
  },
  {
    id: 2,
    author: {
      name: "CritiqueMaster",
      avatar: "https://i.pravatar.cc/150?u=critique",
      isPro: true
    },
    timeAgo: "30 min ago",
    text: "While access is great, I do worry about the lack of editorial oversight in some digital spaces. Quantity over quality seems to be the trend.",
    likes: 8,
    replies: []
  }
];
</script>

<style scoped>
.forum-page {
  width: 100%;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100%;
}

.forum-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 24px;
}

.forum-main {
  flex: 1;
  min-width: 0; /* Prevent flex item from overflowing */
}

.comments-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.comments-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.sort-options button {
  background: none;
  border: none;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  padding: 4px 8px;
  font-weight: 500;
}

.sort-options button.active {
  color: #0f172a;
  font-weight: 700;
}

.comment-input-wrapper {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.input-box {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
}

.input-box input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  margin-bottom: 8px;
  font-size: 14px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-post {
  background: #FFDA49;
  color: #0f172a;
  border: none;
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.comment-item {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.comment-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-author {
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
}

.pro-badge {
  background: #fef08a;
  color: #854d0e;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 4px;
  margin-left: 4px;
}

.comment-time {
  font-size: 12px;
  color: #94a3b8;
}

.comment-text {
  font-size: 14px;
  color: #334155;
  line-height: 1.5;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.action-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn:hover {
  color: #0f172a;
}

.replies-list {
  margin-top: 16px;
  border-left: 2px solid #e2e8f0;
  padding-left: 16px;
}

.reply-item {
  margin-bottom: 16px;
}
</style>
