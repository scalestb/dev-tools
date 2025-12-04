<template>
  <div class="tool-page">
    <h1>Rút gọn link</h1>
    <p class="desc">
      Nhập URL dài để tạo link rút gọn. Có thể chọn server Hi FPT, khai báo meta title / image
      để backend dùng cho SEO khi share lên Zalo / Facebook.
    </p>

    <div class="grid">
      <!-- LEFT: Form -->
      <div class="panel">
        <!-- URL chính: nổi bật nhất -->
        <div class="big-input-card">
          <label for="long-url" class="big-label">URL gốc</label>
          <div class="big-input-row">
            <input
              id="long-url"
              v-model="longUrl"
              type="text"
              class="big-input"
              placeholder="https://hifpt.vn/contract/v1/sign?token=abcdefgh..."
            />

            <button
              class="btn-primary big-btn"
              type="button"
              :disabled="loading || !longUrlTrimmed"
              @click="createShortLink"
            >
              <span v-if="!loading">Tạo link</span>
              <span v-else>Đang tạo...</span>
            </button>
          </div>
          <p class="hint">
            Có thể dán URL chưa có http/https, hệ thống sẽ tự chuẩn hoá.
          </p>

          <!-- Server: option nhỏ gọn -->
          <div class="server-compact">
            <span class="server-label">Server:</span>
            <label
              v-for="option in serverOptions"
              :key="option.value"
              class="server-option"
            >
              <input
                v-model="selectedServer"
                type="radio"
                :value="option.value"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Tuỳ chọn SEO & ghi chú -->
        <div class="sub-card">
          <h2 class="sub-title">Tuỳ chọn SEO & ghi chú</h2>

          <div class="field">
            <label>Tiêu đề (meta title)</label>
            <input
              v-model="metaTitle"
              type="text"
              class="input"
              placeholder="VD: Hướng dẫn xử lý không nhận OTP ký HDDT"
            />
          </div>

          <div class="field">
            <label>Ảnh share (meta image)</label>

            <!-- URL ảnh -->
            <input
              v-model="metaImageUrl"
              type="text"
              class="input"
              placeholder="Hoặc dán URL ảnh: https://hi-static.fpt.vn/images/..."
            />

            <!-- Upload ảnh lên backend -->
            <div class="upload-row">
              <label class="upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  class="upload-input"
                  @change="onImageChange"
                />
                <span v-if="!uploadingImage">Chọn ảnh để upload</span>
                <span v-else>Đang upload ảnh...</span>
              </label>

              <span v-if="imageFileName" class="upload-filename">
                {{ imageFileName }}
              </span>
            </div>

            <p v-if="uploadError" class="error">
              {{ uploadError }}
            </p>

            <!-- Preview ảnh -->
            <div v-if="metaImageUrl" class="image-preview">
              <img :src="metaImageUrl" alt="Preview meta image" />
            </div>
          </div>

          <div class="field">
            <label>Ghi chú nội bộ</label>
            <textarea
              v-model="note"
              class="input textarea"
              rows="2"
              placeholder="VD: Link dùng cho team CSKH gọi hỗ trợ reset OTP..."
            ></textarea>
          </div>

          <p v-if="errorMessage" class="error">
            {{ errorMessage }}
          </p>
        </div>
      </div>

      <!-- RIGHT: Kết quả + lịch sử -->
      <div class="panel">
        <h2>Kết quả</h2>

        <div v-if="result" class="result-box">
          <div class="row">
            <span class="label">Server</span>
            <span class="value">{{ serverLabel(result.server || selectedServer) }}</span>
          </div>

          <div class="row">
            <span class="label">Link rút gọn</span>
            <a
              v-if="result.shortUrl"
              :href="result.shortUrl"
              target="_blank"
              rel="noopener"
              class="value link"
            >
              {{ result.shortUrl }}
            </a>
          </div>

          <div class="row">
            <span class="label">URL gốc</span>
            <a
              :href="result.longUrl"
              target="_blank"
              rel="noopener"
              class="value mono link"
            >
              {{ result.longUrl }}
            </a>
          </div>

          <div v-if="result.metaTitle" class="row">
            <span class="label">Meta title</span>
            <span class="value">{{ result.metaTitle }}</span>
          </div>

          <div v-if="result.metaImage" class="row">
            <span class="label">Meta image</span>
            <span class="value mono">{{ result.metaImage }}</span>
          </div>

          <div v-if="result.note" class="row">
            <span class="label">Ghi chú</span>
            <span class="value">{{ result.note }}</span>
          </div>

          <div class="result-actions">
            <button class="btn-secondary" type="button" @click="copyShortUrl">
              Copy link rút gọn
            </button>

            <button
              class="btn-secondary"
              type="button"
              :disabled="!result.shortUrl"
              @click="generateQrCode"
            >
              Tạo mã QR
            </button>
          </div>

          <p v-if="copyStatus" class="copy-status">
            {{ copyStatus }}
          </p>

          <!-- QR code -->
          <div v-if="qrImageUrl" class="qr-block">
            <p class="qr-title">QR code cho shortlink</p>
            <img :src="qrImageUrl" alt="QR code" class="qr-image" />
          </div>
        </div>

        <!-- Lịch sử -->
        <div class="history-block">
          <div class="history-header">
            <h3>Lịch sử rút gọn (trên máy này)</h3>
            <button
              v-if="history.length"
              class="btn-ghost"
              type="button"
              @click="clearHistory"
            >
              Xoá lịch sử
            </button>
          </div>

          <p v-if="!history.length" class="placeholder">
            Chưa có lịch sử nào. Hãy tạo thử một link rút gọn.
          </p>

          <ul v-else class="history-list">
            <li
              v-for="item in history"
              :key="item.id"
              class="history-item"
            >
              <div class="history-main">
                <div class="history-short">
                  <a
                    :href="item.shortUrl"
                    target="_blank"
                    rel="noopener"
                    class="history-short-link"
                  >
                    {{ item.shortUrl }}
                  </a>
                  <span class="history-server">
                    {{ serverLabel(item.server) }}
                  </span>
                  <span class="history-time">
                    {{ item.createdAt }}
                  </span>
                </div>

                <div class="history-meta">
                  <span v-if="item.metaTitle" class="history-meta-title">
                    📝 {{ item.metaTitle }}
                  </span>
                  <span v-if="item.metaImage" class="history-meta-image">
                    🖼 {{ item.metaImage }}
                  </span>
                </div>

                <div class="history-long">
                  <span class="label">Gốc:</span>
                  <span class="value mono">{{ item.longUrl }}</span>
                </div>

                <div v-if="item.note" class="history-note">
                  <span class="label">Note:</span>
                  <span class="value">{{ item.note }}</span>
                </div>
              </div>

              <div class="history-actions">
                <button
                  class="btn-icon"
                  type="button"
                  @click="copyFromHistory(item)"
                >
                  Copy
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type ShortServerKey = 'hi-fpt-1' | 'hi-fpt-2'

