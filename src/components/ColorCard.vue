<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '../composables/useClipboard'
import type { ColorInfo } from '../types'

defineProps<{
  color: ColorInfo
}>()

const emit = defineEmits<{
  (e: 'set-base', hex: string): void
}>()

const { copyToClipboard } = useClipboard()

const recentCopiedType = ref<'hex' | 'rgb' | 'hsl' | null>(null)

async function copyValue(type: 'hex' | 'rgb' | 'hsl', value: string) {
  const label = type.toUpperCase()
  const ok = await copyToClipboard(value, `Copied ${label}: ${value}`)
  if (ok) {
    recentCopiedType.value = type
    setTimeout(() => {
      if (recentCopiedType.value === type) {
        recentCopiedType.value = null
      }
    }, 1800)
  }
}
</script>

<template>
  <div class="color-card">
    <!-- Visual Color Preview Header -->
    <div
      class="swatch-area"
      :style="{ backgroundColor: color.hex }"
      :class="{ 'light-theme': color.isLight }"
      title="Click to copy HEX code"
      @click="copyValue('hex', color.hex)"
    >
      <div class="swatch-top">
        <span v-if="color.label" class="color-role-tag">{{ color.label }}</span>
        <button
          type="button"
          class="btn-pin-base"
          title="Use this color as new base"
          @click.stop="emit('set-base', color.hex)"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Use as Base</span>
        </button>
      </div>

      <div class="swatch-middle">
        <span class="swatch-hex-hero">{{ color.hex }}</span>
      </div>

      <div class="swatch-bottom">
        <span class="contrast-badge" :title="`WCAG Contrast against black: ${color.contrastRatio}:1`">
          {{ color.contrastRatio }}:1
        </span>
      </div>
    </div>

    <!-- Values List (HEX, RGB, HSL) -->
    <div class="values-list">
      <!-- HEX -->
      <button
        type="button"
        class="value-btn"
        :class="{ active: recentCopiedType === 'hex' }"
        :title="`Click to copy HEX: ${color.hex}`"
        @click="copyValue('hex', color.hex)"
      >
        <span class="val-label">HEX</span>
        <span class="val-code">{{ color.hex }}</span>
        <span class="val-action">
          <svg v-if="recentCopiedType === 'hex'" viewBox="0 0 20 20" fill="currentColor" width="14" height="14" class="check-icon">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </span>
      </button>

      <!-- RGB -->
      <button
        type="button"
        class="value-btn"
        :class="{ active: recentCopiedType === 'rgb' }"
        :title="`Click to copy RGB: ${color.rgbString}`"
        @click="copyValue('rgb', color.rgbString)"
      >
        <span class="val-label">RGB</span>
        <span class="val-code">{{ color.rgbString }}</span>
        <span class="val-action">
          <svg v-if="recentCopiedType === 'rgb'" viewBox="0 0 20 20" fill="currentColor" width="14" height="14" class="check-icon">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </span>
      </button>

      <!-- HSL -->
      <button
        type="button"
        class="value-btn"
        :class="{ active: recentCopiedType === 'hsl' }"
        :title="`Click to copy HSL: ${color.hslString}`"
        @click="copyValue('hsl', color.hslString)"
      >
        <span class="val-label">HSL</span>
        <span class="val-code">{{ color.hslString }}</span>
        <span class="val-action">
          <svg v-if="recentCopiedType === 'hsl'" viewBox="0 0 20 20" fill="currentColor" width="14" height="14" class="check-icon">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.color-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.color-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Swatch Area */
.swatch-area {
  position: relative;
  height: 140px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  color: #ffffff;
  transition: var(--transition);
}

.swatch-area.light-theme {
  color: #111827;
}

.swatch-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.color-role-tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 7px;
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  backdrop-filter: blur(4px);
}

.swatch-area.light-theme .color-role-tag {
  background: rgba(255, 255, 255, 0.7);
  color: #111827;
}

.btn-pin-base {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.35);
  color: #ffffff;
  backdrop-filter: blur(4px);
  opacity: 0.85;
  transition: var(--transition);
}

.swatch-area.light-theme .btn-pin-base {
  background: rgba(255, 255, 255, 0.7);
  color: #111827;
}

.btn-pin-base:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.6);
  transform: scale(1.04);
}

.swatch-middle {
  text-align: center;
}

.swatch-hex-hero {
  font-family: var(--font-mono);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.swatch-area.light-theme .swatch-hex-hero {
  text-shadow: none;
}

.swatch-bottom {
  display: flex;
  justify-content: flex-end;
}

.contrast-badge {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.35);
  color: #ffffff;
}

.swatch-area.light-theme .contrast-badge {
  background: rgba(255, 255, 255, 0.7);
  color: #111827;
}

/* Values List */
.values-list {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(11, 15, 25, 0.4);
}

.value-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  transition: var(--transition);
  font-size: 0.78rem;
  text-align: left;
}

.value-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.value-btn.active {
  background: rgba(99, 102, 241, 0.15);
  border-color: var(--accent-primary);
}

.val-label {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-muted);
  font-size: 0.7rem;
  width: 32px;
  flex-shrink: 0;
}

.val-code {
  font-family: var(--font-mono);
  color: var(--text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 6px;
}

.val-action {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.value-btn:hover .val-action {
  color: var(--text-primary);
}

.check-icon {
  color: #34d399;
}
</style>
