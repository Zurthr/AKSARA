<template>
  <div class="index-page">
    <div class="hero-section">
      <h1>Welcome to AKSARA</h1>
      <p>Platform komunitas literasi untuk berbagi dan berdiskusi</p>
      
      <div v-if="!isAuthenticated" class="hero-actions">
        <NuxtLink to="/auth/register" class="btn-primary">Get Started</NuxtLink>
        <NuxtLink to="/auth/login" class="btn-secondary">Sign In</NuxtLink>
      </div>
      
      <div v-else class="hero-actions">
        <NuxtLink to="/dashboard" class="btn-primary">Go to Dashboard</NuxtLink>
        <p class="welcome-text">Welcome back, {{ user?.firstName }}!</p>
      </div>
    </div>
    
    <div class="features-section">
      <h2>Features Available</h2>
      
      <div class="feature-cards">
        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>Forums</h3>
          <p>Join discussions with fellow readers</p>
          <NuxtLink to="/forums" class="feature-link">Explore Forums</NuxtLink>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>Communities</h3>
          <p>Connect with like-minded readers</p>
          <NuxtLink to="/Community" class="feature-link">Browse Communities</NuxtLink>
        </div>
        
        <div class="feature-card coming-soon">
          <div class="feature-icon">📚</div>
          <h3>Literature</h3>
          <p>Discover and review books</p>
          <span class="coming-soon-badge">Coming Soon</span>
        </div>
        
        <div class="feature-card coming-soon">
          <div class="feature-icon">📅</div>
          <h3>Events</h3>
          <p>Attend literary events</p>
          <span class="coming-soon-badge">Coming Soon</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated } = useAuth()
</script>

<style scoped>
.index-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  margin-bottom: 40px;
}

.hero-section h1 {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
}

.hero-section p {
  font-size: 20px;
  opacity: 0.9;
  margin: 0 0 32px 0;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: white;
  color: #667eea;
  padding: 12px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: transparent;
  color: white;
  padding: 12px 32px;
  border: 2px solid white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
}

.welcome-text {
  margin: 0;
  font-size: 18px;
  opacity: 0.9;
}

.features-section {
  text-align: center;
}

.features-section h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
  position: relative;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.feature-card.coming-soon {
  opacity: 0.7;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.feature-card p {
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
}

.feature-link {
  background: #667eea;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.feature-link:hover {
  background: #5a67d8;
}

.coming-soon-badge {
  background: #fbbf24;
  color: #92400e;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px;
  }
  
  .hero-section h1 {
    font-size: 32px;
  }
  
  .hero-section p {
    font-size: 16px;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
  }
  
  .feature-cards {
    grid-template-columns: 1fr;
  }
}
</style>

