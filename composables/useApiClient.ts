// composables/useApiClient.ts
import { ofetch } from 'ofetch'

type ApiClientName = 'default' 

export const useApiClient = (name: ApiClientName = 'default') => {
  const config = useRuntimeConfig()
  const token = useState<string | null>('accessToken') // chỗ này tuỳ bạn lưu token ở đâu

  // Chọn baseURL theo từng nhóm API
  const baseURL = config.public.apiBase

  const client = ofetch.create({
    baseURL,

    // timeout, retry… tuỳ chỉnh thêm nếu muốn
    timeout: 10_000,
    retry: 1,

    // Gắn header chung cho mọi request
    onRequest({ options }) {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(options.headers as Record<string, string>),
      }

      // Nếu không phải GET thì auto set Content-Type
      if (options.method && options.method !== 'GET' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json'
      }

      // Gắn Authorization nếu có token
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }

      options.headers = headers
    },

    // Bạn có thể xử lý lỗi chung ở đây
    onResponseError({ response }) {
      console.error('[API ERROR]', response.status, response._data)
      // ví dụ: nếu 401 thì clear token, chuyển về /login, ...
    },
  })

  return client
}
