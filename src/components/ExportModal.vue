<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '../composables/useClipboard'
import type { Palette } from '../types'

const props = defineProps<{
  isOpen: boolean
  palette: Palette | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { copyToClipboard } = useClipboard()

type ExportFormat = 'css' | 'json' | 'tailwind' | 'hex'
const activeFormat = ref<ExportFormat>('css')

const exportContent = computed(() => {
  if (!props.palette) return ''
  const colors = props.palette.colors

  switch (activeFormat.value) {
    case 'css': {
      const vars = colors
        .map((c, i) => `  --${props.palette!.id}-color-${i + 1}: ${c.hex}; /* ${c.rgbString} */`)
        .join('\n')
      return `:root {\n${vars}\n}`
    }
    case 'json': {
      const data = {
        name: props.palette.name,
        type: props.palette.id,
        colors: colors.map((c, i) => ({
          step: i + 1,
          hex: c.hex,
          rgb: c.rgbString,
          hsl: c.hslString,
          label: c.label,
        })),
      }
      return JSON.stringify(data, null, 2)
    }
    case 'tailwind': {
      const entries = colors
        .map((c, i) => `        '${i + 1}': '${c.hex}',`)
        .join('\n')
      return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${props.palette.id}': {\n${entries}\n        }\n      }\n    }\n  }\n}`
    }
    case 'hex': {
      return colors.map((c) => c.hex).join(', ')
    }
  }
})

function copyExported() {
  copyToClipboard(exportContent.value, `Copied ${activeFormat.value.toUpperCase()} export!`)
}
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen && palette" class="modal-backdrop" @click="emit('close')">
      <div class="modal-dialog" @click.stop>
        <div class="modal-header">
          <div class="modal-title-area">
            <h3 class="modal-title">Export {{ palette.name }} Palette</h3>
            <span class="modal-subtitle">{{ palette.angleDescription }}</span>
          </div>
          <button type="button" class="btn-close" aria-label="Close modal" @click="emit('close')">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="format-tabs">
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeFormat === 'css' }"
            @click="activeFormat = 'css'"
          >
            CSS Variables
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeFormat === 'json' }"
            @click="activeFormat = 'json'"
          >
            JSON
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeFormat === 'tailwind' }"
            @click="activeFormat = 'tailwind'"
          >
            Tailwind
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeFormat === 'hex' }"
            @click="activeFormat = 'hex'"
          >
            HEX List
          </button>
        </div>

        <div class="code-container">
          <pre><code>{{ exportContent }}</code></pre>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="emit('close')">Close</button>
          <button type="button" class="btn-primary" @click="copyExported">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>Copy Code</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-dialog {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 580px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.btn-close {
  color: var(--text-secondary);
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.btn-close:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.08);
}

.format-tabs {
  display: flex;
  gap: 8px;
  padding: 14px 24px 0 24px;
}

.tab-btn {
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  transition: var(--transition);
}

.tab-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.08);
}

.tab-btn.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #ffffff;
}

.code-container {
  margin: 14px 24px;
  background: #060911;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  max-height: 260px;
  overflow-y: auto;
}

.code-container pre {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: #cbd5e1;
  white-space: pre-wrap;
  word-break: break-all;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: var(--transition);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  background: var(--accent-primary);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  transition: var(--transition);
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
