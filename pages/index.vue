<template>
  <div class="home-page">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-left">
        <h1>Hi Dev Tools</h1>
        <p class="hero-sub">
          Bộ công cụ nhỏ hỗ trợ Dev & CSKH: gửi thử API, format JSON, xem HTML, màu CSS, decode JWT,
          tạo MD5, rút gọn link, bốc thăm mini game…
        </p>

        <div class="hero-meta">
          <span class="badge">SSR • Nuxt 3 • Vue 3</span>
          <span
            class="badge"
            :class="homeData?.source === 'backend' ? 'badge-success' : 'badge-warning'"
          >
            Data: {{ homeData?.source === 'backend' ? 'Backend api.hifpt.vn' : 'Mock local' }}
          </span>
        </div>

        <div class="hero-actions">
          <NuxtLink to="/tinh-nang/request-api-online" class="btn-primary">
            Thử Request API
          </NuxtLink>
          <NuxtLink to="/tinh-nang/json-formatter" class="btn-secondary">
            Format JSON
          </NuxtLink>
          <NuxtLink to="/tinh-nang/boc-tham" class="btn-ghost">
            Bốc thăm vui 🎁
          </NuxtLink>
        </div>
      </div>

      <div class="hero-right">
        <div class="hero-card">
          <h2>Tổng quan</h2>
          <p class="hero-card-sub">
            Nhóm tính năng được tách rõ: Dev Tools, Support Tools và Trò chơi mini.
          </p>

          <div class="hero-stats">
            <div class="stat">
              <div class="stat-label">Dev Tools</div>
              <div class="stat-value">{{ devCount }}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Support Tools</div>
              <div class="stat-value">{{ supportCount }}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Trò chơi</div>
              <div class="stat-value">{{ gameCount }}</div>
            </div>
          </div>

          <p class="hero-note">
            Dùng nội bộ: Giao diện đơn giản, tập trung vào tốc độ thao tác cho Dev & CSKH.
          </p>
        </div>
      </div>
    </section>

    <!-- FEATURE GROUPS -->
    <section class="features">
      <div
        v-for="group in groupedFeatures"
        :key="group.key"
        class="feature-group"
      >
        <div class="feature-group-header">
          <h2>{{ group.title }}</h2>
          <p class="feature-group-desc">
            {{ group.description }}
          </p>
        </div>

        <div class="feature-menu-grid">
          <NuxtLink
            v-for="feat in group.items"
            :key="feat.key"
            :to="`/tinh-nang/${feat.key}`"
            class="feature-tile"
            :title="feat.description"
          >
            <div class="feature-tile-icon" :style="{ background: feat.bg }">
              <span class="feature-tile-icon-text">
                {{ feat.icon }}
              </span>
            </div>
            <div class="feature-tile-name">
              {{ feat.name }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: homeData } = await useFetch('/api/home')

type FeatureGroupKey = 'dev' | 'support' | 'game'

interface FeatureBase {
  key: string
  name: string
  description: string
  icon: string
  bg: string
  group: FeatureGroupKey
}

// base config cho từng tính năng + icon + nhóm
const featuresBase: FeatureBase[] = [
  // DEV TOOLS
  {
    key: 'request-api-online',
    name: 'Request API',
    description: 'Gửi thử request đến các API công khai, xem header/body response.',
    icon: '🔌',
    bg: '#e6f0ff',
    group: 'dev',
  },
  {
    key: 'json-formatter',
    name: 'JSON',
    description: 'Dán JSON và định dạng lại, highlight đẹp, dễ debug.',
    icon: '🧩',
    bg: '#fff3df',
    group: 'dev',
  },
  {
    key: 'html-viewer',
    name: 'HTML',
    description: 'Dán HTML snippet và xem trước kết quả render.',
    icon: '🧾',
    bg: '#e8f9ff',
    group: 'dev',
  },
  {
    key: 'color-css',
    name: 'Color CSS',
    description: 'Chọn màu, xem mã HEX, RGB, HSL để đưa vào CSS.',
    icon: '🎨',
    bg: '#f3e8ff',
    group: 'dev',
  },
  {
    key: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Dán JWT, decode header & payload, xem claim.',
    icon: '🔐',
    bg: '#e0fbea',
    group: 'dev',
  },
  {
    key: 'md5-generator',
    name: 'MD5',
    description: 'Nhập chuỗi, sinh ra mã băm MD5.',
    icon: '#️⃣',
    bg: '#ffe4f0',
    group: 'dev',
  },

  // SUPPORT TOOLS
  {
    key: 'short-link',
    name: 'Rút gọn link',
    description: 'Tạo link ngắn gọn từ URL dài, thuận tiện gửi khách / đồng nghiệp.',
    icon: '🔗',
    bg: '#e0f2fe',
    group: 'support',
  },

  // GAME
  {
    key: 'boc-tham',
    name: 'Bốc thăm',
    description: 'Nhập danh sách tên và bốc ngẫu nhiên một người trúng thưởng 🎁.',
    icon: '🎁',
    bg: '#fef3c7',
    group: 'game',
  },
]

