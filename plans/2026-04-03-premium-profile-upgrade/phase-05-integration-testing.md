# Phase 5: Integration & Testing

## Metadata
- **Phase**: 5
- **Priority**: high
- **Status**: completed
- **Dependencies**: [3, 4]

---

## Goal
Tích hợp tất cả components, test hoàn chỉnh, và verify output.

---

## Integration Steps

### 5.1 File Structure Verification
```
.
├── README.md                          # Updated premium structure
├── assets/
│   ├── readme/                        # Old assets (keep for backup)
│   └── premium/                       # New premium assets
│       ├── hero-light.svg
│       ├── hero-dark.svg
│       ├── stats-dashboard-light.svg
│       ├── stats-dashboard-dark.svg
│       ├── work-focus-light.svg
│       ├── work-focus-dark.svg
│       ├── tech-stack-light.svg
│       ├── tech-stack-dark.svg
│       ├── contact-light.svg
│       └── contact-dark.svg
├── templates/                         # SVG templates
│   ├── premium-hero-light.svg
│   ├── premium-hero-dark.svg
│   └── ...
├── .github/
│   ├── scripts/                       # Generation scripts
│   │   ├── lib/
│   │   ├── generate-*.js
│   │   └── package.json
│   └── workflows/
│       └── update-premium-profile.yml
└── plans/
    └── 2026-04-03-premium-profile-upgrade/
```

### 5.2 Local Testing

**Test 1: SVG Validation**
```bash
# Check all SVGs are valid XML
for svg in assets/premium/*.svg; do
  xmllint --noout "$svg" && echo "✓ $svg valid" || echo "✗ $svg invalid"
done
```

**Test 2: Render Check**
- Open từng SVG trong browser
- Verify: No broken elements, correct colors, animations working

**Test 3: Dark/Light Mode**
```bash
# Use Playwright hoặc manual test
# Toggle system dark mode và verify picture element switching
```

### 5.3 GitHub Testing

**Steps:**
1. Push to branch `premium-upgrade`
2. Verify README renders correctly on GitHub
3. Check dark/light mode switching
4. Test mobile view (GitHub mobile app)

**GitHub Preview URL:**
```
https://github.com/manhquydev/manhquydev/blob/premium-upgrade/README.md
```

---

## Quality Checklist

### Visual Quality
- [ ] No broken/missing SVG elements
- [ ] Colors match design system
- [ ] Glassmorphism effects visible
- [ ] Text readable (contrast OK)
- [ ] Animations smooth (if any)

### Functional
- [ ] All stats correct và up-to-date
- [ ] Links clickable (contact section)
- [ ] Dark/light mode auto-switch
- [ ] Mobile responsive

### Performance
- [ ] SVG file sizes < 100KB each
- [ ] Total README load time < 3s
- [ ] No external dependencies (fonts, etc.)

---

## Rollback Plan

Nếu có vấn đề:
```bash
# Restore backup
git checkout main -- README.md
git rm -r assets/premium/
git checkout main -- assets/readme/
git commit -m "revert: rollback to classic profile"
```

---

## Success Criteria

- [ ] README renders perfectly on GitHub
- [ ] All SVGs load correctly
- [ ] Dark/light mode switching works
- [ ] Stats accurate và auto-update
- [ ] Mobile view OK
- [ ] Backup plan tested
- [ ] Ready for merge to main

---

## Final Checklist

Pre-merge:
- [ ] All 5 phases complete
- [ ] Code review passed
- [ ] Test results documented
- [ ] Rollback plan ready
- [ ] README backup exists
