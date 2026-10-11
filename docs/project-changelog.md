# Project Changelog

## [1.2.0] - 2026-10-11

### Changed
- Refreshed profile README to a basic, concise, professional format without heavy decorative widgets.
- Simplified `scripts/update-readme.js` output: replaced Mermaid pie charts and ASCII sparklines with compact text metrics.
- Streamlined `MAINTENANCE.md` to reflect active GitHub Actions workflows and removed stale references.
- `scripts/update-readme.js` now refuses to run (exit 1, no writes) when `data/github-metrics.json` or `data/project-stats.json` is missing or empty.
- Contribution heatmap palette muted to a single-hue scale.

### Removed
- Removed decorative widgets (typing SVG, capsule-render waving headers/footers, quotes widget, third-party activity graphs).
- Removed unused premium generators and templates (`.github/scripts/`, `templates/`, `assets/premium/`, `assets/progress-bars/`, `.github/workflows/update-premium-profile.yml`).
- Removed obsolete dashboard and legacy SVG assets (`assets/skill-radar.svg`, `github-dashboard-*.svg`, `work-focus-*.svg`, `contact-rail-*.svg`, `core-stack-*.svg`).

## [1.1.0] - 2026-02-08

### Added
- Professional bilingual (EN/VI) structure to `README.md`.
- Impact metrics for featured projects (Python Visualizer, Student Forum Web).
- Collapsible sections for extended project lists and Vietnamese "About Me".
- EdTech Roadmap 2025-2030 visualization table.
- Learning journey and 2025 goals section.
- Strategic Call to Action (CTA) badges.
- Standardized documentation directory structure in `docs/`.

### Changed
- Complete rewrite of `README.md` from Vietnamese-primary to recruiter-optimized bilingual format.
- Modernized layout using high-contrast badges and formatted tables for statistics.
- Reorganized project descriptions into "Problem/Solution/Impact" framework.

### Removed
- Legacy typing animation components.
- Subjective star ratings for technical skills.

### Phase 1 Completion
Phase 1 (README Professional Upgrade) is now finalized. This establishes the foundation for future automation and asset creation.
