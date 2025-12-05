// composables/useShortLinkApi.ts
interface CreateShortLinkPayload {
  url: string
  server?: string
  metaTitle?: string
  metaImage?: string
  note?: string
}

interface ShortLinkResponse {
  longUrl: string
  shortUrl: string
  note?: string
  provider?: string
  server?: string
  metaTitle?: string | null
  metaImage?: string | null
}

export const useShortLinkApi = () => {
  // dùng client shortLink (baseURL: shortLinkBase)
  const api = useApiClient('default')

  const createShortLink = (payload: CreateShortLinkPayload) =>
    api<ShortLinkResponse>('/v1/short-links', {
      method: 'POST',
      body: payload,
    })

  const getShortLinkDetail = (code: string) =>
    api<ShortLinkResponse>(`/v1/short-links/${code}`, {
      method: 'GET',
    })

  return {
    createShortLink,
    getShortLinkDetail,
  }
}
