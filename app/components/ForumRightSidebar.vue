<template>
  <aside class="forum-sidebar">
    <div class="sidebar-section">
      <h3 class="section-title">Related Topics</h3>
      <div class="related-topic-card">
        <div class="book-cover">
          <!-- Placeholder for book cover -->
          <div class="cover-placeholder"></div>
        </div>
        <div class="topic-info">
          <h4>Indonesian Literature</h4>
          <span class="tag">History</span>
          <button class="btn-subscribe">Subscribe</button>
        </div>
      </div>
    </div>

    <div class="sidebar-section">
      <h3 class="section-title">As seen on...</h3>
      
      <!-- Twitter Card -->
      <div class="social-card twitter-card">
        <div class="card-header">
          <span class="platform-icon twitter-icon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </span>
          <span class="platform-name">Twitter</span>
        </div>
        <div class="tweet-content">
          <div class="user-info">
            <img src="https://i.pravatar.cc/150?u=twitter" alt="User" class="avatar-small">
            <div class="user-details">
              <span class="name">Rafli & Baringbing</span>
              <span class="handle">@rafli_baringbing</span>
            </div>
            <button class="btn-follow">Follow</button>
          </div>
          <p class="tweet-text">aku suka minum pertalite dicampur etanol 100% karena sedap dan bergizi sekali yah anjay anjay cihuy</p>
          <span class="tweet-date">2:55 AM Dec 20, 2020</span>
          <div class="tweet-actions">
            <span><i class="icon-reply"></i> 2</span>
            <span><i class="icon-retweet"></i> 12</span>
            <span><i class="icon-like"></i> 1,213</span>
          </div>
        </div>
      </div>

      <!-- Reddit Card -->
      <div class="social-card reddit-card">
        <div class="card-header">
          <span class="platform-icon reddit-icon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
          </span>
          <span class="platform-name">Reddit</span>
        </div>
        <div class="reddit-content">
          <div class="subreddit-info">
            <img src="https://i.pravatar.cc/150?u=reddit" alt="Subreddit" class="avatar-small">
            <div class="subreddit-details">
              <span class="name">r/AnimalsBeingDerps</span>
              <span class="members">8.4M members</span>
            </div>
            <button class="btn-join">Join</button>
          </div>
          <p class="post-title">Kowalski, where is the door?</p>
          <div class="post-image">
             <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Dog">
          </div>
          <div class="post-actions">
            <span>14k comments</span>
            <span>Share</span>
            <span>Save</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.forum-sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.related-topic-card {
  display: flex;
  gap: 12px;
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.book-cover {
  width: 60px;
  height: 80px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}

.topic-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.topic-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.tag {
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 12px;
  width: fit-content;
}

.btn-subscribe {
  font-size: 12px;
  padding: 4px 12px;
  background: #fef08a;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  width: fit-content;
}

.social-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.platform-icon {
  width: 20px;
  height: 20px;
}

.twitter-icon { color: #1da1f2; }
.reddit-icon { color: #ff4500; }

.platform-name {
  font-weight: 600;
  font-size: 14px;
}

.user-info, .subreddit-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-details, .subreddit-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.name {
  font-size: 12px;
  font-weight: 700;
}

.handle, .members {
  font-size: 11px;
  color: #64748b;
}

.btn-follow, .btn-join {
  background: black;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.tweet-text, .post-title {
  font-size: 13px;
  margin-bottom: 8px;
  line-height: 1.4;
}

.tweet-date {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  margin-bottom: 8px;
}

.tweet-actions, .post-actions {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #64748b;
}

.post-image img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
}
</style>
