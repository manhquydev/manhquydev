# GitHub Profile README Patterns Research & Application

**Date**: 2026-10-12  
**Target**: `manhquydev/README.md`  
**Focus**: Famous engineer minimalist conventions vs. community widget showcases

---

## 1. Raw Profile Data & Benchmarks

- **torvalds** (Linus Torvalds): **0 lines** (no profile repo / 404). Relies entirely on native GitHub sidebar (327k followers) and 5 pinned repos (`linux`, `GuitarPedal`, etc.). 0 stats widgets, 0 badges.
- **gaearon** (Dan Abramov): **0 lines** (no profile repo / 404). Minimal sidebar bio with link to `danabra.mov`; 4 pinned repos (`react`, `react.dev`, `social-app`, `analysis`). 0 widgets.
- **mitchellh** (Mitchell Hashimoto): **0 lines** (no profile repo / 404). Sidebar link to `mitchellh.com`; 4 pinned repos (`ghostty`, `libxev`, `zig-overlay`, `vouch`). 0 widgets.
- **antirez** (Salvatore Sanfilippo): **0 lines** (no profile repo / 404). 1-sentence bio ("Computer programmer based in Sicily..."), blog link; 6 pinned repos (`rax`, `kilo`, `linenoise`, etc.). 0 widgets.
- **yyx990803** (Evan You): **0 lines** (no profile repo / 404). 1-sentence bio ("Founder @voidzero-dev, author of @vuejs..."), 6 pinned repos (`core`, `vite`, `rolldown`, etc.). 0 widgets.
- **sindresorhus** (Sindre Sorhus): **26 lines / 610 bytes** (`readme.md`). Nostalgic GeoCities parody with 10 vintage GIFs; exactly 2 functional links (latest app `Supercharge`, latest blog post). Deliberately omits all real stats, follower counts, and npm metrics.
- **kentcdodds** (Kent C. Dodds): **8 lines / 265 bytes**. Single banner image linking to personal domain + 1-line text link ("[Learn more about me](https://kentcdodds.com/about)"). 0 metrics, 0 badges, 0 tables.
- **DenverCoder1** (Jonah Lawrence): **294 lines / 28.3 KB**. Maximum widget saturation (meta-showcase for his own widget tools). Typing SVG, 5 live badge counters, 18 pinned repo/contribution cards, 70+ technology badges, streak stats card, language stats card, activity graph, raw recent event feed.
- **anuraghazra** (Anurag Hazra): **45 lines / 2.8 KB**. Creator of `github-readme-stats`. Header image, 4-bullet bio, 5 language icons, 2-col stats cards (showcasing his own tool), 2 pinned repo cards, social icons. Clean self-promotion.
- **schneegans** (Simon Schneegans): **19 lines / 1.2 KB**. 1-sentence current job at Carl Zeiss Jena, 1-paragraph spare-time OSS summary (4 linked tools), sponsors SVG. Explicitly commented out `github-readme-stats` in HTML comments.
- **abhisheknaiidu/awesome-github-profile-readme**: 378 lines categorizing profiles by gimmicks (typing effects, minigames, WakaTime, Spotify cards, dynamic shields). Community consensus treats the profile as a standalone canvas; top engineers treat it as an index or omit it entirely.

---

## 2. Derived Principles

1. **Code Over Meta-Code (Work Speaks First)**: Elite practitioners let shipping software and pinned repos carry authority. They do not write prose explaining that they write software.
2. **Zero Vanity Metrics**: Follower counts, watcher counts, star aggregators, and view counters signal junior insecurity or promotional bias. Real-world engineering impact is rarely reflected in profile hits.
3. **Never Display Zeroes or Low-Volume Telemetry**: Displaying metrics like "Stars: 0, Forks: 0" or event feeds dominated by "WatchEvent: 13" actively undermines perceived technical capability. Absence of metrics is neutral; low metrics are negative.
4. **Actionable Pointers Over Exhaustive CVs**: When a README exists (Dodds, Schneegans, Sorhus), it is a concise funnel (8–26 lines) directing visitors to production apps, main repositories, or personal sites.
5. **No Synthetic Tech-Stack Badge Grids**: Listing shields.io badges for basic tooling (HTML, CSS, Git, Markdown) is a universal junior hallmark. Technical capability is proven through project architecture in Selected Work.
6. **First-Party Visual Assets Over Fragile Third-Party SVGs**: Community profiles break when Vercel proxy endpoints fail or rate-limit. High-signal profiles use committed SVGs or plain markdown.
7. **Signal-to-Noise Ratio Reflects Seniority**: Brevity signals confidence and focus. Profiles under 30 lines project senior craftsmanship; 200+ line profiles project self-absorbed widget tinkering.
8. **Native Contribution Heatmap Is the Sole Activity Anchor**: The only activity visual broadly accepted across the engineering culture is the GitHub contribution heatmap. Gamified streaks and raw event tables are viewed as noise.

---

## 3. Application to manhquydev Profile

Current README structure:
- Typographic banner SVG + Tagline
- `About` (3 bullets: VinUni AI20K, FlowSkill maintainer / Teky instructor, focus & remote openness)
- `Selected Work` (Work SVG cards + 4-project curated index: FlowSkill, Sentinel, VietExplore AI, Ephemera)
- `Stack` (2-col table: AI/LLM, Languages, Frameworks, Data & Infra)
- 5 auto-generated marker blocks (HERO-KPI, GITHUB-ANALYTICS, CONTRIBUTION-GRAPH, CONTRIBUTION-ACTIVITY, PROJECT-STATS)
- `Connect` section

### Recommendations for the 5 Marker Blocks

| Marker Block | Verdict | Justification & Principle Alignment |
|---|---|---|
| `<!-- HERO-KPI -->` | **CLEAR** | Shows low values (Followers: 2, 30d Contribs: 8) with a stale 2026-05 timestamp. Violates Principles 2 & 3. GitHub's native header already displays follower/repo counts; duplicating low telemetry adds negative signal. |
| `<!-- GITHUB-ANALYTICS -->` | **CLEAR** | Explicitly displays "Stars: 0, Forks: 0, Public Gists: 0" and a distorted language split (`JavaScript: 1 · Python: 1`) that contradicts the real stack (TypeScript, FastAPI, Next.js). Violates Principles 3 & 5. |
| `<!-- CONTRIBUTION-GRAPH -->` | **KEEP** | Aligns with Principle 8. Uses locally committed, theme-aware SVGs (`contribution-heatmap-*.svg`). Demonstrates sustained coding rhythm cleanly without vanity counters or flaky external CDNs. |
| `<!-- CONTRIBUTION-ACTIVITY -->` | **CLEAR** | Redundant with the heatmap. The event table exposes trivial platform activity (`WatchEvent: 13, CreateEvent: 1`), signaling low development volume rather than technical output. Violates Principles 1 & 3. |
| `<!-- PROJECT-STATS -->` | **CLEAR** | Only displays `manhquydev` and `Flappy-Bird` with "Stars 0 \| Forks 0". Ignores real flagships (`FlowSkill`, `Sentinel`). Showcasing a toy Flappy-Bird repository with zero stars severely degrades portfolio credibility. Violates Principles 1, 3, & 4. |

### Target Profile Shape
Retaining the Typographic Banner, About, Selected Work, Stack, Contribution Heatmap (`CONTRIBUTION-GRAPH`), and Connect links produces an uncluttered, high-credibility profile (~70 lines) aligned with senior engineering standards.
