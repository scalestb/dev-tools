<template>
  <div class="tool-page">
    <div class="header-row">
      <div>
        <h1>JSON Formatter</h1>
        <p class="desc">
          Dán JSON vào panel bên trái, bấm <strong>Format</strong> để làm đẹp. Panel bên phải hiển thị kết quả.
        </p>
      </div>
      <div class="toolbar">
        <button class="btn-primary" @click="formatJson">Format (Pretty)</button>
        <button class="btn-secondary" @click="minifyJson">Minify</button>
        <button class="btn-secondary" @click="applyOutputToInput" :disabled="!output">
          Dùng Output làm Input
        </button>
        <button class="btn-ghost" @click="clearAll">Clear</button>
        <button class="btn-ghost" @click="copyOutput" :disabled="!output">
          Copy Output
        </button>
      </div>
    </div>

    <p v-if="error" class="error">Lỗi JSON: {{ error }}</p>

    <div class="editor-layout">
      <!-- Left: Input -->
      <div class="panel editor-panel">
        <div class="panel-header">
          <span class="panel-title">Input (raw JSON)</span>
          <button class="tag-button" @click="loadSample">Load sample</button>
        </div>
        <textarea
          v-model="input"
          class="editor-textarea mono"
          spellcheck="false"
          placeholder='{"sample": "value", "items": [1,2,3]}'
        />
      </div>

      <!-- Right: Output -->
      <div class="panel editor-panel">
        <div class="panel-header">
          <span class="panel-title">Output (formatted)</span>
          <span v-if="output" class="badge-mode">
            {{ isMinified ? 'Minified' : 'Pretty' }}
          </span>
        </div>
        <div class="output-wrapper">
          <pre v-if="output" class="editor-output mono">{{ output }}</pre>
          <p v-else class="placeholder">
            Output sẽ xuất hiện ở đây sau khi bạn bấm <strong>Format</strong> hoặc <strong>Minify</strong>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const input = ref('')
const output = ref('')
const error = ref('')
const isMinified = ref(false)

const formatJson = () => {
  error.value = ''
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj, null, 2)
    isMinified.value = false
  } catch (e: any) {
    error.value = e.message
    output.value = ''
  }
}

const minifyJson = () => {
  error.value = ''
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj)
    isMinified.value = true
  } catch (e: any) {
    error.value = e.message
    output.value = ''
  }
}

const clearAll = () => {
  input.value = ''
  output.value = ''
  error.value = ''
  isMinified.value = false
}

const applyOutputToInput = () => {
  if (!output.value) return
  input.value = output.value
  error.value = ''
}

const copyOutput = async () => {
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
  } catch {
    // ignore lỗi, không cần hiển thị
  }
}

const loadSample = () => {
  input.value = JSON.stringify(
    {
      request_id: 'hifpt-123456',
      customer: {
        id: 1001,
        phone: '0900000000',
        name: 'Nguyen Van A',
      },
      contracts: [
        { id: 1, status: 'ACTIVE', type: 'FTTH' },
        { id: 2, status: 'PENDING', type: 'FPTPLAY' },
      ],
      meta: {
        source: 'Hi Dev Tools',
        env: 'dev',
      },
    },
    null,
    2
  )
  error.value = ''
}
</script>

<style scoped>
.tool-page {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.desc {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 13px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.btn-primary,
.btn-secondary,
.btn-ghost {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
  border-color: transparent;
  font-weight: 600;
}

.btn-secondary {
  background: #ffffff;
  border-color: var(--border-soft);
  color: var(--text-muted);
}

.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--text-muted);
}

.btn-primary:hover {
  filter: brightness(1.03);
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-ghost:hover {
  color: var(--primary);
}

.btn-secondary:disabled,
.btn-ghost:disabled {
  opacity: 0.5;
  cursor: default;
}

/* Lỗi JSON */
.error {
  margin: 0;
  font-size: 12px;
  color: var(--danger);
}

/* Layout kiểu jsoneditoronline: 2 panel lớn chiếm 70vh */

.editor-layout {
  margin-top: 8px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 12px;
  min-height: 480px;
  max-height: 70vh;
}

.panel {
  background: var(--card-bg);
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
}

.editor-panel {
  overflow: hidden;
}

.panel-header {
  padding: 8px 10px;
  border-bottom: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: #f8fafc;
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-dark);
}

.tag-button {
  border-radius: 999px;
  border: 1px solid var(--border-soft);
  background: #ffffff;
  padding: 4px 8px;
  font-size: 11px;
  color: var(--text-muted);
  cursor: pointer;
}

.tag-button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.badge-mode {
  font-size: 11px;
  padding: 3px 7px;
  border-radius: 999px;
  background: #e0f2fe;
  color: var(--primary-dark);
}

/* Editor */

.editor-textarea {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  padding: 10px;
  font-size: 13px;
  background: #ffffff;
  color: var(--text);
  resize: none;
  /* 100% chiều cao panel */
  min-height: 0;
}

.editor-textarea:focus {
  outline: none;
}

.output-wrapper {
  flex: 1;
  padding: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.editor-output {
  flex: 1;
  margin: 0;
  padding: 10px;
  font-size: 13px;
  background: #f9fafb;
  color: var(--text);
  overflow: auto;
}

.placeholder {
  padding: 10px;
  font-size: 13px;
  color: var(--text-muted);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

/* Responsive */

@media (max-width: 900px) {
  .editor-layout {
    grid-template-columns: minmax(0, 1fr);
    max-height: none;
  }
}
</style>
