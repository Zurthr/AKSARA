<template>
  <section class="create-community-page">
    <NuxtLink to="/community" class="back-link">&larr; Kembali</NuxtLink>

    <header class="page-header">
      <h1>Buat Komunitas</h1>
      <p>
        Bangun ruang kolaborasi untuk orang-orang dengan minat yang sama. Isi detail di bawah ini
        untuk membantu anggota menemukan komunitasmu.
      </p>
    </header>

    <form class="community-form">
      <div class="form-grid">
        <div class="form-section">
          <label for="name">Nama Komunitas*</label>
          <input id="name" type="text" placeholder="Masukkan nama komunitas" required />
        </div>

        <div class="form-section">
          <label for="description">Deskripsi*</label>
          <textarea
            id="description"
            rows="5"
            placeholder="Jelaskan tujuan dan fokus komunitas. Apa yang menyatukan para anggotanya?"
            required
          ></textarea>
          <p class="hint">Minimal 50 karakter</p>
        </div>

        <div class="form-section">
          <label for="category">Kategori*</label>
          <select id="category" required>
            <option value="" disabled selected>Pilih kategori</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="form-section">
          <label>Logo Komunitas</label>
          <div class="logo-upload">
            <div class="upload-placeholder">
              <span class="upload-icon">🖼️</span>
              <p>Klik untuk mengunggah atau seret & jatuhkan</p>
              <p class="hint">PNG, JPG (maks. 2MB) · Rekomendasi: 400x400px</p>
            </div>
          </div>
        </div>

        <div class="form-section">
          <label>Pengaturan Privasi*</label>
          <div class="privacy-options">
            <label class="privacy-card">
              <input type="radio" name="privacy" value="public" checked />
              <div>
                <p class="privacy-title">Publik</p>
                <p class="privacy-desc">Siapa pun bisa menemukan dan bergabung dengan komunitas ini.</p>
              </div>
            </label>

            <label class="privacy-card">
              <input type="radio" name="privacy" value="private" />
              <div>
                <p class="privacy-title">Privat</p>
                <p class="privacy-desc">Anggota harus meminta akses dan disetujui admin.</p>
              </div>
            </label>
          </div>
        </div>

        <div class="form-section">
          <label>Tag / Topik Minat</label>
          <div class="tag-input">
            <div class="tag-pill" v-for="tag in selectedTags" :key="tag">{{ tag }} ✕</div>
            <input type="text" placeholder="Ketik tag lalu tekan Enter" />
            <button type="button" class="add-tag">+ Tambah</button>
          </div>
          <p class="hint">Tambah hingga 10 tag agar komunitasmu mudah ditemukan.</p>
        </div>
      </div>

      <div class="form-actions">
        <NuxtLink to="/community" class="button ghost">Batal</NuxtLink>
        <button type="submit" class="button primary">Buat Komunitas</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
const categories = [
  'Teknologi',
  'Literatur',
  'Seni & Desain',
  'Pengembangan Diri',
  'Game & Esports',
  'Cosplay & Anime'
];

const selectedTags = ['#WebDev', '#Novel', '#UIUX'];
</script>

<style scoped>
.create-community-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding-bottom: 40px;
}

.back-link {
  color: #3b5379;
  font-weight: 600;
  text-decoration: none;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-black);
}

.page-header p {
  margin-top: 4px;
  color: #475569;
}

.community-form {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  font-weight: 600;
  color: var(--color-black);
}

input[type="text"],
textarea,
select {
  border: 1px solid #d4d4d8;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 14px;
  background: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

textarea {
  resize: vertical;
  min-height: 140px;
}

.logo-upload {
  padding: 24px;
  border: 2px dashed #cbd5f5;
  border-radius: 20px;
  text-align: center;
  background: #f8fafc;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  color: #475569;
}

.upload-icon {
  font-size: 32px;
}

.hint {
  font-size: 12px;
  color: #94a3b8;
}

.privacy-options {
  display: grid;
  gap: 12px;
}

.privacy-card {
  display: flex;
  gap: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  border-radius: 16px;
  background: #f8fafc;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.privacy-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.1);
}

.privacy-card input {
  margin-top: 4px;
}

.privacy-title {
  font-weight: 600;
  color: var(--color-black);
}

.privacy-desc {
  font-size: 13px;
  color: #64748b;
}

.tag-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  border: 1px solid #d4d4d8;
  border-radius: 14px;
  padding: 8px;
  background: #f8fafc;
}

.tag-pill {
  padding: 6px 12px;
  border-radius: 999px;
  background: #e2e8f0;
  color: var(--color-black);
  font-size: 13px;
  font-weight: 600;
}

.tag-input input[type="text"] {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px;
}

.tag-input input[type="text"]:focus {
  outline: none;
}

.add-tag {
  padding: 8px 14px;
  border-radius: 12px;
  border: none;
  background: #3b5379;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.button {
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button.ghost {
  color: #475569;
  background: #e2e8f0;
}

.button.primary {
  background: #3b5379;
  color: #ffffff;
  border: none;
}

@media (max-width: 768px) {
  .community-form {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .button {
    width: 100%;
  }
}
</style>
