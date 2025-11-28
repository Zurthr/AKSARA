<template>
  <div class="file-uploader">
    <div class="upload-area">
      <div class="icon-wrapper">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="upload-icon">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </div>
      <p class="upload-text">
        Drag and drop files here, or <button class="btn-browse">Browse</button>
      </p>
      <p class="upload-hint">Maximum file size: 10MB. Supported formats: JPG, PNG, GIF, PDF, DOC</p>
    </div>
  </div>
</template>

<style scoped>
.file-uploader {
  width: 100%;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  transition: border-color 0.2s, background-color 0.2s;
}

.upload-area:hover {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.icon-wrapper {
  background: #e2e8f0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.upload-icon {
  color: #64748b;
}

.upload-text {
  font-size: 14px;
  color: #475569;
  margin-bottom: 8px;
}

.btn-browse {
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.btn-browse:hover {
  text-decoration: underline;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
}
</style>
