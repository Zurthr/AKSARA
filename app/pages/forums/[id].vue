<template>
  <div class="forum-page">
    <div class="forum-container">
      <main class="forum-main">
        <div v-if="post">
          <ForumPost :post="post" />
        </div>
        <div v-else>
          Loading...
        </div>

        <div class="comments-section">
          <div class="comments-header">
            <h3>Comments ({{ comments?.length || 0 }})</h3>
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
            <div v-for="comment in comments || []" :key="comment.id" class="comment-item">
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

      <ForumRightSidebar 
        :related-community="relatedCommunity"
        :related-books="relatedBooks"
        :social-mentions="socialMentions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const postId = route.params.id;

interface SocialMention {
  id: number;
  platform: 'twitter' | 'reddit';
  topic?: string;
  author_name?: string;
  author_handle?: string;
  author_avatar?: string;
  content?: string;
  date?: string;
  url?: string;
  stats?: {
    replies: number | string;
    retweets: number | string;
    likes: number | string;
  };
  subreddit?: string;
  subreddit_members?: string;
  subreddit_icon?: string;
  title?: string;
  image?: string;
  comment_count?: string;
}

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    tagline: string;
  };
  timeAgo: string;
  title: string;
  content: string;
  tags: Array<{ label: string; type: string }>;
  stars: number;
  community_id: string;
  related_books?: number[];
  created_at: string;
  updated_at: string;
  social_mention_ids?: number[];
  social_mentions?: SocialMention[];
}

const contentApiBase = useContentApiBase()
const { data: post, error } = await useFetch<Post>(`${contentApiBase}/posts/${postId}`);

if (error.value) {
  console.error('Error fetching post:', error.value);
}

// Fetch social mentions from sosmed.json if post has social_mention_ids
const socialMentions = ref<SocialMention[]>([]);
if (post.value?.social_mention_ids?.length) {
  const { data: sosmedData } = await useFetch<{ social_mentions: SocialMention[] }>(`${contentApiBase}/sosmed`);
  if (sosmedData.value?.social_mentions) {
    socialMentions.value = sosmedData.value.social_mentions.filter(
      (mention) => post.value?.social_mention_ids?.includes(mention.id)
    );
  }
} else if (post.value?.social_mentions) {
  // Fallback for old format with embedded social_mentions
  socialMentions.value = post.value.social_mentions as SocialMention[];
}

// Fetch related community
const relatedCommunity = ref<Community | null>(null);
if (post.value?.community_id) {
  const { data } = await useFetch<Community>(`${contentApiBase}/communities/${post.value.community_id}`);
  relatedCommunity.value = data.value ?? null;
}

// Fetch related books
const relatedBooks = ref<Book[] | null>(null);
if (post.value?.related_books?.length) {
  const query = post.value.related_books.map(id => `id=${id}`).join('&');
  const { data } = await useFetch<Book[]>(`${contentApiBase}/books?${query}`);
  relatedBooks.value = data.value ?? null;
}

interface Comment {
  id: number;
  post_id: number;
  author: {
    name: string;
    avatar: string;
    isPro?: boolean;
  };
  timeAgo: string;
  text: string;
  likes: number;
  replies: Comment[];
}

const { data: comments, error: commentsError } = await useFetch<Comment[]>(`${contentApiBase}/posts/${postId}/comments`);

if (commentsError.value) {
  console.error('Error fetching comments:', commentsError.value);
}

interface Community {
  id: string;
  name: string;
  icon: string;
  members: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
}

interface ExternalPost {
  id: number;
  platform: string;
  user?: {
    name: string;
    handle: string;
    avatar: string;
  };
  subreddit?: {
    name: string;
    members: string;
    avatar: string;
  };
  content?: string;
  title?: string;
  image?: string;
  date?: string;
  stats: {
    replies?: number;
    retweets?: number;
    likes?: number;
    comments?: string | number;
    views?: string;
  };
}

// Fetch external posts
const { data: externalPosts } = await useFetch<ExternalPost[]>(`${contentApiBase}/external-posts?post_id=${postId}`);
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
  background: transparent;
  padding: 24px 0;
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
  color: var(--color-black);
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
  color: var(--color-black);
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
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Add subtle shadow to input box itself since container is gone */
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
  color: var(--color-black);
  border: none;
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  position: relative; /* For thread line positioning if needed, but flex gap handles basic spacing */
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
  color: var(--color-black);
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
  color: var(--color-black);
  background-color: rgba(0,0,0,0.03); /* Hover effect since no card bg */
  border-radius: 4px;
  padding: 2px 4px;
  margin: -2px -4px; /* Offset padding to prevent layout shift */
}

.replies-list {
  margin-top: 16px;
  border-left: 2px solid #e2e8f0; /* Thread line */
  padding-left: 24px; /* Space for line */
  margin-left: 4px; /* Align line with parent content */
}

.reply-item {
  margin-bottom: 16px;
}

/* Hover effect for the thread line to make it interactive/clear */
.replies-list:hover {
  border-left-color: #cbd5e1;
}
</style>
