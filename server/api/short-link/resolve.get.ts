// server/api/short-link/resolve.get.ts
import { getQuery } from 'h3'

interface ShortLinkOpenResponse {
  id: string
  title: string
  description: string
  image: string | null
  url: string
}

/**
 * Mock data cho shortlink
 * Anh có thể thay bằng data thực từ DB hoặc gọi sang hệ thống Hi FPT sau này.
 */
const MOCK_SHORT_LINKS: Record<string, ShortLinkOpenResponse> = {
  // Ví dụ: /l/hddt-otp
  'hddt-otp': {
    id: 'hddt-otp',
    title: 'Hướng dẫn xử lý không nhận OTP ký HĐĐT - Hi FPT',
    description:
      'Hướng dẫn chi tiết cho nhân viên CSKH xử lý trường hợp khách không nhận OTP khi ký hóa đơn điện tử.',
    image:
      'https://hi-static.fpt.vn/hi-dev-tools/shortlink/hddt-otp.png',
    url: 'https://hifpt.vn/huong-dan/khong-nhan-otp-ky-hddt',
  },

  // Ví dụ: /l/hddt-reset-link
  'hddt-reset-link': {
    id: 'hddt-reset-link',
    title: 'Link reset shortlink ký HĐĐT cho CSKH',
    description:
      'Trang hỗ trợ reset shortlink ký hóa đơn điện tử cho nhân viên CSKH Hi FPT.',
    image:
      'https://hi-static.fpt.vn/hi-dev-tools/shortlink/hddt-reset.png',
    url: 'https://hifpt.vn/hddt/reset-shortlink',
  },

  // Ví dụ: /l/dev-tools
  'dev-tools': {
    id: 'dev-tools',
    title: 'Hi Dev Tools - Bộ công cụ cho Dev Hi FPT',
    description:
      'Tổng hợp các công cụ dành cho backend/frontend: rút gọn link, JSON formatter, API tester, QR generator,...',
    image:
      'https://hi-static.fpt.vn/hi-dev-tools/shortlink/dev-tools.png',
    url: 'https://dev-tools.hifpt.vn/',
  },
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawId = query.id

  if (!rawId || (Array.isArray(rawId) && !rawId[0])) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu tham số id',
    })
  }

  const id = Array.isArray(rawId) ? String(rawId[0]) : String(rawId)

  // Nếu id trùng trong mock sẵn -> trả đúng
  if (MOCK_SHORT_LINKS[id]) {
    return MOCK_SHORT_LINKS[id]
  }

  // Nếu không có trong mock -> sinh ra data mặc định, vẫn SEO ổn
  const fallback: ShortLinkOpenResponse = {
    id,
    title: `Shortlink ${id} - Hi Dev Tools`,
    description:
      'Đây là shortlink mock (demo) được tạo từ Hi Dev Tools. Hãy cấu hình backend để trả về dữ liệu thật.',
    image:
      'https://hi-static.fpt.vn/hi-dev-tools/shortlink/default.png',
    url: `https://example.com/short/${encodeURIComponent(id)}`,
  }

  return fallback
})
