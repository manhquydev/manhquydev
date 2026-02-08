---
title: "Phase 2: Visual Assets Creation"
status: pending
priority: P2
effort: 6h
---

# Phase 2: Visual Assets Creation

## Context Links

- Parent: [plan.md](./plan.md)
- Depends on: [Phase 1](./phase-01-content-rewrites-and-structure.md)
- Strategy: [Brainstorm Report](../reports/brainstorm-260208-0914-readme-upgrade-strategy.md)

## Overview

**Date:** 2026-02-08
**Priority:** P2
**Implementation Status:** Not Started
**Review Status:** Pending

Create visual assets: demo GIFs, SVG skill radar chart, progress bars. Optimize all images for performance.

## Key Insights

- SVG preferred over PNG for scalability and performance
- GitHub CDN automatically caches images
- Demo GIFs most effective for showing project value
- Progress bars more recruiter-friendly than star ratings

## Requirements

### Functional
- Demo GIFs for 2-3 hero projects
- SVG skill radar chart (auto-generatable)
- Progress bars for "Currently Learning"
- All images with alt text

### Non-Functional
- Total image payload <500KB
- WebP/optimized formats where supported
- Mobile responsive (scales properly)
- Dark/light theme compatible

## Architecture

```
assets/
├── skill-radar.svg          # Generated or designed
├── demo-gifs/
│   ├── python-visualizer.gif
│   └── student-forum.gif
└── progress-bars/
    └── learning-progress.svg
```

## Related Code Files

### Files to Create
- `assets/skill-radar.svg`
- `assets/demo-gifs/python-visualizer.gif`
- `assets/demo-gifs/student-forum.gif`
- `assets/progress-bars/learning-progress.svg`

### Files to Modify
- `README.md` - Add image references

## Implementation Steps

### Step 1: Demo GIFs Creation (3h)

1. **Python Visualizer GIF:**
   - Screen record key interaction (15-30 seconds max)
   - Show: Input code → Step execution → Visual output
   - Tools: OBS Studio, ScreenToGif, or Loom
   - Optimize: <2MB, 800px width max

   ```bash
   # Optimization with ffmpeg
   ffmpeg -i input.gif -vf "fps=10,scale=800:-1" -loop 0 output.gif

   # Or use gifsicle
   gifsicle -O3 --lossy=80 input.gif -o output.gif
   ```

2. **Student Forum GIF:**
   - Show: Navigation → Post creation → Discussion thread
   - Same optimization parameters

3. **Fallback Strategy:**
   - If GIFs time-consuming, start with static screenshots
   - Use GitHub opengraph images as placeholder
   - Upgrade to GIFs in future iteration

### Step 2: SVG Skill Radar Chart (2h)

1. **Option A: Use online generator**
   - [Chart.js Radar](https://www.chartjs.org/docs/latest/charts/radar.html)
   - Export as SVG

2. **Option B: Hand-craft SVG**
   ```svg
   <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
     <!-- Background circles -->
     <circle cx="200" cy="200" r="150" fill="none" stroke="#e0e0e0"/>
     <circle cx="200" cy="200" r="100" fill="none" stroke="#e0e0e0"/>
     <circle cx="200" cy="200" r="50" fill="none" stroke="#e0e0e0"/>

     <!-- Skill polygon -->
     <polygon points="200,50 350,150 300,350 100,350 50,150"
              fill="rgba(53,132,228,0.3)" stroke="#3584E4" stroke-width="2"/>

     <!-- Labels -->
     <text x="200" y="40" text-anchor="middle">Frontend</text>
     <text x="360" y="150" text-anchor="start">Backend</text>
     <text x="310" y="370" text-anchor="middle">Database</text>
     <text x="90" y="370" text-anchor="middle">DevOps</text>
     <text x="30" y="150" text-anchor="end">AI/ML</text>
   </svg>
   ```

3. **Option C: Use existing service**
   - [Skillicons.dev](https://skillicons.dev/)
   - [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats)

4. **Data for radar (scale 1-5):**
   - Frontend: 5 (JavaScript, React, HTML/CSS)
   - Backend: 4 (Node.js, Express)
   - Database: 3 (MongoDB, MySQL)
   - DevOps: 2 (Git, basic CI/CD)
   - AI/ML: 2 (learning)

### Step 3: Progress Bars for Learning (0.5h)

1. **Use shields.io progress bars:**
   ```markdown
   ![TensorFlow](https://progress-bar.dev/30/?title=TensorFlow&color=FF6F00)
   ![GraphQL](https://progress-bar.dev/40/?title=GraphQL&color=E10098)
   ![Microservices](https://progress-bar.dev/50/?title=Microservices&color=326CE5)
   ```

2. **Alternative: Custom SVG progress bars**
   ```svg
   <svg width="200" height="20">
     <rect width="200" height="20" fill="#e0e0e0" rx="5"/>
     <rect width="60" height="20" fill="#3584E4" rx="5"/>
     <text x="100" y="14" text-anchor="middle" fill="white">TensorFlow 30%</text>
   </svg>
   ```

### Step 4: Image Optimization (0.5h)

1. **Compress all images:**
   ```bash
   # For PNGs
   pngquant --quality=65-80 image.png

   # For GIFs
   gifsicle -O3 --lossy=80 input.gif -o output.gif

   # Online tools
   # - TinyPNG
   # - Squoosh.app
   ```

2. **Verify sizes:**
   - Each GIF: <2MB
   - Each SVG: <50KB
   - Total assets: <5MB

3. **Add alt text to all images in README**

## Todo List

- [ ] Record Python Visualizer demo
- [ ] Create Python Visualizer GIF
- [ ] Record Student Forum demo
- [ ] Create Student Forum GIF
- [ ] Design/generate skill radar chart
- [ ] Create progress bars for learning section
- [ ] Compress all images
- [ ] Add alt text to README images
- [ ] Test dark/light theme compatibility
- [ ] Verify mobile responsiveness

## Success Criteria

- [ ] All GIFs load in <3 seconds on 3G
- [ ] SVG renders correctly on GitHub
- [ ] Images scale properly on mobile
- [ ] Total assets under 5MB
- [ ] All images have alt text

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| GIF creation time-consuming | High | Start with screenshots, upgrade later |
| SVG rendering issues | Medium | Test on multiple browsers |
| Large file sizes | Medium | Aggressive optimization |

## Security Considerations

- No sensitive data visible in GIFs
- No personal info in demo recordings
- Use GitHub-hosted assets (CDN)

## Next Steps

- Complete GIF recordings
- Test all assets on GitHub preview
- Proceed to Phase 3 for automation

## Unresolved Questions

1. Access to running instances for demo recording?
2. Preferred color scheme for charts (match existing theme)?
3. Any existing brand assets to incorporate?
