// composables/useRequestToolApi.ts
interface RequestApiPayload {
  url: string
  method: string
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

interface RequestApiResult {
  status: number
  durationMs: number
  data: any
}

export const useRequestToolApi = () => {
  // dùng client mặc định (apiBase)
  const api = useApiClient('default')

  const sendTestRequest = (payload: RequestApiPayload) =>
    api<RequestApiResult>('/dev-tools/request-api', {
      method: 'POST',
      body: payload,
    })

  return {
    sendTestRequest,
  }
}
