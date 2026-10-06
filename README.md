# ColorForge 🎨

> A fast, elegant, browser-only color harmony generator and palette explorer built with Vue 3 and TypeScript.

ColorForge computes mathematically harmonized color palettes based on classic color theory. Enter any base color to generate **Complementary**, **Analogous**, **Triadic**, **Split-Complementary**, and **Monochromatic** palettes with instant one-click copyable HEX, RGB, and HSL values.

[![Deploy to GitHub Pages](https://github.com/iammuttaqi/colorforge/actions/workflows/deploy.yml/badge.svg)](https://github.com/iammuttaqi/colorforge/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ Features

- **5 Mathematical Color Harmonies**:
  - **Complementary**: High-contrast pairs separated by 180° on the color wheel.
  - **Analogous**: Smooth, adjacent hues (-60°, -30°, 0°, +30°, +60°).
  - **Triadic**: 3 evenly spaced, vibrant accents (0°, +120°, +240°).
  - **Split-Complementary**: Base hue paired with two colors flanking its complement (0°, +150°, +210°).
  - **Monochromatic**: 5 progressive tints and shades spanning lightness levels.
- **Copyable Values**: Instant one-click copying for **HEX**, **RGB**, and **HSL** representations with visual toast confirmations.
- **Zero Dependencies for Color Math**: High-precision conversion algorithms (HEX ↔ RGB ↔ HSL) and WCAG 2.1 relative luminance calculation implemented with native mathematics.
- **Accessible Contrast Badges**: Real-time WCAG contrast ratio calculations and adaptive text legibility indicators.
- **Shareable State**: Synchronizes active base color with the URL hash (`#6366F1`) for effortless bookmarking and sharing.
- **Interactive Color Exploration**: Click "Use as Base" on any swatch in any palette to instantly pivot and explore new branches.
- **Palette Export**: Export full palettes into **CSS Variables**, **JSON**, **Tailwind CSS config**, or comma-separated **HEX** lists.
- **Native Browser Color Picker & EyeDropper**: Native HTML5 color picker and modern EyeDropper API integration.
- **100% Client-Side & Private**: Zero backend, zero tracking, zero cookies, zero external API keys.

---

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup lang="ts">`)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Unit Testing**: [Vitest](https://vitest.dev/)
- **Styling**: Scoped modern CSS with CSS custom properties (no heavy CSS runtime)
- **Deployment**: GitHub Pages via GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- npm (or pnpm / yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iammuttaqi/colorforge.git
   cd colorforge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with hot module replacement |
| `npm run build` | Runs type checks and creates an optimized production build in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm test` | Runs unit tests using Vitest |
| `npm run type-check` | Runs Vue TypeScript type-checking without emitting files |

---

## 📖 Usage Guide

1. **Selecting a Base Color**:
   - Click the interactive color preview swatch to open the color picker.
   - Or type a hex (`#3B82F6`), RGB (`rgb(59, 130, 246)`), or HSL (`hsl(217, 91%, 60%)`) code into the input field.
   - Or press **Spacebar** / click **Randomize** to discover unexpected palettes.
   - Or choose from the curated inspiration pills.
2. **Copying Values**:
   - Click any **HEX**, **RGB**, or **HSL** button on a color card to copy that specific format.
   - Click the color swatch directly to copy the HEX code immediately.
3. **Pivoting Harmonies**:
   - Hover over any generated swatch and click **Use as Base** to regenerate all harmonies centered around that tone.
4. **Exporting**:
   - Click **Export** on any palette to view and copy ready-to-use code in CSS Variables, JSON, Tailwind, or plain HEX format.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
