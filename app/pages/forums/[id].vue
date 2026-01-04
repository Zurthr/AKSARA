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
              <textarea
                v-model="newComment"
                placeholder="Add a comment..."
                :disabled="isPostingComment"
                rows="3"
              ></textarea>
              <div class="input-actions">
                <button
                  class="btn-post"
                  :disabled="!canSubmitComment"
                  @click="handleSubmitComment"
                >
                  {{ isPostingComment ? 'Posting...' : 'Post' }}
                </button>
              </div>
            </div>
          </div>
          <p v-if="commentError" class="error-message">{{ commentError }}</p>

          <div class="comments-list">
            <div v-for="comment in visibleComments" :key="comment.id" class="comment-item">
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

    <div v-if="showLoginModal" class="modal-overlay" @click="closeLoginModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Login Required</h2>
          <button class="btn-close" @click="closeLoginModal" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p class="modal-copy">Please sign in to post a comment.</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeLoginModal">Cancel</button>
          <button class="btn-primary" @click="handleLoginRedirect">Go to Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/composables/useAuth';

const route = useRoute();
const router = useRouter();
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
  id: number | string;
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

interface ThreadAuthorProfile {
  displayName?: string;
  avatarUrl?: string | null;
}

interface ThreadAuthor {
  id: string;
  email?: string;
  profile?: ThreadAuthorProfile;
}

interface ThreadComment {
  id: string;
  content: string;
  threadId?: string;
  author?: ThreadAuthor;
  createdAt?: string;
}

interface ThreadCommunity {
  id: string;
  name: string;
  description?: string;
}

interface ThreadResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    content: string;
    communityId: string;
    authorId: string;
    isPinned?: boolean;
    stars?: number;
    createdAt: string;
    updatedAt: string;
    related_books?: number[] | null;
    social_mentions?: SocialMention[] | null;
    community?: ThreadCommunity;
    author?: ThreadAuthor;
    comments?: ThreadComment[];
    _count?: {
      comments?: number;
    };
  };
}

const formatTimeAgo = (value?: string) => {
  if (!value) return 'just now';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'just now';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays} d ago`;
};

const resolveAuthorName = (author?: ThreadAuthor) => {
  return author?.profile?.displayName || author?.email || 'Unknown';
};

const resolveAvatar = (author?: ThreadAuthor) => {
  if (author?.profile?.avatarUrl) return author.profile.avatarUrl;
  return `https://i.pravatar.cc/150?u=${author?.id || 'aksara'}`;
};

const { data: threadResponse, error, refresh } = await useFetch<ThreadResponse>(`${contentApiBase}/threads/${postId}`);

if (error.value) {
  console.error('Error fetching thread:', error.value);
}

const thread = computed(() => threadResponse.value?.data ?? null);

const post = computed<Post | null>(() => {
  if (!thread.value) return null;

  return {
    id: thread.value.id,
    author: {
      name: resolveAuthorName(thread.value.author),
      avatar: resolveAvatar(thread.value.author),
      tagline: thread.value.community?.name || 'Community'
    },
    timeAgo: formatTimeAgo(thread.value.createdAt),
    title: thread.value.title,
    content: thread.value.content,
    tags: thread.value.community?.name
      ? [{ label: thread.value.community.name, type: 'community' }]
      : [],
    stars: thread.value.stars || 0,
    stats: {
      comments: thread.value._count?.comments ?? (thread.value.comments?.length || 0),
      likes: thread.value.stars || 0,
      shares: 0
    },
    community_id: thread.value.communityId,
    related_books: thread.value.related_books || undefined,
    created_at: thread.value.createdAt,
    updated_at: thread.value.updatedAt,
    social_mentions: thread.value.social_mentions || undefined
  };
});

// Fetch social mentions from sosmed.json if post has social_mention_ids
const socialMentions = computed(() => thread.value?.social_mentions || []);

// Fetch related community
const relatedCommunity = computed<Community | null>(() => {
  if (!thread.value?.community) return null;

  return {
    id: thread.value.community.id,
    name: thread.value.community.name,
    icon: 'chat',
    members: '0'
  };
});

