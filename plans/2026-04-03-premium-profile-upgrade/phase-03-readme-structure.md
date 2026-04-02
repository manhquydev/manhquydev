# Phase 3: Redesign README Structure

## Metadata
- **Phase**: 3
- **Priority**: high
- **Status**: pending
- **Dependencies**: [1, 2]

---

## Goal
Restructure README.md để sử dụng premium SVG templates thay vì text tables.

---

## Current README Analysis

**Sections hiện tại:**
1. Header với name + tagline
2. Contact links (text)
3. Professional Summary (text)
4. Core Stack (SVG + text tags)
5. Work Focus Snapshot (SVG + text table)
6. GitHub Data (SVG dashboard + multiple text tables)

**Vấn đề:**
- Text tables thiếu visual appeal
- Quá nhiều `<details>` sections
- Stats phân tán, không có focal point
- Thiếu premium feel

---

## New README Structure

### Layout Premium

```markdown
<!-- Premium Hero - Animated gradient background -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/premium/hero-dark.svg">
  <img src="./assets/premium/hero-light.svg" width="100%">
</picture>

<!-- Premium Contact Rail - Glass bar with icons -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/premium/contact-dark.svg">
  <img src="./assets/premium/contact-light.svg" width="100%">
</picture>

---

<!-- Premium Stats Dashboard - All stats in one visual -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/premium/stats-dashboard-dark.svg">
  <img src="./assets/premium/stats-dashboard-light.svg" width="100%">
</picture>

<sub>Data sourced from GitHub REST API & GraphQL • Auto-updated daily</sub>

---

<!-- Premium Tech Stack - Icon grid with glass pills -->
### Tech Stack
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/premium/tech-stack-dark.svg">
  <img src="./assets/premium/tech-stack-light.svg" width="100%">
</picture>

---

<!-- Premium Work Focus - Two card layout -->
### Focus Areas
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/premium/work-focus-dark.svg">
  <img src="./assets/premium/work-focus-light.svg" width="100%">
</picture>

---

<!-- Contribution Activity - Simplified -->
<details>
<summary>📊 Contribution Details</summary>

<!-- Simple contribution graph (keep existing or upgrade) -->
</details>

---

<sub>⚡ Profile auto-generated with GitHub Actions</sub>
```

---

## Content Mapping

| Old Section | New Premium Element |
|-------------|---------------------|
| Header text | `premium-hero.svg` |
| Contact links text | `premium-contact.svg` |
| Professional Summary | Removed (integrated into hero) |
| Core Stack SVG + tags | `premium-tech-stack.svg` |
| Work Focus SVG + table | `premium-work-focus.svg` |
| GitHub dashboard + tables | `premium-stats-dashboard.svg` |
| Multiple detail sections | Collapsed into 1 details block |

---

## Implementation Steps

1. **Backup current README.md** → `README.backup.md`
2. **Create new structure** với premium SVG references
3. **Remove all text tables** (HERO-KPI, GITHUB-ANALYTICS, etc.)
4. **Keep only** essential data in collapsed `<details>`
5. **Add dark/light** picture wrappers cho tất cả SVG
6. **Update footer** cho consistency

---

## Output File

- `README.md` (rewritten)
- `README.backup.md` (backup)

---

## Success Criteria

- [ ] All text tables removed/replaced
- [ ] Consistent dark/light mode switching
- [ ] Clean visual hierarchy
- [ ] Mobile-friendly width (max 1200px)
- [ ] Proper alt text cho accessibility
- [ ] Backup created
