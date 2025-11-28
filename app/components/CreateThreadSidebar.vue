<template>
  <aside class="create-thread-sidebar">
    <div class="sidebar-widget community-widget">
      <h3 class="widget-title">Add Community</h3>
      <div class="tags-container">
        <span class="tag">Literacy Circle</span>
        <span class="tag">Culinary Masters</span>
      </div>
      <button class="btn-add-new">ADD NEW</button>
    </div>

    <div class="sidebar-widget books-widget">
      <h3 class="widget-title">Add Books</h3>
      <div class="book-card">
        <div class="book-cover">
          <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Book Cover">
        </div>
        <h4 class="book-title">A Truth on the Pages of Purana</h4>
        <span class="book-tag">Web Development</span>
      </div>
      <button class="btn-add-new">ADD NEW</button>
    </div>
  </aside>
</template>

<style scoped>
.create-thread-sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-widget {
  background: #E6EDF7; /* Light blue background from design */
  border-radius: 16px;
  padding: 20px;
  text-align: center;
}

.widget-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
}

.tag {
  background: #475569;
  color: white;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 16px;
}

.btn-add-new {
  width: 100%;
  background: #FFDA49;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  color: #1e293b;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.book-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.book-cover {
  width: 120px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 12px;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.4;
}

.book-tag {
  background: #1e293b;
  color: white;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 12px;
}
</style>
