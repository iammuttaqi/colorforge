import type { RGB } from '../types'

/**
 * Calculates relative luminance of an sRGB color per WCAG 2.1 specifications.
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance(rgb: RGB): number {
  const [rs, gs, bs] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((val) => {
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculates WCAG 2.1 contrast ratio between two colors (ranging from 1.0:1 to 21.0:1).
 */
export function getContrastRatio(color1: RGB, color2: RGB): number {
  const l1 = getRelativeLuminance(color1)
  const l2 = getRelativeLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  const ratio = (lighter + 0.05) / (darker + 0.05)
  return Math.round(ratio * 100) / 100
}

/**
 * Determines whether text rendered on top of this color should be dark (#111827) or light (#ffffff).
 * Returns true if dark text is recommended (i.e. background is light).
 */
export function isLightColor(rgb: RGB): boolean {
  const black: RGB = { r: 17, g: 24, b: 39 }
  const white: RGB = { r: 255, g: 255, b: 255 }
  const contrastWithBlack = getContrastRatio(rgb, black)
  const contrastWithWhite = getContrastRatio(rgb, white)
  return contrastWithBlack >= contrastWithWhite
}
