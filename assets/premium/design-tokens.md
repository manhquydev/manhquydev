# Premium Design Tokens

Design system for premium profile README with glassmorphism effects.

---

## Colors (Catppuccin Latte & Mocha)

### Light Mode (Latte)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#eff1f5` | Page background |
| `--surface` | `#ffffff` | Card surfaces |
| `--surface-hover` | `#e6e9ef` | Hover states |
| `--primary` | `#1e66f5` | Primary actions, links |
| `--secondary` | `#8839ef` | Secondary accents |
| `--accent` | `#fe640b` | Highlights, badges |
| `--success` | `#40a02b` | Success states |
| `--warning` | `#df8e1d` | Warning states |
| `--error` | `#d20f39` | Error states |
| `--text` | `#4c4f69` | Primary text |
| `--text-muted` | `#6c6f85` | Secondary text |

### Dark Mode (Mocha)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#1e1e2e` | Page background |
| `--surface` | `#313244` | Card surfaces |
| `--surface-hover` | `#45475a` | Hover states |
| `--primary` | `#89b4fa` | Primary actions, links |
| `--secondary` | `#cba6f7` | Secondary accents |
| `--accent` | `#fab387` | Highlights, badges |
| `--success` | `#a6e3a1` | Success states |
| `--warning` | `#f9e2af` | Warning states |
| `--error` | `#f38ba8` | Error states |
| `--text` | `#cdd6f4` | Primary text |
| `--text-muted` | `#a6adc8` | Secondary text |

---

## Typography

| Level | Font Size | Weight | Line Height | Usage |
|-------|-----------|--------|-------------|-------|
| Hero | 32px | 700 (bold) | 1.2 | Main titles |
| Title | 20px | 600 (semibold) | 1.3 | Section headers |
| Body | 14px | 400 (regular) | 1.5 | Content text |
| Caption | 12px | 400 (regular) | 1.4 | Labels, metadata |
| Stat Number | 48px | 700 (bold) | 1 | Large stats |
| Stat Label | 14px | 500 (medium) | 1.4 | Stat descriptions |

**Font Family:** `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

---

## Effects

### Glassmorphism

```svg
<filter id="glass-blur" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur"/>
  <feColorMatrix in="blur" type="matrix" 
    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.7 0" result="glass"/>
</filter>
```

**Properties:**
- Backdrop blur: 12px
- Opacity: 0.7 (70%)
- Background: White with 50-90% opacity gradient

### Glow Effects

```svg
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
  <feMerge>
    <feMergeNode in="coloredBlur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

### Border Style

- Width: 1px
- Color: 10% opacity white (light) / 10% opacity surface (dark)
- Radius: 16px (cards), 24px (pills), 8px (small elements)

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight gaps |
| `--space-sm` | 8px | Small gaps |
| `--space-md` | 16px | Standard gaps |
| `--space-lg` | 24px | Large gaps |
| `--space-xl` | 32px | Section gaps |
| `--space-2xl` | 48px | Major sections |

---

## Animation

### Timing

| Animation | Duration | Easing |
|-----------|----------|--------|
| Fade in | 500ms | ease-out |
| Counter | 1000ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Hover | 200ms | ease-in-out |
| Progress | 1500ms | cubic-bezier(0.4, 0, 0.2, 1) |

### SMIL Animation

```svg
<!-- Counter animation -->
<animate attributeName="textContent" 
  values="0;100" 
  dur="1s" 
  fill="freeze" 
  calcMode="spline" 
  keySplines="0.4 0 0.2 1"/>

<!-- Progress animation -->
<animate attributeName="width" 
  values="0%;85%" 
  dur="1.5s" 
  fill="freeze" 
  calcMode="spline" 
  keySplines="0.4 0 0.2 1"/>
```

---

## SVG ViewBox Standards

| Component | ViewBox | Default Size |
|-----------|---------|--------------|
| Card | `0 0 400 200` | 400x200px |
| Stat Pill | `0 0 200 60` | 200x60px |
| Progress Bar | `0 0 300 12` | 300x12px |
| Icon | `0 0 24 24` | 24x24px |
| Hero Section | `0 0 800 400` | 800x400px |

---

## Accessibility

- Color contrast ratio: 4.5:1 minimum (WCAG AA)
- Focus indicators: 2px outline with primary color
- Animation respects `prefers-reduced-motion`
- Text remains readable over glass effects

---

## Version

**v1.0.0** - Initial release with Catppuccin color scheme
