# GitHub Profile README Patterns — Research Note

- Observed: 2026-10-12 (raw READMEs fetched the same day; re-verify before reusing)
- Method: fetched `raw.githubusercontent.com/<user>/<user>/HEAD/README.md` for 10 named users + skimmed the `abhisheknaiidu/awesome-github-profile-readme` curated list. Sample is small and non-random; only 5/10 had a profile README. Findings below are observations about this sample, not universal rules.

## 1. Per-profile observations

All URLs fetched 2026-10-12; HTTP status, line counts, and byte sizes recorded as returned.

| User | README URL | Lines | Live stats/widgets? | Notable sections |
|---|---|---|---|---|
| torvalds | https://raw.githubusercontent.com/torvalds/torvalds/HEAD/README.md | 0 (404) | none | No profile README; native sidebar + 5 pinned repos only |
| gaearon | https://raw.githubusercontent.com/gaearon/gaearon/HEAD/README.md | 0 (404) | none | No profile README; minimal sidebar bio, 4 pinned repos |
| mitchellh | https://raw.githubusercontent.com/mitchellh/mitchellh/HEAD/README.md | 0 (404) | none | No profile README; sidebar link to mitchellh.com |
| antirez | https://raw.githubusercontent.com/antirez/antirez/HEAD/README.md | 0 (404) | none | No profile README; 1-sentence bio, 6 pinned repos |
| yyx990803 | https://raw.githubusercontent.com/yyx990803/yyx990803/HEAD/README.md | 0 (404) | none | No profile README; 1-sentence bio, 6 pinned repos |
| sindresorhus | https://raw.githubusercontent.com/sindresorhus/sindresorhus/HEAD/readme.md | 26 (610 B) | none | Retro GeoCities parody; exactly 2 links (app + blog); zero real stats |
| kentcdodds | https://raw.githubusercontent.com/kentcdodds/kentcdodds/HEAD/README.md | 8 (265 B) | none | Single banner image + 1 text link to kentcdodds.com/about |
| DenverCoder1 | https://raw.githubusercontent.com/DenverCoder1/DenverCoder1/HEAD/README.md | 294 (28.4 KB) | yes — heavily | Typing SVG, badge counters, repo/contribution cards, streak + language stats, activity graph; author of the widgets he demos |
| anuraghazra | https://raw.githubusercontent.com/anuraghazra/anuraghazra/HEAD/README.md | 45 (2.8 KB) | yes — own tool | Creator of github-readme-stats; 2-col stats cards demoing his tool, 2 pinned repo cards, social icons |
| schneegans | https://raw.githubusercontent.com/schneegans/schneegans/HEAD/README.md | 19 (1.2 KB) | sponsors SVG only | 1-sentence job line + spare-time OSS paragraph (4 linked tools); github-readme-stats present only inside HTML comments |

Note: `sindresorhus` serves the file at the lowercase `readme.md` path; the `README.md` casing returns 404. Both casings were checked for every 404 user above.

## 2. Observed patterns (sample-level)

1. In this sample, 5 of 10 profiles contained no profile README at all (404): torvalds, gaearon, mitchellh, antirez, yyx990803.
2. In this sample, the READMEs that did exist were mostly short: 4 of 5 were 8–45 lines (kentcdodds 8, schneegans 19, sindresorhus 26, anuraghazra 45); only DenverCoder1 was long (294 lines).
3. In this sample, the widget-heavy profile (DenverCoder1, 294 lines) belongs to an author demoing his own widget tools; anuraghazra likewise uses his stats cards to showcase github-readme-stats itself.
4. In this sample, none of the 5 profiles with READMEs displayed account-level vanity counters (follower/star totals); sindresorhus deliberately links only to an app and a blog post, and schneegans keeps github-readme-stats commented out.
5. In this sample, when a README existed it mostly functioned as a short funnel to a personal site, a flagship repo, or a small set of linked tools — plus the two self-promotional stats-card cases above.

## 3. Recommendations applied to manhquydev (editorial judgment — clearly labeled as ours, not findings)

Kept: banner SVG, About, Selected Work, Stack, Activity heatmap (real data), Connect.

Cleared: HERO-KPI, GITHUB-ANALYTICS, CONTRIBUTION-ACTIVITY, PROJECT-STATS — rationale: vanity/zero signals (6 followers, Stars 0 at decision time), event-type noise (WatchEvent 13), and PROJECT-STATS auto-listing uncurated repos (e.g. test/test repos) that leak past editorial selection.

Explicit hypotheses, NOT evidence:
- We hypothesize short profiles project craft; the "under 30 lines signals senior craftsmanship" idea is an aesthetic prior from this tiny sample, not a measured effect.
- We hypothesize badge grids read as junior signals. Plausible, untested here.

## 4. Post-study data refresh (2026-10-12)

A real authenticated API fetch on 2026-10-12 replaced the stale May-2026 snapshot: followers 6, contributions 12m 2551 / 30d 126, stars 9, public repos 50, languages Python 8 · TypeScript 4 · JavaScript 3 · HTML 3 · Shell 2 · Rust 1. Heatmap + activity now render real data; the earlier keep/clear verdicts stand after seeing real numbers (vanity counters removed regardless of their values).
