<template>
  <div class="tool-page">
    <h1>JSON Formatter</h1>
    <p class="desc">
      Dán JSON và bấm Format để làm đẹp. Hữu ích cho debug log, response API, payload Kafka...
    </p>

    <div class="grid">
      <div class="panel">
        <h2>Input</h2>
        <textarea
          v-model="input"
          class="textarea mono"
          rows="16"
          placeholder='{"sample": "value", "items": [1,2,3]}'
        />
        <div class="actions">
          <button class="btn-primary" @click="formatJson">Format</button>
          <button class="btn-secondary" @click="minifyJson">Minify</button>
          <button class="btn-ghost" @click="clearAll">Clear</button>
        </div>
        <p v-if="error" class="error">Lỗi JSON: {{ error }}</p>
      </div>

      <div class="panel">
        <h2>Output</h2>
        <pre v-if="output" class="output mono">{{ output }}</pre>
        <p v-else class="placeholder">Output sẽ xuất hiện ở đây sau khi Format / Minify.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const input = ref('')
const output = ref('')
const error = ref('')

const formatJson = () => {
  error.value = ''
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj, null, 2)
  } catch (e: any) {
    error.value = e.message
  }
}

const minifyJson = () => {
  error.value = ''
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj)
  } catch (e: any) {
    error.value = e.message
  }
}

const clearAll = () => {
  input.value = ''
  output.value = ''
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
  min-height: 280px;
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
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.btn-primary,
.btn-secondary,
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

.btn-secondary {
  background: transparent;
  border-color: rgba(148, 163, 184, 0.6);
  color: var(--text-muted);
}

.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--text-muted);
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
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
  max-height: 460px;
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