interface ShortLinkResult {
  longUrl: string
  shortUrl: string
  note?: string
  provider?: string
  server?: ShortServerKey
  metaTitle?: string | null
  metaImage?: string | null
}

interface ShortLinkHistoryItem extends ShortLinkResult {
  id: string
  createdAt: string
}

interface UploadImageResponse {
  url?: string
  imageUrl?: string
  [key: string]: any
}

const HISTORY_KEY = 'hi-tools-short-link-history-v2'

// Lấy config public để biết endpoint upload ảnh
const runtimeConfig = useRuntimeConfig()
const publicConfig = runtimeConfig.public as any
const uploadImageApi: string =
  (publicConfig.uploadImageApi as string) ||
  (publicConfig.apiBase ? `${publicConfig.apiBase}/dev-tools/upload-image` : '')

const longUrl = ref('')
const note = ref('')
const metaTitle = ref('')
const metaImageUrl = ref('')

const selectedServer = ref<ShortServerKey>('hi-fpt-1')

const loading = ref(false)
const result = ref<ShortLinkResult | null>(null)
const errorMessage = ref('')
const copyStatus = ref('')

const uploadingImage = ref(false)
const uploadError = ref('')
const imageFileName = ref('')

const qrImageUrl = ref('')
const history = ref<ShortLinkHistoryItem[]>([])

const serverOptions = [
  { value: 'hi-fpt-1', label: 'Hi FPT 1' },
  { value: 'hi-fpt-2', label: 'Hi FPT 2' },
] as const

const longUrlTrimmed = computed(() => longUrl.value.trim())

const normalizeUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

const serverLabel = (key?: ShortServerKey | string) => {
  const found = serverOptions.find((s) => s.value === key)
  return found ? found.label : 'Hi FPT'
}

// -------- History (localStorage) --------
const loadHistory = () => {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      history.value = parsed
    }
  } catch (e) {
    console.error('Cannot parse short-link history', e)
  }
}

