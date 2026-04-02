# Plan: Premium GitHub Profile README Upgrade

## Metadata
- **Created**: 2026-04-03
- **Status**: active
- **Priority**: high
- **blockedBy**: []
- **blocks**: []

---

## Overview

Transform GitHub profile README từ text-based stats sang **premium visual interface** với:
- Glassmorphism SVG cards
- Animated stats displays
- Modern color scheme (Catppuccin/Tokyo Night inspired)
- Dark/Light mode auto-switch
- Visual KPI cards thay thế text tables

---

## Design System

### Color Palette (Catppuccin-inspired)
| Token | Light | Dark |
|-------|-------|------|
| Background | `#eff1f5` | `#1e1e2e` |
| Surface | `#ffffff` | `#313244` |
| Primary | `#1e66f5` | `#89b4fa` |
| Secondary | `#8839ef` | `#cba6f7` |
| Accent | `#fe640b` | `#fab387` |
| Text | `#4c4f69` | `#cdd6f4` |
| Text Muted | `#6c6f85` | `#a6adc8` |

### Effects
- **Glassmorphism**: `feGaussianBlur` + semi-transparent overlays
- **Glow**: `feDropShadow` với colored shadows
- **Animations**: SMIL `<animate>` cho subtle motion

---

## Dependency Graph

```
Phase 1 (Design Assets)
    │
    ├──> Phase 2 (SVG Templates)
    │       │
    │       ├──> Phase 4 (Generation Scripts)
    │
    └──> Phase 3 (README Structure)
            │
            └──> Phase 5 (Integration & Testing)
```

---

## Execution Strategy

| Phase | Task | Files | Parallel |
|-------|------|-------|----------|
| 1 | Design SVG asset system | `assets/premium/` | ✓ |
| 2 | Create premium SVG templates | `templates/*.svg` | ✓ |
| 3 | Redesign README structure | `README.md` layout | ✓ |
| 4 | Update generation scripts | `.github/scripts/` | Sequential |
| 5 | Integration & Testing | Full test | Sequential |

---

## File Ownership Matrix

| Phase | Owner Files | Notes |
|-------|-------------|-------|
| 1 | `assets/premium/*` | SVG design assets |
| 2 | `templates/premium-*.svg` | Reusable templates |
| 3 | `README.md` | Structure & layout |
| 4 | `.github/scripts/generate-*.js` | Generation logic |
| 5 | All | Final integration |

---

## Success Criteria

- [ ] All text tables → visual SVG cards
- [ ] Dark/Light mode working correctly
- [ ] GitHub Actions cập nhật SVG thành công
- [ ] Không broken images
- [ ] Load time < 3s
- [ ] Premium aesthetic achieved

---

## Cook Command

```bash
ck:cook D:\project\Clone\readme\manhquydev\plans\2026-04-03-premium-profile-upgrade\plan.md
```
