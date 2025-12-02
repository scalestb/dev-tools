<template>
  <div class="tool-page">
    <h1>HTML Viewer</h1>
    <p class="desc">
      Dán đoạn HTML và xem trước kết quả hiển thị. Hữu ích khi test template nhỏ, component, email HTML...
    </p>

    <div class="grid">
      <div class="panel">
        <h2>HTML Source</h2>
        <textarea
          v-model="htmlSource"
          class="textarea mono"
          rows="18"
          placeholder="<div><strong>Hello Hi FPT</strong></div>"
        />
        <div class="actions">
          <button class="btn-primary" @click="applyPreview">Preview</button>
          <button class="btn-ghost" @click="resetTemplate">Reset sample</button>
        </div>
      </div>

      <div class="panel preview-panel">
        <h2>Preview</h2>
        <div class="preview-box">
          <div v-html="htmlPreview"></div>
        </div>
        <p class="note">
          Lưu ý: không sanitize XSS, chỉ dùng nội bộ cho Dev, tuyệt đối không dán HTML không rõ nguồn.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sample = `
<div style=\"padding:12px;border-radius:12px;border:1px solid #334155;font-family:system-ui;background:#020617;color:#e5e7eb\">
  <h2 style=\"margin:0 0 8px;font-size:18px\">Hi Dev Tools</h2>
  <p style=\"margin:0 0 6px;font-size:14px\">Đây là sample HTML preview.</p>
  <ul style=\"margin:0;padding-left:18px;font-size:13px\">
    <li>Request API Online</li>
    <li>JSON Formatter</li>
    <li>JWT Decoder</li>
  </ul>
</div>
`.trim()

const htmlSource = ref(sample)
const htmlPreview = ref(sample)

const applyPreview = () => {
  htmlPreview.value = htmlSource.value
}

const resetTemplate = () => {
  htmlSource.value = sample
  htmlPreview.value = sample
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

.preview-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-box {
  min-height: 260px;
  border-radius: 12px;
  border: 1px dashed rgba(148, 163, 184, 0.6);
  background: #ffffff; /* thay vì #020617 */
  padding: 10px;
  overflow: auto;
}


.note {
  font-size: 11px;
  color: var(--text-muted);
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
</style>
