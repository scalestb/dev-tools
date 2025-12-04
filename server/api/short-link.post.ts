import { $fetch } from 'ofetch'

type ShortServerKey = 'hi-fpt-1' | 'hi-fpt-2'

interface ShortLinkBody {
  url?: string
  note?: string | null
  server?: ShortServerKey | string
  metaTitle?: string | null
  metaImage?: string | null
}

interface ShortLinkBackendResponse {
  short_url?: string
  shortUrl?: string
  original_url?: string
  longUrl?: string
  data?: {
    short_url?: string
    shortUrl?: string
    original_url?: string
    longUrl?: string
    [key: string]: any
  }
  [key: string]: any
}

/**
 * API rút gọn link
 *
 * Khi FE POST /api/short-link:
 *  - url        : URL gốc bắt buộc
 *  - note       : ghi chú tuỳ chọn
 *  - server     : 'hi-fpt-1' hoặc 'hi-fpt-2'
 *  - metaTitle  : meta title cho SEO
 *  - metaImage  : meta image (url) cho SEO
 *
 * Backend này sẽ forward sang API short-link thực tế ở Hi FPT 1 / Hi FPT 2
 * thông qua các biến môi trường:
 *  - HI_FPT_SHORT_1_BASE
 *  - HI_FPT_SHORT_2_BASE
 *
 * Ví dụ:
 *  HI_FPT_SHORT_1_BASE=https://hifpt-api.fpt.vn/short
 *  HI_FPT_SHORT_2_BASE=https://hifpt-api2.fpt.vn/short
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<ShortLinkBody>(event)

  const rawUrl = (body?.url || '').trim()
  const rawNote = (body?.note || '') || ''
  const metaTitle = (body?.metaTitle || '').trim()
  const metaImage = (body?.metaImage || '').trim()

  if (!rawUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu tham số url',
    })
  }

  // Chuẩn hoá URL: nếu thiếu http/https thì tự thêm https://
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`

  const server: ShortServerKey =
    body?.server === 'hi-fpt-2' ? 'hi-fpt-2' : 'hi-fpt-1'

  const env = process.env
  const hiFpt1Base = env.HI_FPT_SHORT_1_BASE || ''
  const hiFpt2Base = env.HI_FPT_SHORT_2_BASE || ''

  const apiBaseMap: Record<ShortServerKey, string> = {
    'hi-fpt-1': hiFpt1Base,
    'hi-fpt-2': hiFpt2Base,
  }

  const targetBase = apiBaseMap[server]

  // Nếu chưa cấu hình backend Hi FPT -> fallback TinyURL để demo local vẫn dùng được.
  if (!targetBase) {
    const tinyUrlEndpoint = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
      url,
    )}`

    try {
      const shortUrl = await $fetch<string>(tinyUrlEndpoint, {
        method: 'GET',
      })

      return {
        longUrl: url,
        shortUrl,
        note: rawNote || undefined,
        provider: 'tinyurl-fallback',
        metaTitle: metaTitle || undefined,
        metaImage: metaImage || undefined,
      }
    } catch (err: any) {
      throw createError({
        statusCode: 500,
        statusMessage:
          err?.message || 'Có lỗi xảy ra khi gọi TinyURL (fallback)',
      })
    }
  }

  const endpoint = `${targetBase.replace(/\/$/, '')}/short-link`

  try {
    const payloadToBackend: Record<string, any> = {
      url,
    }

    if (rawNote) payloadToBackend.note = rawNote
    if (metaTitle) payloadToBackend.meta_title = metaTitle
    if (metaImage) payloadToBackend.meta_image = metaImage

    const data = await $fetch<ShortLinkBackendResponse>(endpoint, {
      method: 'POST',
      body: payloadToBackend,
    })

    const shortUrl =
      data.shortUrl ||
      data.short_url ||
      data.data?.shortUrl ||
      data.data?.short_url

    const longFromBackend =
      data.longUrl ||
      data.original_url ||
      data.data?.longUrl ||
      data.data?.original_url ||
      url

    if (!shortUrl) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Backend không trả về shortUrl',
      })
    }

    return {
      longUrl: longFromBackend,
      shortUrl,
      note: rawNote || undefined,
      provider: server,
      metaTitle: metaTitle || undefined,
      metaImage: metaImage || undefined,
    }
  } catch (err: any) {
    console.error('Error when call Hi FPT short-link backend', err)
    if (err?.statusCode) {
      // đã là createError từ backend
      throw err
    }

    throw createError({
      statusCode: 500,
      statusMessage: err?.message || 'Có lỗi xảy ra khi tạo link rút gọn',
    })
  }
})
