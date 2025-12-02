<template>
  <div class="tool-page">
    <h1>MD5 Generator</h1>
    <p class="desc">
      Nhập chuỗi và sinh ra mã băm MD5, tiện cho việc tạo key tạm, hash đơn giản (không dùng cho bảo mật mật khẩu).
    </p>

    <div class="panel">
      <div class="field">
        <label>Chuỗi input</label>
        <textarea
          v-model="input"
          class="textarea"
          rows="4"
          placeholder="VD: HiFPT2025 + phone + contractId"
        />
      </div>

      <div class="field-inline">
        <label class="checkbox">
          <input v-model="upperCase" type="checkbox" />
          <span>Output in UPPERCASE</span>
        </label>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="generateHash">Generate</button>
        <button class="btn-ghost" @click="clearAll">Clear</button>
      </div>

      <div class="result">
        <div class="result-row">
          <span class="result-label">MD5:</span>
          <code class="result-value">{{ md5 }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'

const input = ref('')
const upperCase = ref(false)
const md5 = ref('')

const generateHash = () => {
  const hash = CryptoJS.MD5(input.value || '').toString()
  md5.value = upperCase.value ? hash.toUpperCase() : hash.toLowerCase()
}

const clearAll = () => {
  input.value = ''
  md5.value = ''
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

.panel {
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 14px;
}

.field {
  margin-bottom: 10px;
}

label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
  color: var(--text-muted);
}

.textarea {
  width: 100%;
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

.field-inline {
  margin: 8px 0;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.checkbox input {
  width: 14px;
  height: 14px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
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

.result {
  margin-top: 14px;
}

.result-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.result-label {
  font-size: 13px;
  color: var(--text-muted);
}

.result-value {
  font-size: 13px;
  padding: 4px 6px;
  border-radius: 6px;
  background: #020617;
  border: 1px solid var(--border-soft);
}
</style>
