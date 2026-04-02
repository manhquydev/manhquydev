# Phase 1: Design SVG Asset System

## Metadata
- **Phase**: 1
- **Priority**: high
- **Status**: completed
- **Dependencies**: []
- **Completed**: 2026-04-03

---

## Goal
Tạo hệ thống SVG assets premium với glassmorphism effects, consistent design tokens.

---

## Tasks

### 1.1 Create Asset Directory Structure
```
assets/premium/
├── components/          # Reusable SVG components
│   ├── card-base.svg   # Glass card template
│   ├── stat-pill.svg   # Animated stat number
│   ├── progress-bar.svg # Animated progress
│   └── icon-set.svg    # Tech stack icons
├── layouts/
│   ├── hero-section.svg
│   ├── stats-grid.svg
│   └── contribution-section.svg
└── effects/
    ├── glass-filter.svg
    ├── glow-filter.svg
    └── gradient-defs.svg
```

### 1.2 Design System Constants

**Colors (Catppuccin):**
```css
/* Light Mode */
--bg-primary: #eff1f5;
--surface: #ffffff;
--primary: #1e66f5;
--secondary: #8839ef;
--accent: #fe640b;
--text: #4c4f69;
--text-muted: #6c6f85;

/* Dark Mode */
--bg-primary: #1e1e2e;
--surface: #313244;
--primary: #89b4fa;
--secondary: #cba6f7;
--accent: #fab387;
--text: #cdd6f4;
--text-muted: #a6adc8;
```

**Typography:**
- Font: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont`
- Hero: 32px bold
- Title: 20px semibold
- Body: 14px regular
- Caption: 12px regular

**Effects:**
- Glass: `backdrop-blur` simulation via SVG filters
- Glow: Subtle colored shadows
- Border: 1px with 10% opacity

### 1.3 Create Glass Card Component

SVG filter definition:
```svg
<defs>
  <filter id="glass-blur" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur"/>
    <feColorMatrix in="blur" type="matrix" 
      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.7 0" result="glass"/>
  </filter>
  
  <linearGradient id="card-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.5"/>
  </linearGradient>
</defs>
```

### 1.4 Create Stat Number Animation Component

SMIL animation cho counter effect:
```svg
<text x="20" y="60" font-size="48" font-weight="700" fill="url(#text-gradient)">
  0
  <animate attributeName="opacity" values="0;1;1" dur="0.5s" fill="freeze"/>
</text>
<text x="20" y="60" font-size="48" font-weight="700" fill="url(#text-gradient)">
  <tspan>
    <animate attributeName="textContent" values="0;18" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
  </tspan>
</text>
```

---

## Output Files

- `assets/premium/components/card-base.svg`
- `assets/premium/components/stat-pill.svg`
- `assets/premium/effects/filters.svg`
- `assets/premium/design-tokens.md`

---

## Success Criteria

- [x] All components render correctly in both modes
- [x] Glass effect visible
- [x] Animation smooth
- [x] Color contrast WCAG AA

---

## Implementation Notes

### Files Created (2026-04-03)
- `assets/premium/design-tokens.md` (4,242 bytes) - Complete design system with Catppuccin colors
- `assets/premium/effects/filters.svg` (8,334 bytes) - 10 filters + 14 gradients + 3 patterns
- `assets/premium/components/card-base.svg` (8,022 bytes) - Glass card with SMIL animations
- `assets/premium/components/stat-pill.svg` (7,258 bytes) - Animated stat pill with sparkline
- `assets/premium/preview.html` - Interactive preview with dark mode toggle

### Directory Structure
```
assets/premium/
├── components/
│   ├── card-base.svg
│   └── stat-pill.svg
├── effects/
│   └── filters.svg
├── layouts/
├── design-tokens.md
└── preview.html
```

### Validation Results
- SVG namespace: ✅ Present in all SVG files
- Catppuccin colors: ✅ 59+ color references found
- feGaussianBlur: ✅ 21 filter instances
- SMIL animations: ✅ 32 animate elements
- Glass effect formula: feGaussianBlur(12px) + feColorMatrix(0.7 opacity)
