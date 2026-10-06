<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import BaseColorInput from './components/BaseColorInput.vue'
import ExportModal from './components/ExportModal.vue'
import Header from './components/Header.vue'
import PaletteSection from './components/PaletteSection.vue'
import Toast from './components/Toast.vue'
import { useClipboard } from './composables/useClipboard'
import { useColorState } from './composables/useColorState'
import type { Palette } from './types'

const { baseColor, palettes, randomizeColor, setBaseColor } = useColorState()
const { copyToClipboard } = useClipboard()

// Export modal state
const isExportOpen = ref(false)
const selectedPaletteForExport = ref<Palette | null>(null)

function openExport(palette: Palette) {
  selectedPaletteForExport.value = palette
  isExportOpen.value = true
}

function closeExport() {
  isExportOpen.value = false
  selectedPaletteForExport.value = null
}

// Global Spacebar shortcut to randomize
function handleGlobalKeydown(e: KeyboardEvent) {
  const activeEl = document.activeElement
  const isInputActive =
    activeEl &&
    (activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      activeEl.getAttribute('contenteditable') === 'true')

  if (e.code === 'Space' && !isInputActive && !isExportOpen.value) {
    e.preventDefault()
    randomizeColor()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

function copyAllPalettesSummary() {
  const allHexes = palettes.value.map((p) => {
    return `/* ${p.name} */\n` + p.colors.map((c) => c.hex).join(', ')
  }).join('\n\n')

  copyToClipboard(allHexes, 'Copied all generated palettes!')
}
</script>

<template>
  <div class="app-layout">
    <Header @randomize="randomizeColor" />

    <main class="main-content">
      <div class="content-container">
        <!-- Interactive Base Color Selection -->
        <BaseColorInput
          v-model="baseColor"
          @randomize="randomizeColor"
        />

        <!-- Section Navigation & Quick Actions -->
        <div class="palettes-toolbar">
          <div class="toolbar-left">
            <h2 class="section-title">Color Harmonies</h2>
            <span class="palettes-count">5 Mathematical Harmonies</span>
          </div>

          <div class="toolbar-right">
            <button
              type="button"
              class="toolbar-btn"
              title="Copy all palette HEX codes to clipboard"
              @click="copyAllPalettesSummary"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy All Palettes</span>
            </button>
          </div>
        </div>

        <!-- Render All 5 Palette Harmonies -->
        <div class="palettes-stack">
          <PaletteSection
            v-for="palette in palettes"
            :key="palette.id"
            :palette="palette"
            @set-base="setBaseColor"
            @open-export="openExport"
          />
        </div>
      </div>
    </main>

    <!-- Global Export Modal -->
    <ExportModal
      :is-open="isExportOpen"
      :palette="selectedPaletteForExport"
      @close="closeExport"
    />

    <!-- Global Toast Feedback -->
    <Toast />

    <!-- Sleek Minimal Footer -->
    <footer class="app-footer">
      <div class="footer-inner">
        <p class="footer-credits">
          <strong>ColorForge</strong> — Pure browser-only color harmony generator. Zero analytics, zero backend, 100% open source.
        </p>
        <div class="footer-links">
          <a href="https://github.com/iammuttaqi/colorforge" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span class="sep">•</span>
          <a href="https://github.com/iammuttaqi/colorforge/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 40px 24px;
}

.content-container {
  max-width: 1280px;
  margin: 0 auto;
}

.palettes-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
  flex-wrap: wrap;
  gap: 16px;
}

.toolbar-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.palettes-count {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: var(--transition);
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.palettes-stack {
  display: flex;
  flex-direction: column;
}

.app-footer {
  border-top: 1px solid var(--border-subtle);
  padding: 24px;
  background: rgba(11, 15, 25, 0.8);
  margin-top: 60px;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 0.84rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.footer-credits strong {
  color: var(--text-primary);
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-links a:hover {
  color: #ffffff;
  text-decoration: underline;
}

.sep {
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .main-content {
    padding: 20px 16px;
  }
  .footer-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