// merge mô tả từ API (nếu có) + icon định sẵn
const mergedFeatures = computed(() => {
  const apiFeatures = (homeData.value?.features || []) as any[]
  return featuresBase.map((base) => {
    const found = apiFeatures.find((f) => f.key === base.key)
    return {
      ...base,
      description: found?.description || base.description,
    }
  })
})

const groupedFeatures = computed(() => {
  const groups = [
    {
      key: 'dev' as FeatureGroupKey,
      title: 'Dev Tools',
      description: 'Công cụ phục vụ dev: debug API, format JSON, xem HTML, màu sắc, JWT, hash…',
    },
    {
      key: 'support' as FeatureGroupKey,
      title: 'Support Tools',
      description: 'Hỗ trợ CSKH / vận hành: rút gọn link, gửi khách dễ hơn, ít lỗi nhập sai.',
    },
    {
      key: 'game' as FeatureGroupKey,
      title: 'Trò chơi',
      description: 'Mini game nhỏ cho team: bốc thăm ngẫu nhiên, tạo không khí vui vẻ.',
    },
  ]

  const merged = mergedFeatures.value

  return groups
    .map((g) => ({
      ...g,
      items: merged.filter((feat) => feat.group === g.key),
    }))
    .filter((g) => g.items.length > 0)
})

const devCount = computed(
  () => groupedFeatures.value.find((g) => g.key === 'dev')?.items.length ?? 0,
)
const supportCount = computed(
  () => groupedFeatures.value.find((g) => g.key === 'support')?.items.length ?? 0,
)
const gameCount = computed(
  () => groupedFeatures.value.find((g) => g.key === 'game')?.items.length ?? 0,
)
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 16px 40px;
  max-width: 960px;
  margin: 0 auto;
}

/* HERO */

.hero {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.4fr);
  gap: 20px;
  align-items: flex-start;
}

.hero-left h1 {
  font-size: 28px;
  font-weight: 700;
}

.hero-sub {
  margin-top: 8px;
  font-size: 14px;
  color: var(--text-muted);
  max-width: 520px;
}

.hero-meta {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn-primary,
.btn-secondary,
.btn-ghost {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}

.btn-secondary {
  background: transparent;
  color: var(--accent);
  border-color: var(--accent);
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
}

.hero-right {
  display: flex;
  justify-content: flex-end;
}

.hero-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--border-soft);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  width: 100%;
}

.hero-card h2 {
  font-size: 16px;
  margin-bottom: 4px;
}

.hero-card-sub {
  font-size: 13px;
  color: var(--text-muted);
}

.hero-stats {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.stat {
  padding: 8px 8px;
  border-radius: 10px;
  background: #f9fafb;
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
}

.stat-value {
  margin-top: 4px;
  font-size: 18px;
  font-weight: 700;
}

.hero-note {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-muted);
}

/* FEATURE GROUPS */

.features {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-group-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-group-header h2 {
  font-size: 18px;
}

.feature-group-desc {
  font-size: 13px;
  color: var(--text-muted);
}

/* GRID icon kiểu điện thoại */

.feature-menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 12px;
}

.feature-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 12px 8px 10px;
  border-radius: 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  text-decoration: none;
  color: inherit;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    border-color 0.12s ease,
    background 0.12s ease;
}

.feature-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
  border-color: var(--accent-soft, #bfdbfe);
  background: #0206170a;
}

.feature-tile-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-tile-icon-text {
  font-size: 30px;
}

.feature-tile-name {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  max-width: 96px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* RESPONSIVE */

@media (max-width: 768px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero-right {
    order: -1;
  }

  .hero-card {
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  }
}
</style>
