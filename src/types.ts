export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number // 0 - 360
  s: number // 0 - 100
  l: number // 0 - 100
}

export interface ColorInfo {
  hex: string // #RRGGBB format uppercase
  rgb: RGB
  hsl: HSL
  rgbString: string // e.g. "rgb(59, 130, 246)"
  hslString: string // e.g. "hsl(217, 91%, 60%)"
  isLight: boolean // true if black text should be used, false if white text
  contrastRatio: number // contrast against black text (1.0 - 21.0)
  label?: string // e.g. "Base", "+180° Complement", "Shade -30%", etc.
}

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'monochromatic'

export interface Palette {
  id: HarmonyType
  name: string
  description: string
  angleDescription: string
  colors: ColorInfo[]
}
