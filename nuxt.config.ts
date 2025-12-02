export default defineNuxtConfig({
  ssr: true,

  devtools: { enabled: true },

  // 👇 Thêm block này
  devServer: {
    port: 3098,
    host: '0.0.0.0', // optional, nếu bạn muốn mở ra cho máy khác truy cập
  },

  runtimeConfig: {
    apiSecret: process.env.API_SECRET || 'dev-secret',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.hifpt.vn',
    },
  },

  app: {
    head: {
      title: 'Hi Tools cho mọi nhà',
      meta: [
        {
          name: 'description',
          content:
            'Bộ tool hỗ trợ Dev: Request API online, JSON formatter, HTML viewer, Color CSS, JWT decoder, MD5 generator.',
        },
      ],
    },
  },
})
