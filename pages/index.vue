<template>
  <div class="home-page">
    <!-- HERO -->
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
          <NuxtLink to="/tinh-nang/md5-generator" class="btn-primary">
            Tạo mã MD5
          </NuxtLink>
          <NuxtLink to="/tinh-nang/json-formatter" class="btn-secondary">
            Mở JSON Formatter
          </NuxtLink>
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

    <!-- POSTS -->
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

    <!-- FEATURE MENU (kiểu icon điện thoại) -->
    <section class="section">
      <div class="section-header">
        <h2>Danh sách tính năng</h2>
        <p class="section-sub">Chạm vào icon để mở tool!</p>
      </div>

      <div class="feature-menu-grid">
        <NuxtLink
          v-for="feat in featureItems"
          :key="feat.key"
          :to="`/tinh-nang/${feat.key}`"
          class="feature-menu-item"
        >
          <div class="feature-icon" :style="{ background: feat.bg }">
            <span class="feature-icon-text">{{ feat.icon }}</span>
          </div>
          <div class="feature-label">
            {{ feat.name }}
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: homeData } = await useFetch('/api/home')

// base config cho từng tính năng + icon (dạng menu mobile)
const featuresBase = [
  {
    key: 'request-api-online',
    name: 'Request API',
    description: 'Gửi thử request đến các API công khai, xem header/body response.',
    icon: '🔌',
    bg: '#e6f0ff', // xanh nhạt
  },
  {
    key: 'json-formatter',
    name: 'JSON',
    description: 'Dán JSON và định dạng lại, highlight đẹp, dễ debug.',
    icon: '🧩',
    bg: '#fff3df', // cam nhạt
  },
  {
    key: 'html-viewer',
    name: 'HTML',
    description: 'Dán HTML snippet và xem trước kết quả render.',
    icon: '🧾',
    bg: '#e8f9ff',
  },
  {
    key: 'color-css',
    name: 'Color CSS',
    description: 'Chọn màu, xem mã HEX, RGB, HSL để đưa vào CSS.',
    icon: '🎨',
    bg: '#f3e8ff',
  },
  {
    key: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Dán JWT, decode header & payload, xem claim.',
    icon: '🔐',
    bg: '#e0fbea',
  },
  {
    key: 'md5-generator',
    name: 'MD5',
    description: 'Nhập chuỗi, sinh ra mã băm MD5.',
    icon: '#️⃣',
    bg: '#ffe4f0',
  },
]

// merge mô tả từ API (nếu có) + icon định sẵn
const featureItems = computed(() => {
  const apiFeatures = homeData.value?.features || []
  return featuresBase.map((base) => {
    const found = apiFeatures.find((f: any) => f.key === base.key)
    return {
      ...base,
      description: found?.description || base.description,
    }
  })
})
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* HERO */

.hero {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.5fr);
  gap: 20px;
}

.hero-left h1 {
  font-size: 28px;
  margin-bottom: 6px;
  color: var(--primary-dark);
}

.hero-sub {
  margin: 0;
  color: var(--text-muted);
  max-width: 540px;
  font-size: 13px;
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
  background: var(--primary-soft);
  color: var(--primary-dark);
}

.badge-success {
  background: #e0fbea;
  color: #15803d;
}

.badge-warning {
  background: #fff3df;
  color: #ea580c;
}

.hero-actions {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background: var(--accent);
  color: #ffffff;
  font-weight: 600;
}

.btn-primary:hover {
  filter: brightness(1.05);
}

.btn-secondary {
  background: #ffffff;
  border-color: var(--border-soft);
  color: var(--text-muted);
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.hero-card {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  padding: 14px;
}

.hero-card h3 {
  margin: 0 0 10px;
  font-size: 15px;
}

/* COMMON SECTION */

.section {
  margin-top: 4px;
}

.section h2 {
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--primary-dark);
}

.card {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  padding: 14px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-compact .list-item {
  padding: 8px 0;
  border-bottom: 1px dashed rgba(148, 163, 184, 0.4);
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

/* FEATURE MENU (icon kiểu mobile) */

.section-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.section-sub {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}

.feature-menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px 8px;
  padding: 8px 4px 0;
}

.feature-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  cursor: pointer;
}

.feature-menu-item:hover .feature-icon {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(15, 23, 42, 0.15);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

.feature-icon-text {
  font-size: 26px;
}

.feature-label {
  font-size: 11px;
  color: var(--text);
  line-height: 1.2;
}

/* RESPONSIVE */

@media (max-width: 768px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
