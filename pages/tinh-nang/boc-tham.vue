<template>
  <div class="tool-page">
    <h1>Bốc thăm ngẫu nhiên</h1>
    <p class="desc">
      Nhập danh sách tên (mỗi dòng một người), sau đó bấm vào hộp quà để bốc ngẫu nhiên một người trúng thưởng 🎁.
    </p>

    <div class="grid">
      <!-- LEFT: Danh sách người tham gia -->
      <div class="panel">
        <h2>Danh sách thành viên</h2>
        <textarea
          v-model="rawInput"
          class="textarea mono"
          rows="10"
          placeholder="Ví dụ:
An
Bình
Chi
Dũng"
        />
        <p class="hint">
          Mỗi dòng tương ứng một người. Tool tự bỏ qua dòng trống.
        </p>

        <div class="summary">
          <span>Tổng: <strong>{{ participants.length }}</strong> người</span>
        </div>
      </div>

      <!-- RIGHT: Hộp quà & kết quả -->
      <div class="panel">
        <h2>Bốc thăm</h2>

        <div class="gift-wrapper">
          <button
            class="gift-button"
            type="button"
            :disabled="!canDraw || isDrawing"
            @click="startDraw"
          >
            <div class="gift-icon" :class="{ 'is-shaking': isDrawing }">🎁</div>
            <span class="gift-text" v-if="!isDrawing && !winner">Bấm để bốc thăm</span>
            <span class="gift-text" v-else-if="isDrawing">Đang bốc...</span>
            <span class="gift-text" v-else>Đã bốc xong!</span>
          </button>
        </div>

        <div v-if="winner" class="result-box">
          <p class="label">Người trúng thưởng</p>
          <p class="winner-name">{{ winner }}</p>

          <div class="result-actions">
            <button class="btn-secondary" type="button" @click="clearWinner">
              Bốc lại (giữ danh sách)
            </button>

            <label class="checkbox-inline">
              <input v-model="removeWinner" type="checkbox" />
              <span>Xoá người trúng khỏi danh sách sau khi bốc</span>
            </label>
          </div>
        </div>

        <p v-else class="placeholder">
          Chưa có kết quả. Nhập danh sách bên trái rồi bấm vào hộp quà để bốc thăm 🎁
        </p>

        <p v-if="!canDraw" class="warning">
          Cần ít nhất 2 người trong danh sách để bốc thăm cho công bằng.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const rawInput = ref('')
const winner = ref<string | null>(null)
const isDrawing = ref(false)
const removeWinner = ref(true)

const participants = computed(() => {
  const lines = rawInput.value.split('\n').map((line) => line.trim())
  return lines.filter((line) => line.length > 0)
})

const canDraw = computed(() => participants.value.length >= 2)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const startDraw = async () => {
  if (!canDraw.value || isDrawing.value) {
    return
  }

  isDrawing.value = true
  winner.value = null

  const list = [...participants.value]

  // Cho hộp quà lắc nhẹ 1 tí cho vui
  await sleep(900)

  const index = Math.floor(Math.random() * list.length)
  const selected = list[index]

  winner.value = selected

  if (removeWinner.value) {
    list.splice(index, 1)
    rawInput.value = list.join('\n')
  }

  isDrawing.value = false
}

const clearWinner = () => {
  winner.value = null
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
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.4fr);
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

.textarea {
  width: 100%;
  min-height: 200px;
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  padding: 10px;
  font-size: 14px;
  resize: vertical;
  background: #f9fafb;
}

.textarea:focus {
  outline: none;
  border-color: #2563eb;
  background: #eff6ff;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.summary {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-muted);
}

.gift-wrapper {
  display: flex;
  justify-content: center;
  margin: 12px 0 16px;
}

.gift-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 18px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #f97316, #fb7185);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(249, 115, 22, 0.4);
  transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
}

.gift-button:disabled {
  opacity: 0.6;
  cursor: default;
  box-shadow: none;
}

.gift-button:not(:disabled):active {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 8px 18px rgba(249, 115, 22, 0.4);
}

.gift-icon {
  font-size: 40px;
  filter: drop-shadow(0 4px 6px rgba(30, 64, 175, 0.4));
}

.gift-icon.is-shaking {
  animation: shake 0.4s ease-in-out infinite;
}

.gift-text {
  font-size: 14px;
  font-weight: 600;
}

.result-box {
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fefce8;
  border: 1px solid #facc15;
}

.label {
  font-size: 12px;
  color: var(--text-muted);
}

.winner-name {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 700;
  color: #b45309;
}

.result-actions {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.btn-secondary {
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background: #e0f2fe;
  color: #1d4ed8;
  font-size: 13px;
  cursor: pointer;
}

.checkbox-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
}

.placeholder {
  font-size: 13px;
  color: var(--text-muted);
}

.warning {
  margin-top: 8px;
  font-size: 12px;
  color: var(--danger);
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  50% {
    transform: translateX(3px);
  }
  75% {
    transform: translateX(-3px);
  }
  100% {
    transform: translateX(0);
  }
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .winner-name {
    font-size: 18px;
  }
}
</style>
