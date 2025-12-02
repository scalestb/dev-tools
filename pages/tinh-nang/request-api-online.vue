<template>
  <div class="tool-page">
    <h1>Request API Online</h1>
    <p class="desc">
      Gửi thử request đến API công khai (cẩn thận CORS). Dùng để test nhanh các endpoint, header, body.
    </p>

    <div class="grid">
      <div class="panel">
        <h2>Cấu hình request</h2>

        <div class="field">
          <label>URL</label>
          <input v-model="url" type="text" class="input" placeholder="https://api.hifpt.vn/example" />
        </div>

        <div class="field-inline">
          <div class="field">
            <label>Method</label>
            <select v-model="method" class="input">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </select>
          </div>
          <div class="field">
            <label>Timeout (ms)</label>
            <input v-model.number="timeout" type="number" min="0" class="input" />
          </div>
        </div>

        <div class="field">
          <label>Headers (JSON)</label>
          <textarea
            v-model="headersText"
            class="textarea mono"
            rows="5"
            placeholder='{
  "Content-Type": "application/json"
}'
          />
        </div>

        <div class="field">
          <label>Body (raw / JSON)</label>
          <textarea
            v-model="bodyText"
            class="textarea mono"
            rows="6"
            placeholder='{"sample":"data"} hoặc text thường'
          />
        </div>

        <div class="actions">
          <button class="btn-primary" :disabled="loading" @click="sendRequest">
            {{ loading ? 'Đang gửi...' : 'Gửi request' }}
          </button>
          <span v-if="lastDuration !== null" class="meta">Thời gian: {{ lastDuration }} ms</span>
          <span v-if="statusCode" class="meta">Status: {{ statusCode }}</span>
        </div>

        <p v-if="parseError" class="error">Lỗi parse headers/body: {{ parseError }}</p>
      </div>

      <div class="panel">
        <h2>Kết quả</h2>
        <div v-if="errorMessage" class="error-box">
          {{ errorMessage }}
        </div>
        <pre v-if="responsePretty" class="output mono">{{ responsePretty }}</pre>
        <p v-else class="placeholder">Chưa có response.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const url = ref('/api/home') // mặc định test qua mock API SSR cho khỏi dính CORS
const method = ref('GET')
const timeout = ref(5000)

// ✅ dùng template literal cho string nhiều dòng
const headersText = ref(`{
  "Content-Type": "application/json"
}`)

const bodyText = ref('')
const loading = ref(false)

const responsePretty = ref('')
const errorMessage = ref('')
const parseError = ref('')
const statusCode = ref<number | null>(null)
const lastDuration = ref<number | null>(null)

const sendRequest = async () => {
  loading.value = true
  errorMessage.value = ''
  responsePretty.value = ''
  parseError.value = ''
  statusCode.value = null
  lastDuration.value = null

  let headers: Record<string, string> | undefined
  let body: any = undefined

  try {
    if (headersText.value.trim()) {
      headers = JSON.parse(headersText.value)
    }
  } catch (e: any) {
    parseError.value = 'Headers không phải JSON hợp lệ.'
    loading.value = false
    return
  }

  try {
    if (bodyText.value.trim()) {
      const text = bodyText.value.trim()
      if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
        body = JSON.parse(text)
      } else {
        body = text
      }
    }
  } catch (e: any) {
    parseError.value = 'Body JSON không hợp lệ.'
    loading.value = false
    return
  }

  const start = performance.now()

  try {
    const res = await $fetch.raw(url.value, {
      method: method.value,
      headers,
      body,
      timeout: timeout.value || undefined,
    })

    const duration = performance.now() - start
    lastDuration.value = Math.round(duration)
    statusCode.value = res.status

    const data = res._data
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data)
        responsePretty.value = JSON.stringify(parsed, null, 2)
      } catch {
        responsePretty.value = data
      }
    } else {
      responsePretty.value = JSON.stringify(data, null, 2)
    }
  } catch (err: any) {
    const duration = performance.now() - start
    lastDuration.value = Math.round(duration)
    errorMessage.value = err?.message || 'Có lỗi xảy ra khi gọi API.'
  } finally {
    loading.value = false
  }
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
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 16px;
  margin-top: 12px;
}

.panel {
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 14px;
}

.field {
  margin-bottom: 10px;
}

.field-inline {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 10px;
}

label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
  color: var(--text-muted);
}

.input,
.textarea,
select {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
  padding: 6px 8px;
  font-size: 13px;
  background: #ffffff;      /* nền trắng */
  color: var(--text);       /* chữ tối */
  font-family: inherit;
}


.input:focus,
.textarea:focus,
select:focus {
  outline: none;
  border-color: var(--accent);
}

.textarea {
  resize: vertical;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.btn-primary {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: var(--accent);
  color: #020617;
  font-size: 14px;
  font-weight: 600;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: default;
}

.meta {
  font-size: 12px;
  color: var(--text-muted);
}

.error {
  margin-top: 6px;
  font-size: 12px;
  color: var(--danger);
}

.error-box {
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.08);
  color: #fecaca;
  padding: 8px;
  font-size: 13px;
  margin-bottom: 8px;
}

.output {
  max-height: 460px;
  overflow: auto;
  font-size: 12px;
  padding: 8px;
  background: #f9fafb;       /* nền xám rất nhạt */
  border-radius: 8px;
  border: 1px solid var(--border-soft);
}

.placeholder {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
