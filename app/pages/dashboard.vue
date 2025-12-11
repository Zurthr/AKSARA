<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Dashboard</h1>
      <p class="dashboard-subtitle">Welcome back, {{ user?.firstName }}!</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <h3 class="stat-title">Books Read</h3>
          <p class="stat-value">24</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">💭</div>
        <div class="stat-content">
          <h3 class="stat-title">Forum Posts</h3>
          <p class="stat-value">12</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3 class="stat-title">Communities</h3>
          <p class="stat-value">5</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <h3 class="stat-title">Events Joined</h3>
          <p class="stat-value">8</p>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="recent-activity">
        <h2 class="section-title">Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">📖</div>
            <div class="activity-content">
              <p class="activity-text">You finished reading "The Great Gatsby"</p>
              <span class="activity-time">2 hours ago</span>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">💬</div>
            <div class="activity-content">
              <p class="activity-text">Posted in "Book Discussion" forum</p>
              <span class="activity-time">1 day ago</span>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">⭐</div>
            <div class="activity-content">
              <p class="activity-text">Rated "1984" 5 stars</p>
              <span class="activity-time">3 days ago</span>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <NuxtLink to="/literature" class="action-card">
            <div class="action-icon">📚</div>
            <h3 class="action-title">Browse Books</h3>
            <p class="action-description">Discover new literature</p>
          </NuxtLink>
          
          <NuxtLink to="/forums" class="action-card">
            <div class="action-icon">💭</div>
            <h3 class="action-title">Join Discussions</h3>
            <p class="action-description">Participate in forums</p>
          </NuxtLink>
          
          <NuxtLink to="/Community" class="action-card">
            <div class="action-icon">👥</div>
            <h3 class="action-title">Communities</h3>
            <p class="action-description">Connect with readers</p>
          </NuxtLink>
          
          <NuxtLink to="/Events" class="action-card">
            <div class="action-icon">📅</div>
            <h3 class="action-title">Events</h3>
            <p class="action-description">Upcoming book events</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.dashboard-subtitle {
  font-size: 16px;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
}

.stat-title {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 20px;
}

.recent-activity {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
}

.activity-icon {
  font-size: 20px;
}

.activity-text {
  font-size: 14px;
  color: #374151;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #9ca3af;
}

.quick-actions {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.action-card {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

.action-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.action-description {
  font-size: 14px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>