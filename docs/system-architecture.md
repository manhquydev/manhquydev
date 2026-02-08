# System Architecture

## Architecture Overview
The repository follows a documentation-as-code architecture, prioritizing clear technical communication and automated status reporting.

## Directory Structure
- `/`: Entry point containing `README.md` (Main Portfolio) and `repomix-output.xml` (Compaction).
- `/docs`: Permanent documentation store.
- `/plans`: Transient and active implementation planning.
  - `/research`: Findings and technical spikes.
  - `/reports`: Agent-generated status reports.

## Documentation Data Flow
1. **Implementation Phase**: Requirements are defined in `/plans`.
2. **Execution**: Changes are applied to the root (README) or specific modules.
3. **Verification**: `repomix` is used to capture the updated state.
4. **Documentation Sync**: `/docs` files are updated to reflect the new implementation state.

## Planned Automation (Phase 3)
- **WakaTime Integration**: Dynamic coding stats update.
- **Blog Feed**: Automated RSS/API sync for technical writing.
- **SEO/Audit**: Periodic checks for broken links and metadata accuracy.