const saveHistory = () => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.error('Cannot save short-link history', e)
  }
}

const addToHistory = (data: ShortLinkResult) => {
  const now = new Date()
  const item: ShortLinkHistoryItem = {
    id: `${now.getTime()}-${Math.random().toString(16).slice(2)}`,
    createdAt: now.toLocaleString('vi-VN'),
    longUrl: data.longUrl,
    shortUrl: data.shortUrl,
    note: data.note,
    provider: data.provider,
    server: (data.server || selectedServer.value) as ShortServerKey,
    metaTitle: data.metaTitle ?? (metaTitle.value || null),
    metaImage: data.metaImage ?? (metaImageUrl.value || null),
  }

  history.value.unshift(item)
  if (history.value.length > 50) {
    history.value.splice(50)
  }
  saveHistory()
}

const clearHistory = () => {
  history.value = []
  saveHistory()
}

// -------- Upload ảnh meta image --------
const onImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploadError.value = ''
  imageFileName.value = ''
  if (!uploadImageApi) {
    uploadError.value =
      'Chưa cấu hình uploadImageApi (publicConfig.uploadImageApi hoặc apiBase/dev-tools/upload-image).'
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  uploadingImage.value = true
  try {
    const res = await fetch(uploadImageApi, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `Upload ảnh thất bại (HTTP ${res.status})`)
    }

    const data = (await res.json()) as UploadImageResponse
    const url = data.url || data.imageUrl
    if (!url) {
      throw new Error('Backend upload không trả về url ảnh')
    }

    metaImageUrl.value = url
    imageFileName.value = file.name
  } catch (err: any) {
    console.error(err)
    uploadError.value = err?.message || 'Upload ảnh thất bại'
  } finally {
    uploadingImage.value = false
  }
}

// -------- Tạo shortlink --------
const createShortLink = async () => {
  errorMessage.value = ''
  copyStatus.value = ''
  qrImageUrl.value = ''
  result.value = null

  const normalizedUrl = normalizeUrl(longUrlTrimmed.value)
  if (!normalizedUrl) {
    errorMessage.value = 'Vui lòng nhập URL hợp lệ.'
    return
  }

  loading.value = true

  try {
    const payload = {
      url: normalizedUrl,
      note: note.value || null,
      server: selectedServer.value,
      metaTitle: metaTitle.value || null,
      metaImage: metaImageUrl.value || null,
    }

    const res = await fetch('/api/short-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `HTTP ${res.status}`)
    }

    const data = (await res.json()) as any

    const shortUrl =
      data.shortUrl ||
      data.short_url ||
      data.data?.shortUrl ||
      data.data?.short_url

    if (!shortUrl) {
      throw new Error('Backend không trả về shortUrl')
    }

    const longFromBackend =
      data.longUrl ||
      data.original_url ||
      data.data?.longUrl ||
      data.data?.original_url ||
      normalizedUrl

    const resultData: ShortLinkResult = {
  longUrl: longFromBackend,
  shortUrl,
  note: (data.note as string) ?? (note.value || undefined),
  provider: data.provider,
  server: (data.server || selectedServer.value) as ShortServerKey,
  metaTitle: (data.metaTitle as string) ?? (metaTitle.value || null),
  metaImage: (data.metaImage as string) ?? (metaImageUrl.value || null),
}

    result.value = resultData
    addToHistory(resultData)
  } catch (err: any) {
    console.error(err)
    errorMessage.value = err?.message || 'Có lỗi xảy ra khi tạo link rút gọn.'
  } finally {
    loading.value = false
  }
}

const copyShortUrl = async () => {
  if (!result.value?.shortUrl) return

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(result.value.shortUrl)
      copyStatus.value = 'Đã copy link vào clipboard ✅'
    } else {
      copyStatus.value = 'Trình duyệt không hỗ trợ copy tự động.'
    }
  } catch {
    copyStatus.value = 'Không copy được, hãy chọn & copy thủ công.'
  }

  setTimeout(() => {
    copyStatus.value = ''
  }, 2000)
}

const copyFromHistory = async (item: ShortLinkHistoryItem) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(item.shortUrl)
      copyStatus.value = 'Đã copy link vào clipboard ✅'
    } else {
      copyStatus.value = 'Trình duyệt không hỗ trợ copy tự động.'
    }
  } catch {
    copyStatus.value = 'Không copy được, hãy chọn & copy thủ công.'
  }

  setTimeout(() => {
    copyStatus.value = ''
  }, 2000)
}

