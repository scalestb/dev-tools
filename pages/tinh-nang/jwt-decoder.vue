<template>
  <div class="tool-page">
    <h1>JWT Decoder</h1>
    <p class="desc">
      Dán JWT (accessToken / idToken) vào để decode phần header &amp; payload. Không gửi token ra server.
    </p>

    <div class="grid">
      <div class="panel">
        <h2>Input</h2>
        <textarea
          v-model="token"
          class="textarea mono"
          rows="10"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        />
        <div class="actions">
          <button class="btn-primary" @click="decodeToken">Decode</button>
          <button class="btn-ghost" @click="clearAll">Clear</button>
        </div>
        <p v-if="error" class="error">Lỗi: {{ error }}</p>
      </div>

      <div class="panel">
        <h2>Header</h2>
        <pre v-if="headerPretty" class="output mono">{{ headerPretty }}</pre>
        <p v-else class="placeholder">Header sẽ hiển thị ở đây.</p>
      </div>

      <div class="panel">
        <h2>Payload</h2>
        <pre v-if="payloadPretty" class="output mono">{{ payloadPretty }}</pre>
        <p v-else class="placeholder">Payload sẽ hiển thị ở đây.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const token = ref('')
const headerPretty = ref('')
const payloadPretty = ref('')
const error = ref('')

const base64UrlDecode = (str: string) => {
  let output = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = output.length % 4
  if (pad) {
    output += '='.repeat(4 - pad)
  }
  if (typeof atob === 'function') {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(output), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  }
  // SSR fallback
  return Buffer.from(output, 'base64').toString('utf-8')
}

const decodeToken = () => {
  error.value = ''
  headerPretty.value = ''
  payloadPretty.value = ''

  if (!token.value.trim()) {
    error.value = 'Vui lòng nhập JWT.'
    return
  }

  const parts = token.value.split('.')
  if (parts.length !== 3) {
    error.value = 'JWT không hợp lệ (không đủ 3 phần).'
    return
  }

  try {
    const headerJson = base64UrlDecode(parts[0])
    const payloadJson = base64UrlDecode(parts[1])
    headerPretty.value = JSON.stringify(JSON.parse(headerJson), null, 2)
    payloadPretty.value = JSON.stringify(JSON.parse(payloadJson), null, 2)
  } catch (e: any) {
    error.value = e.message || 'Không decode được token.'
  }
}

const clearAll = () => {
  token.value = ''
  headerPretty.value = ''
  payloadPretty.value = ''
  error.value = ''
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
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  grid-template-rows: auto auto;
  gap: 16px;
  margin-top: 12px;
}

.panel {
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 14px;
}

.textarea {
  width: 100%;
  min-height: 140px;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
  padding: 8px;
  font-size: 13px;
  background: #ffffff;
  color: var(--text);
  resize: vertical;
}

.textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn-primary,
.btn-ghost {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--accent);
  color: #020617;
  font-weight: 600;
}

.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--text-muted);
}

.btn-primary:hover {
  filter: brightness(1.05);
}

.error {
  margin-top: 6px;
  font-size: 12px;
  color: var(--danger);
}

.output {
  max-height: 320px;
  overflow: auto;
  font-size: 12px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
}


.placeholder {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
