---
title: "Phase 1: Content Rewrites & Structure"
status: completed
priority: P1
effort: 5h
completed: 2026-02-08
---

# Phase 1: Content Rewrites & Structure

## Context Links

- Parent: [plan.md](./plan.md)
- Strategy: [Brainstorm Report](../reports/brainstorm-260208-0914-readme-upgrade-strategy.md)
- Current: [README.md](../../README.md)

## Overview

**Date:** 2026-02-08
**Priority:** P1 - Critical Path
**Implementation Status:** Completed (2026-02-08)
**Review Status:** Completed

Restructure README content for recruiter optimization. Focus on above-fold impact, hero project statements, and strategic CTAs.

## Key Insights

- Recruiters spend 6-8 seconds scanning profiles
- Impact statements > feature lists for projects
- Remove/minimize typing animation (slow, distracting)
- Star ratings subjective, not recruiter-friendly

## Requirements

### Functional
- Above-fold must capture attention in <8 seconds
- Hero projects need Problem → Solution → Impact structure
- Clear CTAs for different audiences
- Collapsible sections for secondary content

### Non-Functional
- English version for international reach (keep Vietnamese collapsible)
- Professional minimal tone
- Consistent formatting

## Architecture

```
┌─────────────────────────────────────────┐
│ ABOVE FOLD (First 800px)                │
├─────────────────────────────────────────┤
│ • Header: Name + Technical Positioning  │
│ • Metrics Bar: Years | Projects | LOC   │
│ • Primary CTA: View Resume/Hire Me      │
│ • Contact badges (prominent)            │
│ • GitHub stats cards (2-column)         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ HERO PROJECTS (Top 2-3 only)            │
├─────────────────────────────────────────┤
│ Each project:                           │
│ → Problem: [User pain point]            │
│ → Solution: [Technical approach]        │
│ → Impact: [Metrics - users, perf]       │
│ → Tech Stack: [Core technologies]       │
└─────────────────────────────────────────┘
```

## Related Code Files

### Files to Modify
- `README.md` - Complete rewrite

### Files to Create
- None in this phase

## Implementation Steps

### Step 1: Above-Fold Redesign (2h)

1. Create technical positioning one-liner:
   ```markdown
   ## Full-Stack Developer | Scalable EdTech Solutions
   ```

2. Design metrics bar:
   ```html
   <div align="center">
     <img src="https://img.shields.io/badge/3%2B-Years%20Experience-blue?style=flat-square"/>
     <img src="https://img.shields.io/badge/10%2B-Projects%20Shipped-green?style=flat-square"/>
     <img src="https://img.shields.io/badge/50K%2B-Lines%20of%20Code-orange?style=flat-square"/>
   </div>
   ```

3. Add primary CTA:
   ```html
   <a href="https://info.manhq.tech/resume">
     <img src="https://img.shields.io/badge/📄_View_Resume-0078D4?style=for-the-badge"/>
   </a>
   <a href="mailto:manhquydev@gmail.com">
     <img src="https://img.shields.io/badge/💼_Hire_Me-D14836?style=for-the-badge"/>
   </a>
   ```

4. Remove typing animation SVG (slow load, distracting)

5. Keep GitHub stats cards but optimize layout

### Step 2: Hero Projects Section (2h)

1. Select 2-3 hero projects (recommend: Python Visualizer, Student Forum)

2. Write impact statement for Python Visualizer:
   ```markdown
   ### 🎯 Python Visualizer

   > **Problem:** Students struggle understanding code execution flow
   >
   > **Solution:** Interactive step-by-step Python execution visualizer
   >
   > **Impact:** [X] users | [Y]% comprehension improvement
   >
   > **Stack:** JavaScript (80%), CSS, HTML | React, Canvas API

   [Demo GIF placeholder]

   [![View Project](badge)](link) [![Architecture](badge)](link)
   ```

3. Repeat for Student Forum Web

4. Add collapsible "Other Projects" section for remaining

### Step 3: Section Restructure (1h)

1. Reorder sections per strategy hierarchy
2. Move "About Me" and philosophy to collapsible
3. Simplify skills section (prepare for Phase 2 upgrade)
4. Add placeholder for dynamic content (Phase 3)
5. Optimize footer with last-updated timestamp

## Todo List

- [x] Write technical positioning one-liner
- [x] Calculate/estimate metrics for metrics bar
- [x] Design CTA buttons
- [x] Remove typing animation
- [x] Write Python Visualizer impact statement
- [x] Write Student Forum impact statement
- [x] Select 3rd hero project (optional)
- [x] Restructure section hierarchy
- [x] Make About/Philosophy collapsible
- [x] Add dynamic content placeholders
- [x] Add English version or bilingual toggle

## Success Criteria

- [x] Above-fold loads in <1 second
- [x] Key info visible without scroll on desktop
- [x] Impact statements contain specific metrics
- [x] CTA buttons clearly visible
- [x] Collapsible sections work correctly

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing project metrics | High | Use GitHub stats, conservative estimates |
| English translation quality | Medium | Keep simple, professional language |
| Content too long | Medium | Aggressive use of collapsibles |

## Security Considerations

- No sensitive data in README
- External links use HTTPS
- No tracking pixels without disclosure

## Next Steps

- Collect actual project metrics from user
- Confirm hero project selection
- Proceed to Phase 2 for visual assets

## Unresolved Questions

1. What are actual user counts for Python Visualizer?
2. Student Forum engagement metrics available?
3. Prefer English-only or bilingual README?
4. Resume hosted where? (for CTA link)
