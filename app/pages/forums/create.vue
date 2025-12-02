<template>
  <div class="create-thread-page">
    <div class="page-container">
      <main class="main-content">
        <div class="page-header">
          <h1 class="page-title">Create New Thread</h1>
          <p class="page-subtitle">Share your thoughts and start a discussion with the community</p>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label for="thread-title" class="form-label">Thread Title</label>
            <input 
              type="text" 
              id="thread-title" 
              class="form-input" 
              placeholder="Enter a descriptive title for your thread"
            >
            <span class="form-hint">Make it clear and engaging to attract readers</span>
          </div>

          <div class="form-group">
            <label class="form-label">Content</label>
            <RichTextEditor />
          </div>

          <div class="form-group">
            <label class="form-label">Attachments</label>
            <FileUploader />
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-preview">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            Preview
          </button>
          <div class="right-actions">
            <button class="btn-draft">Save as Draft</button>
            <button class="btn-post">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Post Thread
            </button>
          </div>
        </div>
      </main>

      <CreateThreadSidebar />
    </div>
  </div>
</template>

<style scoped>
.create-thread-page {
  width: 100%;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100%;
}

.page-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 24px;
}

.main-content {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.page-header {
  margin-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 8px;
}

.page-subtitle {
  color: #64748b;
  font-size: 14px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-black);
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #3b82f6;
}

.form-input::placeholder {
  color: #94a3b8;
}

.form-hint {
  font-size: 12px;
  color: #94a3b8;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.right-actions {
  display: flex;
  gap: 12px;
}

.btn-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
}

.btn-preview:hover {
  background: #f1f5f9;
  color: var(--color-black);
}

.btn-draft {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-draft:hover {
  border-color: #94a3b8;
  color: var(--color-black);
}

.btn-post {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2563eb;
  border: none;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-post:hover {
  background: #1d4ed8;
}
</style>
