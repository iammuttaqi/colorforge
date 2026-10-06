import { describe, expect, it } from 'vitest'
import {
  createColorInfo,
  getRandomHex,
  hexToRgb,
  hslToHex,
  hslToRgb,
  isValidHex,
  normalizeHex,
  parseColorInput,
  rgbToHex,
  rgbToHsl,
} from '../src/utils/color-converter'

describe('Color Converter Utility', () => {
  describe('isValidHex', () => {
    it('validates 3-digit and 6-digit hex colors with or without #', () => {
      expect(isValidHex('#fff')).toBe(true)
      expect(isValidHex('FFF')).toBe(true)
      expect(isValidHex('#3b82f6')).toBe(true)
      expect(isValidHex('3B82F6')).toBe(true)
      expect(isValidHex('#000000')).toBe(true)
    })

    it('rejects invalid hex strings', () => {
      expect(isValidHex('xyz')).toBe(false)
      expect(isValidHex('#12345')).toBe(false)
      expect(isValidHex('#1234567')).toBe(false)
      expect(isValidHex('')).toBe(false)
    })
  })

  describe('normalizeHex', () => {
    it('expands 3-digit hex to 6-digit uppercase hex', () => {
      expect(normalizeHex('#fff')).toBe('#FFFFFF')
      expect(normalizeHex('abc')).toBe('#AABBCC')
    })

    it('formats 6-digit hex with uppercase and # prefix', () => {
      expect(normalizeHex('3b82f6')).toBe('#3B82F6')
      expect(normalizeHex('#3b82f6')).toBe('#3B82F6')
    })
  })

  describe('hexToRgb & rgbToHex', () => {
    it('converts hex to RGB accurately', () => {
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
      expect(hexToRgb('#3B82F6')).toEqual({ r: 59, g: 130, b: 246 })
    })

    it('converts RGB to Hex accurately', () => {
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#FFFFFF')
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
      expect(rgbToHex({ r: 59, g: 130, b: 246 })).toBe('#3B82F6')
    })
  })

  describe('rgbToHsl & hslToRgb & hslToHex', () => {
    it('converts pure colors back and forth between RGB and HSL', () => {
      // Pure Red
      const redHsl = rgbToHsl({ r: 255, g: 0, b: 0 })
      expect(redHsl).toEqual({ h: 0, s: 100, l: 50 })
      expect(hslToRgb(redHsl)).toEqual({ r: 255, g: 0, b: 0 })

      // Pure Green
      const greenHsl = rgbToHsl({ r: 0, g: 255, b: 0 })
      expect(greenHsl).toEqual({ h: 120, s: 100, l: 50 })
      expect(hslToRgb(greenHsl)).toEqual({ r: 0, g: 255, b: 0 })

      // Pure Blue
      const blueHsl = rgbToHsl({ r: 0, g: 0, b: 255 })
      expect(blueHsl).toEqual({ h: 240, s: 100, l: 50 })
      expect(hslToRgb(blueHsl)).toEqual({ r: 0, g: 0, b: 255 })

      // Pure White
      const whiteHsl = rgbToHsl({ r: 255, g: 255, b: 255 })
      expect(whiteHsl.l).toBe(100)
      expect(hslToRgb(whiteHsl)).toEqual({ r: 255, g: 255, b: 255 })

      // Pure Black
      const blackHsl = rgbToHsl({ r: 0, g: 0, b: 0 })
      expect(blackHsl.l).toBe(0)
      expect(hslToRgb(blackHsl)).toEqual({ r: 0, g: 0, b: 0 })
    })

    it('converts hsl to hex directly', () => {
      expect(hslToHex({ h: 0, s: 100, l: 50 })).toBe('#FF0000')
      expect(hslToHex({ h: 120, s: 100, l: 50 })).toBe('#00FF00')
    })
  })

  describe('parseColorInput', () => {
    it('parses HEX strings', () => {
      expect(parseColorInput('#3b82f6')).toBe('#3B82F6')
      expect(parseColorInput('ff00aa')).toBe('#FF00AA')
      expect(parseColorInput('#fff')).toBe('#FFFFFF')
    })

    it('parses rgb() formatted strings', () => {
      expect(parseColorInput('rgb(255, 0, 0)')).toBe('#FF0000')
      expect(parseColorInput('59, 130, 246')).toBe('#3B82F6')
    })

    it('parses hsl() formatted strings', () => {
      expect(parseColorInput('hsl(0, 100%, 50%)')).toBe('#FF0000')
      expect(parseColorInput('hsl(120, 100, 50)')).toBe('#00FF00')
    })

    it('returns null on invalid input', () => {
      expect(parseColorInput('not-a-color')).toBeNull()
      expect(parseColorInput('')).toBeNull()
    })
  })

  describe('createColorInfo', () => {
    it('creates complete ColorInfo metadata', () => {
      const info = createColorInfo('#3B82F6', 'Primary Blue')
      expect(info.hex).toBe('#3B82F6')
      expect(info.label).toBe('Primary Blue')
      expect(info.rgbString).toBe('rgb(59, 130, 246)')
      expect(info.hslString).toContain('hsl(')
      expect(typeof info.isLight).toBe('boolean')
      expect(info.contrastRatio).toBeGreaterThan(1)
    })
  })

  describe('getRandomHex', () => {
    it('generates valid 6-character hex strings', () => {
      for (let i = 0; i < 10; i++) {
        const hex = getRandomHex()
        expect(isValidHex(hex)).toBe(true)
        expect(hex).toMatch(/^#[0-9A-F]{6}$/)
      }
    })
  })
})
