<template>
  <div class="create-embed-cta">
    <div class="cta-content">
      <div class="cta-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </div>

      <div class="cta-text">
        <h3 class="cta-title">Create New Embed</h3>
        <p class="cta-description">
          Share your content with interactive embeds that engage your audience
        </p>
      </div>

      <button
        class="btn-create-embed"
        @click="$emit('create')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Create Embed
      </button>
    </div>

    <div class="cta-features">
      <div class="feature-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Easy to embed</span>
      </div>
      <div class="feature-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Real-time analytics</span>
      </div>
      <div class="feature-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Customizable design</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  create: [];
}>();
</script>

<style scoped>
.create-embed-cta {
  width: 100%;
  background: linear-gradient(135deg, #FFDA49, #FFD23F);
  border-radius: 12px;
  padding: 0;
  margin-bottom: 24px;
  border: none;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px rgba(255, 218, 73, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.create-embed-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 218, 73, 0.3);
}

.cta-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  text-align: center;
  position: relative;
}

.cta-icon {
  margin: 0 auto 16px;
  width: 48px;
  height: 48px;
  background: rgba(59, 83, 121, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.cta-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 8px;
  line-height: 1.3;
}

.cta-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 20px;
}

.btn-create-embed {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}

.btn-create-embed:hover {
  background: #2c3542;
  transform: translateY(-1px);
}

.btn-create-embed:active {
  transform: translateY(0);
}

.cta-features {
  background: rgba(255, 255, 255, 0.5);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.feature-item svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

/* Decorative elements */
.create-embed-cta::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 0;
}

.create-embed-cta::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 0;
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-features {
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .create-embed-cta {
    margin-bottom: 16px;
  }

  .cta-content {
    padding: 16px;
  }

  .cta-title {
    font-size: 16px;
  }

  .cta-description {
    font-size: 13px;
  }

  .btn-create-embed {
    padding: 10px 20px;
    font-size: 13px;
  }

  .cta-features {
    padding: 12px 16px;
  }

  .feature-item {
    font-size: 12px;
  }
}
</style>