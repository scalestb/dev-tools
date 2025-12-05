<template>
  <div class="short-open-page">
    <div class="card">
      <h1 class="title">
        {{ info?.title || 'Đang chuyển hướng…' }}
      </h1>

      <p class="desc">
        {{ info?.description || 'Hệ thống đang chuyển hướng bạn tới đường dẫn gốc.' }}
      </p>

      <div v-if="info?.image" class="thumb">
        <img :src="info.image" alt="Preview" />
      </div>

      <div v-if="info?.url" class="target">
        <p class="label">Đường dẫn đích:</p>
        <a
          :href="info.url"
          class="link mono"
        >
          {{ info.url }}
        </a>
      </div>

      <p class="note">
        Bạn sẽ được chuyển hướng tự động trong 0.3 giây.
        Nếu không, hãy bấm vào link phía trên.
      </p>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ShortLinkOpenResponse {
  id: string
  title: string
  description: string
  image: string | null
  url: string
}

const route = useRoute()
const id = computed(() => route.params.id as string)

// Gọi API BE để lấy thông tin shortlink
// Giả sử anh làm sẵn 1 endpoint Nuxt server: /api/short-link/resolve
// (endpoint này sẽ gọi tiếp sang hệ thống Hi FPT thực tế)
const { data, error } = await useAsyncData(
  `short-link-open-${id.value}`,
  () =>
    $fetch<ShortLinkOpenResponse>('/api/short-link/resolve', {
      params: { id: id.value },
    }),
)

// data.value là kết quả từ BE
const info = computed(() => data.value || null)

const defaultTitle = 'Đang chuyển hướng…'
const defaultDescription = 'Hệ thống đang chuyển hướng bạn tới đường dẫn gốc.'
const defaultImage =
  'https://hi-static.fpt.vn/hi-dev-tools/short-link-default.png'

// SEO meta (SSR)
useSeoMeta({
  title: () => info.value?.title || defaultTitle,
  ogTitle: () => info.value?.title || defaultTitle,
  description: () => info.value?.description || defaultDescription,
  ogDescription: () => info.value?.description || defaultDescription,
  ogImage: () => info.value?.image || defaultImage,
  twitterCard: 'summary_large_image',
})

// Meta refresh để trình duyệt tự redirect (kể cả khi không có JS – SEO vẫn index meta)
if (info.value?.url) {
  useHead({
    meta: [
      {
        'http-equiv': 'refresh',
        content: `0.3;url=${info.value.url}`,
      },
    ],
  })
}

const errorMessage = computed(() => {
  if (!error.value) return ''
  // 404 từ backend -> cho Nuxt trả luôn 404
  if ((error.value as any).statusCode === 404) {
    return 'Shortlink không tồn tại hoặc đã hết hạn.'
  }
  return 'Có lỗi xảy ra khi lấy thông tin shortlink.'
})

// Redirect client-side sau 0.3s
const redirect = (url: string) => {
  if (typeof window === 'undefined') return
  setTimeout(() => {
    window.location.href = url
  }, 300)
}

onMounted(() => {
  if (info.value?.url) {
    redirect(info.value.url)
  }
})

// Nếu data fetch xong sau khi mounted (CSR navigate) thì watch thêm
watch(
  () => info.value?.url,
  (url) => {
    if (url) {
      redirect(url)
    }
  },
)
</script>

<style scoped>
.short-open-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: radial-gradient(circle at top, #eff6ff 0, #f9fafb 40%, #e5e7eb 100%);
}

.card {
  max-width: 520px;
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 18px 18px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.desc {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 12px;
}

.thumb {
  margin-bottom: 12px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}

.thumb img {
  display: block;
  width: 100%;
  max-height: 220px;
  object-fit: cover;
}

.target {
  margin-bottom: 8px;
}

.label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

.link {
  font-size: 13px;
  color: #2563eb;
  text-decoration: underline;
  word-break: break-all;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
}

.note {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.error {
  margin-top: 10px;
  font-size: 13px;
  color: #b91c1c;
}
</style>
