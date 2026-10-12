# Project Changelog

## [1.4.0] - 2026-10-12

### Changed
- Profile trimmed to research-backed essentials: header banner, about, selected work, stack, activity heatmap, and connect links.
- Contribution heatmap refreshed from real GitHub data (50 repos, 2,551 annual contributions) and consolidated under the `Activity` section.
- Streamlined update pipeline to fetch only GitHub metrics and generate the activity heatmap.

### Removed
- Removed vanity and low-signal auto-generated blocks (`HERO-KPI`, `GITHUB-ANALYTICS`, `CONTRIBUTION-ACTIVITY`, `PROJECT-STATS`) per research into prominent engineer profile patterns (`plans/2026-10-12-profile-patterns-research.md`).
- Clean cutover: deleted `scripts/fetch-project-stats.js`, removed project stats steps from `.github/workflows/update-project-stats.yml`, and cleaned unused npm scripts (`update:stats`, `test:stats`).

## [1.3.0] - 2026-10-12

### Added
- Typographic header banner SVGs (`assets/readme/banner-light.svg`, `banner-dark.svg`) featuring name, positioning, and location/remote availability.
- Selected Work card row SVGs (`assets/readme/work-light.svg`, `work-dark.svg`) with 4 compact project cards (FlowSkill, Sentinel, VietExplore AI, Ephemera), honest status indicators, and tech tags.
- Compact plain-text index for Selected Work ensuring links and statuses remain copyable and searchable without images.
- Grouped 2-column markdown table for technical stack categorization (AI/LLM, Languages, Frameworks, Data & Infra).

### Changed
- Upgraded profile README to v1.3 using verified data pack facts: positioning updated to "AI Automation & LLM Integration · Fullstack · Open to remote work".
- Refreshed About section with factual background (AI20K cohort 2, FlowSkill maintainer, Teky instructor 100+ students, VIU IT engineer).
- Standardized contact links with primary domain email `hello@manhquy.id.vn`.
- Synchronized `docs/project-overview-pdr.md` functional requirements and acceptance criteria for banner and work graphic layer.

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
