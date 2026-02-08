---
title: "GitHub README Technical Portfolio Upgrade"
description: "Transform profile README from static showcase to living technical portfolio with automation"
status: in-progress
priority: P2
effort: 20h
branch: main
tags: [github, readme, portfolio, automation, github-actions, seo]
created: 2026-02-08
---

# GitHub README Technical Portfolio Upgrade

## Context

Transform manhquydev GitHub profile README from static showcase to living technical portfolio optimized for recruiters, EdTech companies, and developer community.

**Source:** [Brainstorm Strategy](../reports/brainstorm-260208-0914-readme-upgrade-strategy.md)

## Objectives

1. Optimize above-fold for 6-8 second recruiter scan
2. Add impact-driven project showcases with metrics
3. Implement GitHub Actions for dynamic content
4. Upgrade skills visualization (radar charts, progress bars)
5. SEO and performance optimization

## Target Audiences

- Technical recruiters (primary)
- EdTech companies
- Developer community
- Potential clients

## Implementation Phases

| Phase | Title | Status | Effort | File |
|-------|-------|--------|--------|------|
| 1 | Content Rewrites & Structure | completed | 5h | [phase-01](./phase-01-content-rewrites-and-structure.md) |
| 2 | Visual Assets Creation | completed | 6h | [phase-02](./phase-02-visual-assets-creation.md) |
| 3 | GitHub Actions Automation | pending | 6h | [phase-03](./phase-03-github-actions-automation.md) |
| 4 | Polish, Testing & SEO | pending | 3h | [phase-04](./phase-04-polish-testing-and-seo.md) |

## Key Dependencies

- [ ] Blog platform RSS/API endpoint (ask user)
- [ ] Project metrics data collection
- [ ] GitHub PAT for automation workflows
- [ ] WakaTime API access (optional)

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Profile view increase | +30% | 3 months |
| Load time | <2s on 3G | Immediate |
| Mobile usability | 95+ score | Immediate |
| Workflows stability | 100% success | Ongoing |

## File Structure

```
manhquydev/
├── README.md                    # Main profile (rewritten)
├── .github/
│   └── workflows/
│       ├── update-blog-posts.yml
│       ├── update-project-stats.yml
│       └── update-wakatime.yml (optional)
├── scripts/
│   ├── fetch-blog-posts.js
│   └── update-readme.js
└── assets/
    ├── skill-radar.svg
    ├── demo-gifs/
    └── progress-bars/
```

## Unresolved Questions

1. Which blog platform(s)? (Dev.to, Medium, Hashnode, personal)
2. Confirm final 2-3 hero projects with strongest metrics
3. Color scheme preferences for new visual elements?
4. WakaTime integration desired?
