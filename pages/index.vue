<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-left">
        <h1>Hi Dev Tools</h1>
        <p class="hero-sub">
          Bộ công cụ nhỏ hỗ trợ Dev Hi FPT: gửi thử API, format JSON, xem HTML, màu CSS, decode JWT, tạo MD5…
        </p>

        <div class="hero-meta">
          <span class="badge">SSR • Nuxt 3 • Vue 3</span>
          <span class="badge" :class="homeData?.source === 'backend' ? 'badge-success' : 'badge-warning'">
            Data: {{ homeData?.source === 'backend' ? 'Backend api.hifpt.vn' : 'Mock local' }}
          </span>
        </div>

        <div class="hero-actions">
          <NuxtLink to="/tinh-nang/request-api-online" class="btn-primary">Thử Request API Online</NuxtLink>
          <NuxtLink to="/tinh-nang/json-formatter" class="btn-secondary">Mở JSON Formatter</NuxtLink>
        </div>
      </div>

      <div class="hero-right">
        <div class="hero-card">
          <h3>Thông báo</h3>
          <ul v-if="homeData?.announcements?.length" class="list">
            <li v-for="item in homeData.announcements" :key="item.id" class="list-item">
              <div class="list-title">{{ item.title }}</div>
              <div class="list-meta">{{ item.created_at }}</div>
              <div class="list-content">{{ item.content }}</div>
            </li>
          </ul>
          <p v-else class="empty-text">Chưa có thông báo.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Bài viết mới</h2>
      <div class="card">
        <ul v-if="homeData?.posts?.length" class="list list-compact">
          <li v-for="post in homeData.posts" :key="post.id" class="list-item">
            <div class="list-title">{{ post.title }}</div>
            <div class="list-meta">Ngày: {{ post.created_at }}</div>
          </li>
        </ul>
        <p v-else class="empty-text">Chưa có bài viết.</p>
      </div>
    </section>

    <section class="section">
      <h2>Danh sách tính năng</h2>
      <div class="features-grid">
        <NuxtLink
          v-for="feat in homeData?.features || featuresFallback"
          :key="feat.key"
          :to="`/tinh-nang/${feat.key}`"
          class="feature-card"
        >
          <h3>{{ feat.name }}</h3>
          <p>{{ feat.description }}</p>
          <span class="feature-link">Mở tính năng →</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: homeData } = await useFetch('/api/home')

const featuresFallback = [
  {
    key: 'request-api-online',
    name: 'Request API Online',
    description: 'Gửi thử request đến các API công khai, xem header/body response.',
  },
  {
    key: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Dán JSON và định dạng lại, highlight đẹp, dễ debug.',
  },
  {
    key: 'html-viewer',
    name: 'HTML Viewer',
    description: 'Dán HTML snippet và xem trước kết quả render.',
  },
  {
    key: 'color-css',
    name: 'Color CSS',
    description: 'Chọn màu, xem mã HEX, RGB, HSL để đưa vào CSS.',
  },
  {
    key: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Dán JWT, decode header & payload, xem claim.',
  },
  {
    key: 'md5-generator',
    name: 'MD5 Generator',
    description: 'Nhập chuỗi, sinh ra mã băm MD5.',
  },
]
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.5fr);
  gap: 20px;
}

.hero-left h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.hero-sub {
  margin: 0;
  color: var(--text-muted);
  max-width: 540px;
}

.hero-meta {
  display: flex;
  gap: 8px;
  margin: 12px 0;
  flex-wrap: wrap;
}

.badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
}

.badge-success {
  background: rgba(74, 222, 128, 0.12);
  color: var(--success);
}

.badge-warning {
  background: rgba(249, 115, 22, 0.12);
  color: #fb923c;
}

.hero-actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background: var(--accent);
  color: #020617;
  font-weight: 600;
}

.btn-primary:hover {
  filter: brightness(1.05);
}

.btn-secondary {
  background: transparent;
  border-color: rgba(148, 163, 184, 0.5);
  color: var(--text-muted);
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.hero-card {
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border-soft);
  padding: 16px;
}

.hero-card h3 {
  margin: 0 0 10px;
  font-size: 16px;
}

.section {
  margin-top: 4px;
}

.section h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.card {
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border-soft);
  padding: 16px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-compact .list-item {
  padding: 8px 0;
  border-bottom: 1px dashed rgba(148, 163, 184, 0.3);
}

.list-item:last-child {
  border-bottom: none;
}

.list-title {
  font-size: 14px;
}

.list-meta {
  font-size: 11px;
  color: var(--text-muted);
}

.list-content {
  font-size: 13px;
  color: var(--text-muted);
}

.empty-text {
  font-size: 13px;
  color: var(--text-muted);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.feature-card {
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border-soft);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

.feature-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.3);
}

.feature-card h3 {
  margin: 0;
  font-size: 16px;
}

.feature-card p {
  margin: 0;
  color: var(--text-muted);
}

.feature-link {
  margin-top: 4px;
  font-size: 12px;
  color: var(--accent);
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
