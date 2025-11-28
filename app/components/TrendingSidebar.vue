<template>
  <div class="trending-sidebar">
    <h3 class="sidebar-title">What's <span class="highlight">Trending</span></h3>
    
    <div class="trending-group">
      <span class="group-label">Trending in Western Fiction</span>
      <div class="tags">
        <span class="tag">#HarryPotter</span>
        <span class="tag">#GOTW</span>
      </div>
    </div>

    <div class="trending-group">
      <span class="group-label">Trending in Studies</span>
      <div class="tags">
        <span class="tag">#Calculus</span>
      </div>
    </div>

    <div class="trending-group">
      <span class="group-label">Trending in Health</span>
      <div class="tags">
        <span class="tag">#TrumpVaccine</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trending-sidebar {
  width: 300px;
  padding-left: 24px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 24px;
}

.highlight {
  background-color: #FFDA49;
  padding: 0 4px;
}

.trending-group {
  margin-bottom: 20px;
}

.group-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: #3B5379;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}
</style>
