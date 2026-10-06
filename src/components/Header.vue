<script setup lang="ts">
defineEmits<{
  (e: 'randomize'): void
}>()
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="brand">
        <div class="logo-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
            <circle cx="16" cy="16" r="14" fill="url(#brand-grad)" />
            <path
              d="M16 6a10 10 0 0 1 10 10c0 4-3 7-7 7h-2a2 2 0 0 0-2 2c0 .6-.2 1.2-.6 1.6A10 10 0 0 1 16 6z"
              fill="#ffffff"
            />
            <circle cx="11" cy="13" r="2" fill="#ec4899" />
            <circle cx="16" cy="10" r="2" fill="#eab308" />
            <circle cx="21" cy="13" r="2" fill="#06b6d4" />
            <defs>
              <linearGradient id="brand-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop stop-color="#6366f1" />
                <stop offset="1" stop-color="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="brand-text">
          <div class="brand-title-wrap">
            <h1 class="brand-title">ColorForge</h1>
            <span class="badge-tag">Open Source</span>
          </div>
          <p class="brand-subtitle">
            Harmonic browser-native color palette generator & color harmony calculator
          </p>
        </div>
      </div>

      <div class="header-actions">
        <button
          type="button"
          class="btn-action btn-random"
          title="Generate random color (or press Space)"
          aria-label="Generate random color"
          @click="$emit('randomize')"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="btn-text">Randomize</span>
          <span class="btn-kbd">Space</span>
        </button>

        <a
          href="https://github.com/iammuttaqi/colorforge"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-action btn-github"
          aria-label="View ColorForge on GitHub"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span class="btn-text">GitHub</span>
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(11, 15, 25, 0.85);
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.brand-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-title {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-tag {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: 9999px;
  background: rgba(99, 102, 241, 0.18);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.brand-subtitle {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin-top: 1px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 0.86rem;
  font-weight: 600;
  transition: var(--transition);
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
}

.btn-action:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-1px);
}

.btn-random {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.35);
  color: #c7d2fe;
}

.btn-random:hover {
  background: rgba(99, 102, 241, 0.22);
  border-color: rgba(99, 102, 241, 0.6);
  color: #ffffff;
}

.btn-kbd {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  background: rgba(0, 0, 0, 0.35);
  padding: 2px 5px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a5b4fc;
}

@media (max-width: 640px) {
  .brand-subtitle {
    display: none;
  }
  .btn-kbd {
    display: none;
  }
  .btn-text {
    display: none;
  }
  .header-inner {
    padding: 12px 16px;
  }
}
</style>