// Fetch related books
const relatedBooks = ref<Book[] | null>(null);
watch(
  () => thread.value?.related_books,
  async (related) => {
    if (!related?.length) {
      relatedBooks.value = null;
      return;
    }

    const query = related.map(id => `id=${id}`).join('&');
    try {
      relatedBooks.value = await $fetch<Book[]>(`${contentApiBase}/books?${query}`);
    } catch (fetchError) {
      console.error('Error fetching related books:', fetchError);
      relatedBooks.value = null;
    }
  },
  { immediate: true }
);

interface Comment {
  id: number | string;
  post_id?: number | string;
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

const comments = computed<Comment[]>(() => {
  if (!thread.value?.comments?.length) return [];

  return thread.value.comments.map((comment) => ({
    id: comment.id,
    post_id: comment.threadId || thread.value?.id,
    author: {
      name: resolveAuthorName(comment.author),
      avatar: resolveAvatar(comment.author),
      isPro: false
    },
    timeAgo: formatTimeAgo(comment.createdAt),
    text: comment.content,
    likes: 0,
    replies: []
  }));
});

const newComment = ref('');
const isPostingComment = ref(false);
const commentError = ref('');
const accessToken = useState<string | null>('auth_access_token');
const authUser = useState<User | null>('auth_user');
const optimisticComments = ref<Comment[]>([]);
const showLoginModal = ref(false);
const canSubmitComment = computed(() => newComment.value.trim().length > 0 && !isPostingComment.value);
const auth = useAuth();

const buildOptimisticComment = (content: string): Comment => {
  const authorName = authUser.value?.profile?.displayName || authUser.value?.email || 'You';
  const authorAvatar = authUser.value?.profile?.avatarUrl || `https://i.pravatar.cc/150?u=${authUser.value?.id || 'me'}`;

  return {
    id: `temp-${Date.now()}`,
    post_id: thread.value?.id,
    author: {
      name: authorName,
      avatar: authorAvatar
    },
    timeAgo: 'just now',
    text: content,
    likes: 0,
    replies: []
  };
};

const visibleComments = computed(() => {
  const merged = [...optimisticComments.value, ...comments.value];
  const seen = new Set<string>();
  return merged.filter((comment) => {
    const key = String(comment.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
});

const handleSubmitComment = async () => {
  if (!canSubmitComment.value) return;
  const sessionOk = await auth.ensureValidSession();
  if (!sessionOk || !accessToken.value) {
    commentError.value = '';
    showLoginModal.value = true;
    return;
  }

  commentError.value = '';
  isPostingComment.value = true;
  const content = newComment.value.trim();
  const optimistic = buildOptimisticComment(content);
  optimisticComments.value = [optimistic, ...optimisticComments.value];

  try {
    await $fetch(`${contentApiBase}/threads/${postId}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        content
      }
    });

    newComment.value = '';
    await refresh();
    optimisticComments.value = optimisticComments.value.filter((comment) => comment.id !== optimistic.id);
  } catch (postError: any) {
    optimisticComments.value = optimisticComments.value.filter((comment) => comment.id !== optimistic.id);
    commentError.value = postError?.data?.message || postError?.message || 'Failed to post comment.';
  } finally {
    isPostingComment.value = false;
  }
};

const closeLoginModal = () => {
  showLoginModal.value = false;
};

const handleLoginRedirect = () => {
  showLoginModal.value = false;
  router.push('/auth/login');
};

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

.input-box:focus-within {
  border-color: #FFDA49;
  box-shadow: 0 0 0 3px rgba(255, 218, 73, 0.2);
}

.input-box textarea {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #0f172a;
  resize: none;
  min-height: 64px;
}

.input-box textarea::placeholder {
  color: #94a3b8;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}

.modal-content {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 24px 24px;
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.18);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
}

.modal-copy {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  background: #f1f5f9;
  color: #0f172a;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.btn-primary {
  background: #FFDA49;
  color: var(--color-black);
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 700;
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
