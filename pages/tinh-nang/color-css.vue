<template>
  <div class="tool-page">
    <h1>Color CSS</h1>
    <p class="desc">
      Chọn màu và copy mã HEX / RGB / HSL để đưa vào CSS, Tailwind config hoặc figma.
    </p>

    <div class="grid">
      <div class="panel">
        <h2>Chọn màu</h2>
        <div class="picker-row">
          <input v-model="colorHex" type="color" class="color-input" />
          <input v-model="colorHex" type="text" class="input" />
        </div>

        <div class="field">
          <label>Preview</label>
          <div class="preview-bar" :style="{ background: colorHex }"></div>
        </div>
      </div>

      <div class="panel">
        <h2>Mã màu</h2>
        <div class="code-row">
          <span class="code-label">HEX</span>
          <code class="code">{{ colorHex.toUpperCase() }}</code>
        </div>
        <div class="code-row">
          <span class="code-label">RGB</span>
          <code class="code">{{ rgbString }}</code>
        </div>
        <div class="code-row">
          <span class="code-label">HSL</span>
          <code class="code">{{ hslString }}</code>
        </div>
        <p class="note">
          Tip: Bạn có thể dùng trong Tailwind config: <code>colors: { brand: '{{ colorHex }}' }</code>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorHex = ref('#38bdf8')

const hexToRgb = (hex: string) => {
  const value = hex.replace('#', '')
  if (value.length !== 6) return null
  const r = parseInt(value.substring(0, 2), 16)
  const g = parseInt(value.substring(2, 4), 16)
  const b = parseInt(value.substring(4, 6), 16)
  if ([r, g, b].some((v) => Number.isNaN(v))) return null
  return { r, g, b }
}

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

const rgbString = computed(() => {
  const rgb = hexToRgb(colorHex.value)
  if (!rgb) return 'invalid'
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
})

const hslString = computed(() => {
  const rgb = hexToRgb(colorHex.value)
  if (!rgb) return 'invalid'
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
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
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  margin-top: 12px;
}

.panel {
  background: var(--card-bg);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 14px;
}

.picker-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.color-input {
  width: 52px;
  height: 32px;
  padding: 0;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
  background: transparent;
}

.input {
  flex: 1;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
  padding: 6px 8px;
  font-size: 13px;
  background: #ffffff;
  color: var(--text);
}

.input:focus {
  outline: none;
  border-color: var(--accent);
}

.field {
  margin-top: 8px;
}

.field label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
  color: var(--text-muted);
}

.preview-bar {
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.9);
}

.code-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.code-label {
  min-width: 40px;
  font-size: 12px;
  color: var(--text-muted);
}

.code {
  font-size: 13px;
  padding: 3px 6px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid var(--border-soft);
}

.note {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 6px;
}
</style>