// -------- QR code cho shortlink --------
const generateQrCode = () => {
  if (!result.value?.shortUrl) return
  // Dùng free API để tạo QR image (nếu sau này muốn, có thể chuyển sang API nội bộ)
  qrImageUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    result.value.shortUrl,
  )}`
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.tool-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.desc {
  margin-top: 4px;
  color: var(--text-muted);
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.6fr);
  gap: 16px;
  align-items: flex-start;
}

.panel {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

/* Big URL input */
.big-input-card {
  border-radius: 14px;
  border: 1px solid rgba(37, 99, 235, 0.2);
  background: linear-gradient(135deg, #eff6ff, #ffffff);
  padding: 14px;
  margin-bottom: 12px;
}

.big-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1f2933;
  margin-bottom: 6px;
}

.big-input-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.big-input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border-soft, #cbd5e1);
  background: #ffffff;
  font-size: 14px;
  outline: none;
}

.big-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.15);
}

.big-btn {
  white-space: nowrap;
}

/* Server compact */
.server-compact {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: #4b5563;
}

.server-label {
  font-weight: 600;
}

.server-option {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-soft, #e2e8f0);
  background: #f9fafb;
}

/* Sub card */
.sub-card {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed var(--border-soft, #e5e7eb);
}

.sub-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.field label {
  font-size: 13px;
  font-weight: 600;
  color: #1f2933;
}

.input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--border-soft, #e5e7eb);
  background: #f9fafb;
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: #2563eb;
  background: #ffffff;
}

.textarea {
  resize: vertical;
  min-height: 60px;
}

/* Upload ảnh */
.upload-row {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.upload-btn {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px dashed #94a3b8;
  font-size: 12px;
  cursor: pointer;
  background: #f1f5f9;
  color: #0f172a;
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-filename {
  font-size: 12px;
  color: #64748b;
}

.image-preview {
  margin-top: 8px;
  border-radius: 10px;
  border: 1px solid var(--border-soft, #e5e7eb);
  padding: 6px;
  background: #f9fafb;
}

.image-preview img {
  max-width: 100%;
  max-height: 160px;
  display: block;
  border-radius: 6px;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-ghost,
.btn-icon {
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 13px;
  padding: 6px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: default;
}

.btn-secondary {
  background: #eef2ff;
  color: #1e293b;
}

.btn-ghost {
  background: transparent;
  color: #64748b;
  border-color: var(--border-soft, #e5e7eb);
}

.btn-icon {
  background: #f1f5f9;
  color: #0f172a;
}

/* Result */
.result-box {
  margin-top: 4px;
  border-radius: 10px;
  border: 1px solid var(--border-soft, #e2e8f0);
  background: #f9fafb;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  font-size: 13px;
}

.row .label {
  flex: 0 0 80px;
  color: #64748b;
}

.row .value {
  flex: 1;
  color: #0f172a;
  word-break: break-all;
}

.link {
  color: #2563eb;
  text-decoration: underline;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
}

.result-actions {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.copy-status {
  margin-top: 4px;
  font-size: 12px;
  color: #16a34a;
}

/* QR */
.qr-block {
  margin-top: 10px;
  border-radius: 10px;
  border: 1px dashed #cbd5e1;
  padding: 10px;
  background: #ffffff;
  text-align: center;
}

.qr-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.qr-image {
  max-width: 200px;
  max-height: 200px;
}

/* History */
.history-block {
  margin-top: 12px;
  border-radius: 10px;
  border: 1px solid var(--border-soft, #e2e8f0);
  background: #f9fafb;
  padding: 10px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.history-header h3 {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid var(--border-soft, #e2e8f0);
}

.history-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-short {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  align-items: center;
  font-size: 13px;
}

.history-short-link {
  color: #2563eb;
  text-decoration: underline;
  word-break: break-all;
}

.history-server {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 999px;
  background: #fee2e2;
  color: #b91c1c;
}

.history-time {
  font-size: 11px;
  color: #64748b;
}

.history-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  font-size: 12px;
  color: #475569;
}

.history-long,
.history-note {
  display: flex;
  gap: 4px;
  font-size: 12px;
}

.history-actions {
  display: flex;
  align-items: flex-start;
}

.placeholder {
  font-size: 12px;
  color: var(--text-muted);
}

.error {
  margin-top: 4px;
  color: #b91c1c;
  font-size: 12px;
}

.hint {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .history-item {
    flex-direction: column;
  }

  .row .label {
    flex: 0 0 70px;
  }
}
</style>
