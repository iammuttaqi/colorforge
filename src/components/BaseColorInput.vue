<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useClipboard } from '../composables/useClipboard'
import { CURATED_PRESETS } from '../composables/useColorState'
import { hexToRgb, normalizeHex, parseColorInput } from '../utils/color-converter'
import { isLightColor } from '../utils/contrast'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'randomize'): void
}>()

const { copyToClipboard } = useClipboard()

// Local text input state for typing freedom
const textInput = ref(props.modelValue)
const inputError = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    textInput.value = val
    inputError.value = false
  },
)

const currentColorRgb = computed(() => {
  return hexToRgb(props.modelValue)
})

const isCurrentLight = computed(() => {
  return isLightColor(currentColorRgb.value)
})

// Check if browser supports EyeDropper API
const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window

async function openEyeDropper() {
  if (hasEyeDropper) {
    try {
      // @ts-expect-error EyeDropper is a modern browser API
      const eyeDropper = new window.EyeDropper()
      const result = await eyeDropper.open()
      if (result && result.sRGBHex) {
        emit('update:modelValue', normalizeHex(result.sRGBHex))
      }
    } catch {
      // User cancelled picker or permission denied
    }
  }
}

function handleColorPickerChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target && target.value) {
    emit('update:modelValue', normalizeHex(target.value))
  }
}

function handleTextCommit() {
  const parsed = parseColorInput(textInput.value)
  if (parsed) {
    emit('update:modelValue', parsed)
    textInput.value = parsed
    inputError.value = false
  } else {
    inputError.value = true
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleTextCommit()
  }
}

function selectPreset(hex: string) {
  emit('update:modelValue', hex)
}
</script>

<template>
  <div class="base-color-panel">
    <div class="panel-header">
      <div class="panel-title-area">
        <span class="step-badge">Step 1</span>
        <h2 class="panel-heading">Base Color & Source</h2>
      </div>
      <p class="panel-desc">
        Pick a color, enter any HEX / RGB / HSL code, or select a curated starting point.
      </p>
    </div>

    <div class="control-grid">
      <!-- Big Interactive Color Swatch with embedded native color picker -->
      <div
        class="swatch-card"
        :style="{ backgroundColor: modelValue }"
        :class="{ 'light-theme': isCurrentLight }"
      >
        <label class="color-picker-label" title="Click to open color picker">
          <input
            type="color"
            class="native-color-picker"
            :value="modelValue"
            @input="handleColorPickerChange"
          />
          <div class="swatch-overlay">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span>Change Color</span>
          </div>
        </label>

        <div class="swatch-footer">
          <span class="active-hex">{{ modelValue }}</span>
          <button
            type="button"
            class="swatch-copy-btn"
            title="Copy Base HEX"
            @click.stop="copyToClipboard(modelValue, `Copied ${modelValue}!`)"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Controls & Input Form -->
      <div class="input-controls">
        <div class="input-group">
          <label for="color-text-input" class="input-label">
            <span>Color Value (HEX, RGB, or HSL)</span>
            <span v-if="inputError" class="input-error-msg">Invalid color format</span>
          </label>
          <div class="input-row" :class="{ error: inputError }">
            <span class="input-icon">#</span>
            <input
              id="color-text-input"
              v-model="textInput"
              type="text"
              class="text-input"
              placeholder="#6366F1 or rgb(...) or hsl(...)"
              spellcheck="false"
              @blur="handleTextCommit"
              @keydown="handleKeyDown"
            />
            <button
              type="button"
              class="btn-apply"
              title="Apply color"
              @click="handleTextCommit"
            >
              Apply
            </button>
            <button
              v-if="hasEyeDropper"
              type="button"
              class="btn-eyedropper"
              title="Pick color from screen"
              @click="openEyeDropper"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l6-6m-3-3l3 3M9 21l3-3-6-6-3 3 6 6zm0 0l-3 3" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Curated Preset Swatches -->
        <div class="presets-section">
          <span class="presets-label">Curated Inspirations</span>
          <div class="preset-pills">
            <button
              v-for="preset in CURATED_PRESETS"
              :key="preset.hex"
              type="button"
              class="preset-btn"
              :class="{ active: modelValue.toUpperCase() === preset.hex.toUpperCase() }"
              :title="`${preset.name} (${preset.hex})`"
              @click="selectPreset(preset.hex)"
            >
              <span class="preset-dot" :style="{ backgroundColor: preset.hex }"></span>
              <span class="preset-name">{{ preset.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-color-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 28px;
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow-md);
  margin-bottom: 40px;
}

.panel-header {
  margin-bottom: 24px;
}

.panel-title-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.step-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 9px;
  border-radius: 9999px;
  background: var(--accent-primary);
  color: #ffffff;
}

.panel-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.panel-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.control-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 28px;
  align-items: stretch;
}

/* Swatch Card */
.swatch-card {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 190px;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.swatch-card.light-theme {
  color: #111827;
}

.color-picker-label {
  flex: 1;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.native-color-picker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.swatch-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transform: scale(0.95);
  transition: var(--transition);
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.45);
  color: #ffffff;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  backdrop-filter: blur(8px);
}

.color-picker-label:hover .swatch-overlay {
  opacity: 1;
  transform: scale(1);
}

.swatch-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
}

.swatch-card.light-theme .swatch-footer {
  background: rgba(255, 255, 255, 0.55);
}

.active-hex {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.swatch-copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.15);
  transition: var(--transition);
}

.swatch-copy-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.08);
}

/* Input Controls */
.input-controls {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.input-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.input-error-msg {
  color: #f87171;
  font-size: 0.78rem;
}

.input-row {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 4px 6px;
  transition: var(--transition);
}

.input-row:focus-within {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.input-row.error {
  border-color: #ef4444;
}

.input-icon {
  font-family: var(--font-mono);
  color: var(--text-muted);
  padding: 0 8px 0 12px;
  font-weight: 600;
}

.text-input {
  flex: 1;
  background: transparent;
  border: none;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--text-primary);
  outline: none;
  padding: 8px 0;
}

.text-input::placeholder {
  color: var(--text-muted);
}

.btn-apply {
  padding: 6px 14px;
  background: var(--accent-primary);
  color: #ffffff;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 600;
  transition: var(--transition);
}

.btn-apply:hover {
  background: var(--accent-hover);
}

.btn-eyedropper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  transition: var(--transition);
  margin-left: 4px;
}

.btn-eyedropper:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.08);
}

/* Presets */
.presets-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.presets-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preset-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: var(--transition);
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.preset-btn.active {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.5);
  color: #ffffff;
}

.preset-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .control-grid {
    grid-template-columns: 1fr;
  }
  .base-color-panel {
    padding: 20px;
  }
}
</style>
