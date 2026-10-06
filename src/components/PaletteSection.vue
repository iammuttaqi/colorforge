<script setup lang="ts">
import type { Palette } from '../types'
import ColorCard from './ColorCard.vue'

defineProps<{
  palette: Palette
}>()

const emit = defineEmits<{
  (e: 'set-base', hex: string): void
  (e: 'open-export', palette: Palette): void
}>()
</script>

<template>
  <section class="palette-section" :id="`palette-${palette.id}`">
    <div class="palette-header">
      <div class="title-wrap">
        <div class="title-row">
          <h3 class="palette-name">{{ palette.name }}</h3>
          <span class="angle-badge">{{ palette.angleDescription }}</span>
        </div>
        <p class="palette-description">{{ palette.description }}</p>
      </div>

      <div class="palette-actions">
        <button
          type="button"
          class="btn-export"
          :title="`Export ${palette.name} palette`"
          @click="emit('open-export', palette)"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Responsive Swatch Grid -->
    <div
      class="cards-grid"
      :class="`grid-${palette.colors.length}`"
    >
      <ColorCard
        v-for="(color, index) in palette.colors"
        :key="`${palette.id}-${color.hex}-${index}`"
        :color="color"
        @set-base="(hex) => emit('set-base', hex)"
      />
    </div>
  </section>
</template>

<style scoped>
.palette-section {
  margin-bottom: 48px;
}

.palette-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.palette-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.angle-badge {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}

.palette-description {
  font-size: 0.86rem;
  color: var(--text-secondary);
}

.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: var(--transition);
  flex-shrink: 0;
}

.btn-export:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  transform: translateY(-1px);
}

/* Dynamic Grid Layouts */
.cards-grid {
  display: grid;
  gap: 16px;
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.grid-5 {
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
}

@media (max-width: 640px) {
  .palette-header {
    flex-direction: column;
    align-items: stretch;
  }
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
