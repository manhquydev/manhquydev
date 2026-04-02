# Phase 2: Create Premium SVG Templates

## Metadata
- **Phase**: 2
- **Priority**: high
- **Status**: completed
- **Dependencies**: [1]

---

## Goal
Tạo các SVG templates hoàn chỉnh cho từng section của README.

---

## Templates Required

### 2.1 Premium Hero Section (`premium-hero.svg`)

**Specs:**
- Size: 1200x400px
- Layout: Name left, animated wave/form right
- Content: Name, tagline, role
- Animation: Subtle gradient shift

**Structure:**
```svg
<svg viewBox="0 0 1200 400">
  <!-- Background gradient with subtle animation -->
  <defs>
    <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--primary)">
        <animate attributeName="stop-color" values="#1e66f5;#8839ef;#1e66f5" dur="8s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="var(--secondary)"/>
    </linearGradient>
  </defs>
  
  <!-- Glass nameplate -->
  <rect x="60" y="120" width="500" height="160" rx="24" fill="url(#glass-fill)"/>
  <text x="100" y="180" font-size="48" font-weight="700">Manh Quy</text>
  <text x="100" y="220" font-size="20">Full-Stack Developer</text>
  
  <!-- Decorative elements -->
  <circle cx="1000" cy="200" r="120" fill="url(#hero-grad)" opacity="0.3">
    <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="4s" repeatCount="indefinite"/>
  </circle>
</svg>
```

### 2.2 Premium Stats Dashboard (`premium-stats-dashboard.svg`)

**Specs:**
- Size: 1200x600px
- Layout: 4 stat cards top, 2 charts bottom
- Cards: Followers, Repos, Contributions 30d, Contributions 12m
- Charts: Contribution trend + Language distribution

**Card Design:**
- Glass card with colored top border
- Large animated number
- Label below
- Subtle hover glow (static in SVG)

**Structure:**
```svg
<!-- Card 1: Followers -->
<g transform="translate(40, 40)">
  <rect width="260" height="140" rx="16" fill="url(#card-light)" stroke="url(#border-grad-1)"/>
  <rect x="0" y="0" width="260" height="4" rx="2" fill="var(--accent)"/>
  <text x="20" y="50" font-size="14" fill="var(--text-muted)">Followers</text>
  <text x="20" y="100" font-size="42" font-weight="700" fill="var(--text)">
    <animate attributeName="opacity" from="0" to="1" dur="0.8s"/>
    {{FOLLOWERS}}
  </text>
</g>
```

### 2.3 Premium Work Focus (`premium-work-focus.svg`)

**Specs:**
- Size: 1200x300px
- Layout: 2 glass cards side by side
- Content: Domain Focus vs Delivery Focus

### 2.4 Premium Tech Stack (`premium-tech-stack.svg`)

**Specs:**
- Size: 1200x200px
- Layout: Horizontal icon grid with glass pills
- Icons: JavaScript, TypeScript, React, Node.js, MongoDB, PostgreSQL, Docker

### 2.5 Premium Contact Rail (`premium-contact.svg`)

**Specs:**
- Size: 1200x80px
- Layout: Centered glass bar with social icons
- Links: Website, LinkedIn, Email, GitHub

---

## Template Variables

Mỗi template cần hỗ trợ placeholder variables để generation script replace:
- `{{FOLLOWERS}}` - Số followers
- `{{PUBLIC_REPOS}}` - Số repos
- `{{CONTRIBUTIONS_30D}}` - Contributions 30 ngày
- `{{CONTRIBUTIONS_12M}}` - Contributions 12 tháng
- `{{LANGUAGES}}` - JSON array ngôn ngữ
- `{{CONTRIBUTION_DATA}}` - Array dữ liệu contribution

---

## Output Files

- `templates/premium-hero-light.svg`
- `templates/premium-hero-dark.svg`
- `templates/premium-stats-dashboard-light.svg`
- `templates/premium-stats-dashboard-dark.svg`
- `templates/premium-work-focus-light.svg`
- `templates/premium-work-focus-dark.svg`
- `templates/premium-tech-stack-light.svg`
- `templates/premium-tech-stack-dark.svg`
- `templates/premium-contact-light.svg`
- `templates/premium-contact-dark.svg`

---

## Success Criteria

- [x] All 10 templates created (light + dark for each)
- [x] Templates render correctly standalone
- [x] Variable placeholders clearly marked
- [x] Consistent design language
- [x] File sizes < 100KB each
