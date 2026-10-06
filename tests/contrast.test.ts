import { describe, expect, it } from 'vitest'
import { getContrastRatio, getRelativeLuminance, isLightColor } from '../src/utils/contrast'

describe('Contrast and Luminance calculations', () => {
  it('calculates relative luminance correctly for pure black and white', () => {
    expect(getRelativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0)
    expect(getRelativeLuminance({ r: 255, g: 255, b: 255 })).toBe(1)
  })

  it('calculates maximum contrast ratio between white and black', () => {
    const ratio = getContrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })
    expect(ratio).toBe(21)
  })

  it('calculates 1:1 contrast ratio between identical colors', () => {
    const ratio = getContrastRatio({ r: 100, g: 150, b: 200 }, { r: 100, g: 150, b: 200 })
    expect(ratio).toBe(1)
  })

  it('determines appropriate foreground text recommendation (isLightColor)', () => {
    // Pure white background should have dark text (isLightColor = true)
    expect(isLightColor({ r: 255, g: 255, b: 255 })).toBe(true)

    // Pure black background should have light text (isLightColor = false)
    expect(isLightColor({ r: 0, g: 0, b: 0 })).toBe(false)

    // Deep blue background (#0f172a) should have light text
    expect(isLightColor({ r: 15, g: 23, b: 42 })).toBe(false)

    // Light yellow background (#fef08a) should have dark text
    expect(isLightColor({ r: 254, g: 240, b: 138 })).toBe(true)
  })
})
