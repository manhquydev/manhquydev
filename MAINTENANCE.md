# Profile Maintenance Guide

## Automation Workflows

- **GitHub Data (`.github/workflows/update-project-stats.yml`)**
  - Runs daily at 03:00 UTC and on manual dispatch.
  - Executes: `node scripts/fetch-github-metrics.js`, `node scripts/fetch-project-stats.js`, `node scripts/update-readme.js`.
  - Updates: README metrics and contribution heatmaps (`assets/readme/contribution-heatmap-*.svg`).
- **Contribution Snake (`.github/workflows/snake.yml`)**
  - Runs daily at 00:00 UTC.
  - Generates `github-snake.svg` and `github-snake-dark.svg` to the `output` branch.

## Required README Markers

`scripts/update-readme.js` requires the following marker pairs in `README.md`:
- `<!-- HERO-KPI:START -->` ... `<!-- HERO-KPI:END -->`
- `<!-- GITHUB-ANALYTICS:START -->` ... `<!-- GITHUB-ANALYTICS:END -->`
- `<!-- CONTRIBUTION-GRAPH:START -->` ... `<!-- CONTRIBUTION-GRAPH:END -->`
- `<!-- CONTRIBUTION-ACTIVITY:START -->` ... `<!-- CONTRIBUTION-ACTIVITY:END -->`
- `<!-- PROJECT-STATS:START -->` ... `<!-- PROJECT-STATS:END -->`

## Local Execution

Run all update scripts locally:
```bash
npm run update:all
```

Or run individual steps:
```bash
npm run update:metrics  # Fetch GitHub metrics & update README
npm run update:stats    # Fetch repository stats & update README
npm run test:update     # Update README from existing data cache
```

Set `GITHUB_TOKEN` for authenticated requests:
```bash
export GITHUB_TOKEN="ghp_your_personal_access_token"
```

## Workflow Permissions & Settings

- **Actions Permissions**: Repository Settings -> Actions -> General -> Workflow permissions: `Read and write permissions`.
- **Secrets**: `GITHUB_TOKEN` is automatically provided by GitHub Actions for API requests.
- **Git Commit**: Workflows use `[skip ci]` in commit messages to avoid recursive workflow triggers.
- **Data Files**: `data/*.json` files are ephemeral local caches and gitignored.
