# Phase 4: Update Generation Scripts

## Metadata
- **Phase**: 4
- **Priority**: high
- **Status**: pending
- **Dependencies**: [2]

---

## Goal
Update GitHub Actions workflow và generation scripts để tạo premium SVG từ templates.

---

## Current System Analysis

**Existing:**
- `.github/workflows/update-project-stats.yml`
- Generates: `github-dashboard-*.svg`, `contribution-heatmap-*.svg`, etc.
- Data: GitHub REST API + GraphQL
- Triggers: Schedule + manual

**Cần thay đổi:**
1. Script locations: Move to `.github/scripts/`
2. Template system: Replace hardcoded SVG với template engine
3. Output paths: Change to `assets/premium/`
4. Generation logic: Template + data = SVG output

---

## New Script Architecture

```
.github/
├── scripts/
│   ├── lib/
│   │   ├── template-engine.js    # Handlebars-like simple templating
│   │   ├── svg-renderer.js       # SVG composition helpers
│   │   └── color-schemes.js      # Light/dark color definitions
│   ├── generate-premium-stats.js # Main stats generator
│   ├── generate-premium-hero.js  # Hero section generator
│   └── generate-premium-tech.js  # Tech stack generator
└── workflows/
    └── update-premium-profile.yml # Updated workflow
```

---

## Template Engine Design

**Simple variable replacement:**
```javascript
function renderTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}
```

**Data structure:**
```javascript
const profileData = {
  followers: 2,
  publicRepos: 18,
  contributions30d: 18,
  contributions12m: 82,
  languages: [
    { name: 'JavaScript', count: 2, color: '#f1e05a' },
    { name: 'TypeScript', count: 1, color: '#3178c6' }
  ],
  contributionTrend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 16],
  lastUpdated: '2026-04-03T10:00:00Z'
};
```

---

## Scripts Implementation

### 4.1 `template-engine.js`
```javascript
/**
 * Simple template engine for SVG generation
 * Supports: {{variable}}, {{#each array}}, {{#if condition}}
 */
class TemplateEngine {
  render(template, data) {
    // Variable replacement
    let result = template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');
    
    // Simple each loop
    result = result.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, arrKey, content) => {
      return (data[arrKey] || []).map(item => {
        if (typeof item === 'object') {
          return content.replace(/\{\{(\w+)\}\}/g, (_, k) => item[k] ?? '');
        }
        return content.replace(/\{\{\.\}\}/g, item);
      }).join('');
    });
    
    return result;
  }
}
```

### 4.2 Color Schemes
```javascript
const colorSchemes = {
  light: {
    bg: '#eff1f5',
    surface: '#ffffff',
    primary: '#1e66f5',
    secondary: '#8839ef',
    accent: '#fe640b',
    text: '#4c4f69',
    textMuted: '#6c6f85',
    glassFill: 'url(#card-gradient-light)',
    glassStroke: 'rgba(108, 111, 133, 0.2)'
  },
  dark: {
    bg: '#1e1e2e',
    surface: '#313244',
    primary: '#89b4fa',
    secondary: '#cba6f7',
    accent: '#fab387',
    text: '#cdd6f4',
    textMuted: '#a6adc8',
    glassFill: 'url(#card-gradient-dark)',
    glassStroke: 'rgba(166, 173, 200, 0.2)'
  }
};
```

### 4.3 `generate-premium-stats.js`
```javascript
const fs = require('fs');
const path = require('path');
const TemplateEngine = require('./lib/template-engine');

async function generatePremiumStats() {
  const engine = new TemplateEngine();
  
  // Fetch GitHub data
  const githubData = await fetchGitHubData();
  
  // Generate light version
  const lightTemplate = fs.readFileSync('templates/premium-stats-dashboard-light.svg', 'utf8');
  const lightSvg = engine.render(lightTemplate, githubData);
  fs.writeFileSync('assets/premium/stats-dashboard-light.svg', lightSvg);
  
  // Generate dark version
  const darkTemplate = fs.readFileSync('templates/premium-stats-dashboard-dark.svg', 'utf8');
  const darkSvg = engine.render(darkTemplate, githubData);
  fs.writeFileSync('assets/premium/stats-dashboard-dark.svg', darkSvg);
}
```

---

## Workflow Updates

### `.github/workflows/update-premium-profile.yml`

```yaml
name: Update Premium Profile

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  update-profile:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
        working-directory: .github/scripts
      
      - name: Generate Premium Assets
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node .github/scripts/generate-premium-stats.js
          node .github/scripts/generate-premium-hero.js
          node .github/scripts/generate-premium-tech.js
          node .github/scripts/generate-premium-work-focus.js
          node .github/scripts/generate-premium-contact.js
      
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add assets/premium/
          git diff --staged --quiet || git commit -m "chore: update premium profile assets [skip ci]"
          git push
```

---

## Output Files

- `.github/scripts/lib/template-engine.js`
- `.github/scripts/lib/svg-renderer.js`
- `.github/scripts/lib/color-schemes.js`
- `.github/scripts/generate-premium-stats.js`
- `.github/scripts/generate-premium-hero.js`
- `.github/scripts/generate-premium-tech.js`
- `.github/scripts/generate-premium-work-focus.js`
- `.github/scripts/generate-premium-contact.js`
- `.github/scripts/package.json`
- `.github/workflows/update-premium-profile.yml`

---

## Success Criteria

- [ ] All generation scripts working
- [ ] Template engine handles all variables
- [ ] Workflow runs successfully
- [ ] Generated SVGs valid và đẹp
- [ ] Error handling for API failures
