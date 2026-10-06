<script setup lang="ts">
import { useClipboard } from '../composables/useClipboard'

const { toastMessage } = useClipboard()
</script>

<template>
  <Transition name="toast">
    <div v-if="toastMessage" class="toast-container" role="status" aria-live="polite">
      <div class="toast-content">
        <svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  pointer-events: none;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  color: #f8fafc;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(99, 102, 241, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.25);
  font-size: 0.92rem;
  font-weight: 500;
}

.toast-icon {
  color: #34d399;
  flex-shrink: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
</style>
