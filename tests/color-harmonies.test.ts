import { describe, expect, it } from 'vitest'
import { generateHarmonies } from '../src/utils/color-harmonies'

describe('Color Harmonies Generator', () => {
  it('generates all 5 required harmony palettes', () => {
    const harmonies = generateHarmonies('#3B82F6')
    expect(harmonies).toHaveLength(5)

    const ids = harmonies.map((h) => h.id)
    expect(ids).toEqual([
      'complementary',
      'analogous',
      'triadic',
      'split-complementary',
      'monochromatic',
    ])
  })

  it('generates 2 colors for Complementary with 180° offset', () => {
    // Pure Red: Hue = 0
    const [comp] = generateHarmonies('#FF0000')
    expect(comp.colors).toHaveLength(2)
    expect(comp.colors[0].hex).toBe('#FF0000')
    // Complement should have hue = 180 (Cyan: #00FFFF)
    expect(comp.colors[1].hsl.h).toBe(180)
    expect(comp.colors[1].hex).toBe('#00FFFF')
  })

  it('generates 5 colors for Analogous palette (-60°, -30°, 0°, +30°, +60°)', () => {
    // Pure Green: Hue = 120
    const harmonies = generateHarmonies('#00FF00')
    const analogous = harmonies.find((h) => h.id === 'analogous')!
    expect(analogous.colors).toHaveLength(5)

    const hues = analogous.colors.map((c) => c.hsl.h)
    // 120 - 60 = 60, 120 - 30 = 90, 120, 150, 180
    expect(hues).toEqual([60, 90, 120, 150, 180])
    expect(analogous.colors[2].hex).toBe('#00FF00') // Base color in center
  })

  it('generates 3 colors for Triadic palette (0°, 120°, 240°)', () => {
    // Pure Red: Hue = 0
    const harmonies = generateHarmonies('#FF0000')
    const triadic = harmonies.find((h) => h.id === 'triadic')!
    expect(triadic.colors).toHaveLength(3)

    const hues = triadic.colors.map((c) => c.hsl.h)
    expect(hues).toEqual([0, 120, 240])
    expect(triadic.colors[0].hex).toBe('#FF0000')
    expect(triadic.colors[1].hex).toBe('#00FF00')
    expect(triadic.colors[2].hex).toBe('#0000FF')
  })

  it('generates 3 colors for Split-Complementary palette (0°, 150°, 210°)', () => {
    // Pure Red: Hue = 0
    const harmonies = generateHarmonies('#FF0000')
    const splitComp = harmonies.find((h) => h.id === 'split-complementary')!
    expect(splitComp.colors).toHaveLength(3)

    const hues = splitComp.colors.map((c) => c.hsl.h)
    expect(hues).toEqual([0, 150, 210])
  })

  it('generates 5 monotonic lightness shades for Monochromatic palette', () => {
    const harmonies = generateHarmonies('#3B82F6')
    const mono = harmonies.find((h) => h.id === 'monochromatic')!
    expect(mono.colors).toHaveLength(5)

    // Verify all 5 colors maintain base hue
    const baseHue = mono.colors[2].hsl.h
    mono.colors.forEach((c) => {
      expect(Math.abs(c.hsl.h - baseHue)).toBeLessThanOrEqual(2)
    })

    // Verify lightness values are ascending
    const lightnesses = mono.colors.map((c) => c.hsl.l)
    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeGreaterThanOrEqual(lightnesses[i - 1])
    }
  })
})
