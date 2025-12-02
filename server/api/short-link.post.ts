import { $fetch } from 'ofetch'

interface ShortLinkBody {
  url?: string
  note?: string | null
}

/**
 * API rút gọn link
 *
 * Ưu tiên:
 *  - Nếu config.public.shortApiBase tồn tại -> gọi backend nội bộ của bạn.
 *  - Nếu không -> dùng TinyURL (demo), gọi từ server nên không dính CORS.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<ShortLinkBody>(event)

  const rawUrl = (body?.url || '').trim()
  const rawNote = (body?.note || '') || ''

  if (!rawUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu tham số url',
    })
  }

  // Chuẩn hoá URL: nếu thiếu http/https thì tự thêm https://
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
  const note = rawNote.toString().slice(0, 200)

  const publicConfig = config.public as any
  const customShortApi = (publicConfig.shortApiBase || '') as string

  try {
    let shortUrl: string
    let provider: 'custom' | 'tinyurl'

    if (customShortApi) {
      // Backend nội bộ của bạn, tự thiết kế format
      const resp = await $fetch<{ shortUrl?: string }>(customShortApi, {
        method: 'POST',
        body: { url, note },
      })

      if (!resp.shortUrl) {
        throw new Error('Backend không trả về shortUrl')
      }

      shortUrl = resp.shortUrl
      provider = 'custom'
    } else {
      // Demo dùng TinyURL
      const tiny = await $fetch<string>('https://tinyurl.com/api-create.php', {
        query: { url },
      })

      shortUrl = tiny
      provider = 'tinyurl'
    }

    return {
      longUrl: url,
      shortUrl,
      note,
      provider,
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || 'Có lỗi xảy ra khi tạo link rút gọn',
    })
  }
})
