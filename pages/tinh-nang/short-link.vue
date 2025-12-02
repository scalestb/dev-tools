<template>
  <div class="tool-page">
    <h1>Rút gọn link</h1>
    <p class="desc">
      Nhập URL dài và tạo link rút gọn để dễ gửi cho đồng nghiệp, khách hàng.
      Mặc định dùng TinyURL qua server Nuxt (không bị CORS).
    </p>

    <div class="grid">
      <!-- LEFT: Input -->
      <div class="panel">
        <h2>Nhập URL</h2>

        <div class="field">
          <label>URL gốc</label>
          <input
            v-model="longUrl"
            type="text"
            class="input"
            placeholder="https://api.hifpt.vn/contract/v1/sign?token=abcdefgh..."
          />
        </div>

        <div class="field">
          <label>Ghi chú (tuỳ chọn)</label>
          <input
            v-model="note"
            type="text"
            class="input"
            placeholder="VD: Link hướng dẫn reset OTP cho callcenter"
          />
        </div>

        <div class="actions">
          <button
            class="btn-primary"
            type="button"
            :disabled="loading || !longUrlTrimmed"
            @click="createShortLink"
          >
            <span v-if="!loading">Tạo link rút gọn</span>
            <span v-else>Đang tạo...</span>
          </button>
          <button class="btn-ghost" type="button" @click="resetForm">Clear</button>
        </div>

        <p class="hint">
          Mẹo: nếu bạn nhập <code>api.hifpt.vn/...</code> mà quên <code>https://</code> thì tool sẽ tự thêm giúp.
        </p>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
      </div>

      <!-- RIGHT: Result -->
      <div class="panel">
        <h2>Kết quả</h2>

        <div v-if="result" class="result-box">
          <div class="row">
            <span class="label">URL gốc</span>
            <a :href="result.longUrl" target="_blank" rel="noopener" class="value link">
              {{ result.longUrl }}
            </a>
          </div>

          <div class="row">
            <span class="label">Link rút gọn</span>
            <div class="value value-row">
              <a :href="result.shortUrl" target="_blank" rel="noopener" class="link">
                {{ result.shortUrl }}
              </a>
              <button class="btn-secondary btn-xs" type="button" @click="copyShortUrl">
                Copy
              </button>
            </div>
          </div>

          <div class="row meta-row">
            <span class="label">Provider</span>
            <span class="value">
              {{ result.provider === 'custom' ? 'Backend nội bộ (shortApiBase)' : 'TinyURL (demo)' }}
            </span>
          </div>

          <p v-if="copyStatus" class="copy-status">{{ copyStatus }}</p>
        </div>

        <p v-else class="placeholder">
          Chưa có link rút gọn nào. Nhập URL bên trái rồi bấm
          <strong>Tạo link rút gọn</strong>.
        </p>

        <div class="note-box">
          <p class="note-title">Lưu ý</p>
          <ul class="note-list">
            <li>Đây là tool demo, không đảm bảo lưu lịch sử lâu dài.</li>
            <li>
              Nếu bạn có service rút gọn link nội bộ, hãy cấu hình
              <code>public.shortApiBase</code> trong <code>nuxt.config.ts</code> để tool gọi backend đó.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const longUrl = ref('')
const note = ref('')
const loading = ref(false)

const result = ref<null | { longUrl: string; shortUrl: string; note?: string; provider?: string }>(null)
const errorMessage = ref('')
const copyStatus = ref('')

const longUrlTrimmed = computed(() => longUrl.value.trim())

const normalizeUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

const createShortLink = async () => {
  errorMessage.value = ''
  copyStatus.value = ''
  result.value = null

  const normalized = normalizeUrl(longUrl.value)
  if (!normalized) {
    errorMessage.value = 'Vui lòng nhập URL hợp lệ.'
    return
  }

  loading.value = true
  try {
    const res = await fetch('/api/short-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: normalized,
        note: note.value || undefined,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.statusMessage || data?.error || 'Không tạo được link rút gọn.')
    }

    if (!data?.shortUrl) {
      throw new Error('Server không trả về shortUrl.')
    }

    result.value = data
  } catch (err: any) {
    errorMessage.value = err?.message || 'Có lỗi xảy ra khi gọi API.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  longUrl.value = ''
  note.value = ''
  errorMessage.value = ''
  copyStatus.value = ''
  result.value = null
}

const copyShortUrl = async () => {
  if (!result.value?.shortUrl) return

  try {
    await navigator.clipboard.writeText(result.value.shortUrl)
    copyStatus.value = 'Đã copy link vào clipboard ✅'
  } catch {
    copyStatus.value = 'Không copy được, hãy chọn & copy thủ công.'
  }

  setTimeout(() => {
    copyStatus.value = ''
  }, 2000)
}
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
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

h2 {
  font-size: 16px;
  margin-bottom: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.input {
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  padding: 8px 10px;
  font-size: 14px;
  background: #f9fafb;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  background: #eff6ff;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
  align-items: center;
}

.btn-primary,
.btn-secondary,
.btn-ghost {
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 14px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: default;
}

.btn-secondary {
  background: #e5edff;
  color: #1d4ed8;
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
}

.btn-xs {
  padding: 4px 8px;
  font-size: 12px;
}

.hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.error {
  margin-top: 8px;
  font-size: 13px;
  color: var(--danger);
}

.result-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  color: var(--text-muted);
}

.value {
  font-size: 14px;
  word-break: break-all;
}

.value-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.link {
  color: #2563eb;
  text-decoration: underline;
  text-decoration-style: dotted;
}

.meta-row .value {
  font-size: 13px;
}

.copy-status {
  font-size: 12px;
  color: var(--text-muted);
}

.placeholder {
  font-size: 13px;
  color: var(--text-muted);
}

.note-box {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px dashed var(--border-soft);
}

.note-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
}

.note-list {
  padding-left: 18px;
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
