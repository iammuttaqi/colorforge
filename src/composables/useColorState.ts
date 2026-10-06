import { computed, ref, watch } from 'vue'
import type { Palette } from '../types'
import { getRandomHex, isValidHex, normalizeHex, parseColorInput } from '../utils/color-converter'
import { generateHarmonies } from '../utils/color-harmonies'

const DEFAULT_BASE_COLOR = '#6366F1' // Beautiful modern Indigo

export const CURATED_PRESETS = [
  { name: 'Indigo Aura', hex: '#6366F1' },
  { name: 'Electric Cyan', hex: '#06B6D4' },
  { name: 'Emerald Spark', hex: '#10B981' },
  { name: 'Sunset Amber', hex: '#F59E0B' },
  { name: 'Rose Bloom', hex: '#F43F5E' },
  { name: 'Violet Velvet', hex: '#8B5CF6' },
  { name: 'Coral Flame', hex: '#FF6B6B' },
  { name: 'Ocean Depth', hex: '#0284C7' },
]

export function useColorState() {
  // Read initial color from URL hash if valid
  function getInitialColor(): string {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '').trim()
      if (isValidHex(hash)) {
        return normalizeHex(hash)
      }
      const params = new URLSearchParams(window.location.search)
      const queryColor = params.get('color') || params.get('c')
      if (queryColor && isValidHex(queryColor)) {
        return normalizeHex(queryColor)
      }
    }
    return DEFAULT_BASE_COLOR
  }

  const baseColor = ref<string>(getInitialColor())

  // Keep URL hash in sync with baseColor without adding new history states
  watch(
    baseColor,
    (newVal) => {
      if (typeof window !== 'undefined') {
        const cleanHex = newVal.replace(/^#/, '')
        const newUrl = `${window.location.pathname}#${cleanHex}`
        window.history.replaceState(null, '', newUrl)
      }
    },
    { immediate: true },
  )

  // Listen to popstate / hashchange (e.g. browser back/forward or user editing address bar)
  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace(/^#/, '').trim()
      if (isValidHex(hash)) {
        baseColor.value = normalizeHex(hash)
      }
    })
  }

  const palettes = computed<Palette[]>(() => {
    return generateHarmonies(baseColor.value)
  })

  function setBaseColor(input: string): boolean {
    const parsed = parseColorInput(input)
    if (parsed) {
      baseColor.value = parsed
      return true
    }
    return false
  }

  function randomizeColor() {
    baseColor.value = getRandomHex()
  }

  return {
    baseColor,
    palettes,
    setBaseColor,
    randomizeColor,
    presets: CURATED_PRESETS,
  }
}
