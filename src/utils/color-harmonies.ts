import type { ColorInfo, HSL, Palette } from '../types'
import { createColorInfo, hexToRgb, hslToHex, normalizeHex, rgbToHsl } from './color-converter'

/**
 * Normalizes an angle into the [0, 360) range.
 */
function wrapHue(h: number): number {
  return ((h % 360) + 360) % 360
}

/**
 * Creates a ColorInfo object with a modified hue while preserving saturation and lightness.
 */
function colorWithHue(baseHsl: HSL, hueOffset: number, label: string): ColorInfo {
  const targetHue = wrapHue(baseHsl.h + hueOffset)
  const hex = hslToHex({
    h: targetHue,
    s: baseHsl.s,
    l: baseHsl.l,
  })
  return createColorInfo(hex, label)
}

/**
 * Generates all 5 required harmonic palettes for a given base color:
 * 1. Complementary (2 colors: 0°, 180°)
 * 2. Analogous (5 colors: -60°, -30°, 0°, +30°, +60°)
 * 3. Triadic (3 colors: 0°, 120°, 240°)
 * 4. Split-Complementary (3 colors: 0°, 150°, 210°)
 * 5. Monochromatic (5 colors: varying lightness steps)
 */
export function generateHarmonies(baseHex: string): Palette[] {
  const normalized = normalizeHex(baseHex)
  const rgb = hexToRgb(normalized)
  const baseHsl = rgbToHsl(rgb)

  // 1. Complementary
  const complementaryColors: ColorInfo[] = [
    createColorInfo(normalized, 'Base (0°)'),
    colorWithHue(baseHsl, 180, 'Complement (+180°)'),
  ]

  // 2. Analogous (5 colors)
  const analogousColors: ColorInfo[] = [
    colorWithHue(baseHsl, -60, 'Analogous (-60°)'),
    colorWithHue(baseHsl, -30, 'Analogous (-30°)'),
    createColorInfo(normalized, 'Base (0°)'),
    colorWithHue(baseHsl, 30, 'Analogous (+30°)'),
    colorWithHue(baseHsl, 60, 'Analogous (+60°)'),
  ]

  // 3. Triadic (3 colors)
  const triadicColors: ColorInfo[] = [
    createColorInfo(normalized, 'Base (0°)'),
    colorWithHue(baseHsl, 120, 'Triadic (+120°)'),
    colorWithHue(baseHsl, 240, 'Triadic (+240°)'),
  ]

  // 4. Split-Complementary (3 colors)
  const splitCompColors: ColorInfo[] = [
    createColorInfo(normalized, 'Base (0°)'),
    colorWithHue(baseHsl, 150, 'Split Comp (+150°)'),
    colorWithHue(baseHsl, 210, 'Split Comp (+210°)'),
  ]

  // 5. Monochromatic (5 colors with progressive lightness levels)
  // Ensure monotonic progression and distinctive contrast regardless of base lightness
  let monoLightnessValues: { l: number; label: string }[] = []

  if (baseHsl.l <= 25) {
    // Base is very dark
    monoLightnessValues = [
      { l: baseHsl.l, label: `Base (${baseHsl.l}%)` },
      { l: 32, label: 'Medium Dark (32%)' },
      { l: 50, label: 'Midtone (50%)' },
      { l: 70, label: 'Soft Tint (70%)' },
      { l: 88, label: 'Bright Tint (88%)' },
    ]
  } else if (baseHsl.l >= 75) {
    // Base is very light
    monoLightnessValues = [
      { l: 16, label: 'Deep Shade (16%)' },
      { l: 34, label: 'Medium Shade (34%)' },
      { l: 52, label: 'Midtone (52%)' },
      { l: 70, label: 'Light Tone (70%)' },
      { l: baseHsl.l, label: `Base (${baseHsl.l}%)` },
    ]
  } else {
    // Base is in the middle
    const l1 = Math.max(12, Math.round(baseHsl.l * 0.42))
    const l2 = Math.max(26, Math.round(baseHsl.l * 0.74))
    const l4 = Math.min(82, Math.round(baseHsl.l + (100 - baseHsl.l) * 0.45))
    const l5 = Math.min(94, Math.round(baseHsl.l + (100 - baseHsl.l) * 0.82))

    monoLightnessValues = [
      { l: l1, label: `Deep Shade (${l1}%)` },
      { l: l2, label: `Medium Shade (${l2}%)` },
      { l: baseHsl.l, label: `Base (${baseHsl.l}%)` },
      { l: l4, label: `Soft Tint (${l4}%)` },
      { l: l5, label: `Bright Tint (${l5}%)` },
    ]
  }

  const monochromaticColors: ColorInfo[] = monoLightnessValues.map(({ l, label }) => {
    // Keep saturation natural (if lightness is near extremes, saturation gently scales)
    const sat = Math.max(10, Math.min(100, baseHsl.s))
    const hex = hslToHex({
      h: baseHsl.h,
      s: sat,
      l,
    })
    return createColorInfo(hex, label)
  })

  return [
    {
      id: 'complementary',
      name: 'Complementary',
      description: 'Colors directly opposite on the color wheel. Delivers the strongest visual contrast and energy.',
      angleDescription: 'Base (0°) and Opposite (+180°)',
      colors: complementaryColors,
    },
    {
      id: 'analogous',
      name: 'Analogous',
      description: 'Adjacent colors on the color wheel. Creates unified, serene, and comfortable color transitions.',
      angleDescription: '-60°, -30°, 0°, +30°, +60°',
      colors: analogousColors,
    },
    {
      id: 'triadic',
      name: 'Triadic',
      description: 'Three colors equally spaced around the color wheel. Offers vibrant, harmonious balance.',
      angleDescription: '0°, +120°, +240°',
      colors: triadicColors,
    },
    {
      id: 'split-complementary',
      name: 'Split-Complementary',
      description: 'The base color plus two colors adjacent to its complement. High contrast with softer visual tension.',
      angleDescription: '0°, +150°, +210°',
      colors: splitCompColors,
    },
    {
      id: 'monochromatic',
      name: 'Monochromatic',
      description: 'Variations in lightness and shade of the base hue. Clean, professional, and endlessly versatile.',
      angleDescription: 'Constant hue across 5 lightness levels',
      colors: monochromaticColors,
    },
  ]
}
