import type { ColorInfo, HSL, RGB } from '../types'
import { getContrastRatio, isLightColor } from './contrast'

/**
 * Validates whether a string is a valid 3-digit or 6-digit hex color (with or without # prefix).
 */
export function isValidHex(hex: string): boolean {
  if (!hex || typeof hex !== 'string') return false
  const clean = hex.trim().replace(/^#/, '')
  return /^[0-9A-Fa-f]{3}$/.test(clean) || /^[0-9A-Fa-f]{6}$/.test(clean)
}

/**
 * Normalizes any hex string into standard #RRGGBB uppercase format.
 */
export function normalizeHex(hex: string): string {
  const clean = hex.trim().replace(/^#/, '').toUpperCase()
  if (clean.length === 3) {
    return `#${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`
  }
  if (clean.length === 6) {
    return `#${clean}`
  }
  return '#000000'
}

/**
 * Converts a 6-digit HEX color to RGB object.
 */
export function hexToRgb(hex: string): RGB {
  const normalized = normalizeHex(hex)
  const num = parseInt(normalized.slice(1), 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

/**
 * Converts an RGB object to uppercase #RRGGBB HEX string.
 */
export function rgbToHex(rgb: RGB): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)))
  const r = clamp(rgb.r).toString(16).padStart(2, '0')
  const g = clamp(rgb.g).toString(16).padStart(2, '0')
  const b = clamp(rgb.b).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`.toUpperCase()
}

/**
 * Converts RGB values ([0, 255]) to HSL values (h in [0, 360), s in [0, 100], l in [0, 100]).
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) % 6
        break
      case g:
        h = (b - r) / delta + 2
        break
      case b:
        h = (r - g) / delta + 4
        break
    }
    h = h * 60
  }

  return {
    h: Math.round(((h % 360) + 360) % 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Converts HSL values to RGB values.
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = ((hsl.h % 360) + 360) % 360
  const s = Math.max(0, Math.min(100, hsl.s)) / 100
  const l = Math.max(0, Math.min(100, hsl.l)) / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let rPrime = 0
  let gPrime = 0
  let bPrime = 0

  if (h >= 0 && h < 60) {
    rPrime = c
    gPrime = x
    bPrime = 0
  } else if (h >= 60 && h < 120) {
    rPrime = x
    gPrime = c
    bPrime = 0
  } else if (h >= 120 && h < 180) {
    rPrime = 0
    gPrime = c
    bPrime = x
  } else if (h >= 180 && h < 240) {
    rPrime = 0
    gPrime = x
    bPrime = c
  } else if (h >= 240 && h < 300) {
    rPrime = x
    gPrime = 0
    bPrime = c
  } else {
    rPrime = c
    gPrime = 0
    bPrime = x
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  }
}

/**
 * Converts HSL directly to uppercase #RRGGBB HEX string.
 */
export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl))
}

/**
 * Parses user input in HEX, RGB, or HSL format and returns normalized HEX.
 * Supports:
 * - "#3b82f6" or "3b82f6" or "#fff" or "fff"
 * - "rgb(59, 130, 246)" or "59, 130, 246"
 * - "hsl(217, 91%, 60%)" or "hsl(217, 91, 60)"
 */
export function parseColorInput(raw: string): string | null {
  const input = raw.trim()
  if (!input) return null

  // 1. Try Hex
  if (isValidHex(input)) {
    return normalizeHex(input)
  }

  // 2. Try RGB format: rgb(r, g, b) or r, g, b
  const rgbMatch = input.match(/^(?:rgb\s*\(\s*)?(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*(?:\))?$/i)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10)
    const g = parseInt(rgbMatch[2], 10)
    const b = parseInt(rgbMatch[3], 10)
    if (r <= 255 && g <= 255 && b <= 255) {
      return rgbToHex({ r, g, b })
    }
  }

  // 3. Try HSL format: hsl(h, s%, l%) or hsl(h, s, l)
  const hslMatch = input.match(
    /^(?:hsl\s*\(\s*)?(\d{1,3}(?:\.\d+)?)\s*[, ]\s*(\d{1,3}(?:\.\d+)?)%?\s*[, ]\s*(\d{1,3}(?:\.\d+)?)%?\s*(?:\))?$/i,
  )
  if (hslMatch) {
    const h = parseFloat(hslMatch[1])
    const s = parseFloat(hslMatch[2])
    const l = parseFloat(hslMatch[3])
    if (s <= 100 && l <= 100) {
      return hslToHex({ h, s, l })
    }
  }

  return null
}

/**
 * Constructs a comprehensive ColorInfo object with all representations and accessibility metrics.
 */
export function createColorInfo(hex: string, label?: string): ColorInfo {
  const normalizedHex = normalizeHex(hex)
  const rgb = hexToRgb(normalizedHex)
  const hsl = rgbToHsl(rgb)
  const light = isLightColor(rgb)
  const contrastRatio = getContrastRatio(rgb, { r: 17, g: 24, b: 39 })

  return {
    hex: normalizedHex,
    rgb,
    hsl,
    rgbString: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    isLight: light,
    contrastRatio,
    label,
  }
}

/**
 * Generates an appealing random hex color.
 */
export function getRandomHex(): string {
  // Generate appealing colors by picking random hue and pleasant saturation & lightness
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 30) + 65 // 65-95%
  const l = Math.floor(Math.random() * 30) + 45 // 45-75%
  return hslToHex({ h, s, l })
}
