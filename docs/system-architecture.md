# System Architecture

## Architecture Overview
The repository follows a documentation-as-code architecture, prioritizing clear technical communication and automated status reporting.

## Directory Structure
- `/`: Entry point containing `README.md` (Main Portfolio) and `package.json`.
- `/docs`: Permanent documentation store.
- `/plans`: Implementation planning; dated plan folders only (e.g. `260208-1017-readme-technical-portfolio-upgrade`, `2026-04-03-premium-profile-upgrade`).

## Documentation Data Flow
1. **Implementation Phase**: Requirements are defined in `/plans`.
2. **Execution**: Changes are applied to the root (README) or specific modules.
3. **Verification**: The updated state is reviewed for consistency with the intended changes.
4. **Documentation Sync**: `/docs` files are updated to reflect the new implementation state.

## Automation Architecture
- **GitHub Data Sync (`update-project-stats.yml`)**: Automated daily run (03:00 UTC) fetching GitHub account metrics, repository statistics, rendering contribution heatmaps, and updating `README.md`.
- **Snake Contribution Animation (`snake.yml`)**: Daily run (00:00 UTC) generating snake animation SVGs to the `output` branch.
