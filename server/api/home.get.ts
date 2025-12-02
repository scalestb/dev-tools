import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  try {
    const data = await $fetch(`${apiBase}/dev-tools/home`)
    return { ...data, source: 'backend' }
  } catch (e) {
    return {
      source: 'mock',
      announcements: [
        {
          id: 1,
          title: 'Chào mừng đến Hi Tools',
          content: 'Bộ tool cùi mía hỗ trợ dev – version 0.1.0.',
          created_at: '2025-12-02',
        },
      ],
      posts: [
        {
          id: 1,
          title: 'Giới thiệu Test 01',
          slug: 'gioi-thieu-request-api-online',
          created_at: '2025-12-01',
        },
        {
          id: 2,
          title: 'JSON Formatter Test 02',
          slug: 'json-formatter-cho-log-hi-fpt',
          created_at: '2025-12-01',
        },
      ],
            features: [
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
        {
          key: 'short-link',
          name: 'Rút gọn link',
          description: 'Tạo link ngắn gọn từ URL dài, thuận tiện chia sẻ.',
        },
        {
          key: 'boc-tham',
          name: 'Bốc thăm',
          description: 'Nhập danh sách tên và bốc ngẫu nhiên một người trúng thưởng.',
        },
      ],
    }
  }
})
