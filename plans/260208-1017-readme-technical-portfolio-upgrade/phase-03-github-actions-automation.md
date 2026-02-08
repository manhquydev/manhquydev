---
title: "Phase 3: GitHub Actions Automation"
status: pending
priority: P2
effort: 6h
---

# Phase 3: GitHub Actions Automation

## Context Links

- Parent: [plan.md](./plan.md)
- Depends on: [Phase 1](./phase-01-content-rewrites-and-structure.md), [Phase 2](./phase-02-visual-assets-creation.md)
- Strategy: [Brainstorm Report](../reports/brainstorm-260208-0914-readme-upgrade-strategy.md)

## Overview

**Date:** 2026-02-08
**Priority:** P2
**Implementation Status:** Not Started
**Review Status:** Pending

Implement GitHub Actions workflows for dynamic content: blog posts auto-update, project stats, WakaTime integration.

## Key Insights

- GitHub Actions now industry standard for dynamic READMEs
- Cron jobs run in UTC timezone
- Rate limits: 1000 requests/hour for authenticated API
- Cache aggressively to reduce API calls

## Requirements

### Functional
- Auto-fetch latest 3-5 blog posts daily
- Update project stats (stars, forks) weekly
- WakaTime weekly coding stats (optional)
- README auto-rebuild on schedule

### Non-Functional
- Workflows must not exceed GitHub Actions free tier
- Handle API failures gracefully
- Cache responses to minimize rate limit impact
- Idempotent updates (don't commit if unchanged)

## Architecture

```
.github/
└── workflows/
    ├── update-blog-posts.yml    # Daily at 00:00 UTC
    ├── update-project-stats.yml # Weekly on Monday
    └── update-wakatime.yml      # Weekly on Sunday (optional)

scripts/
├── fetch-blog-posts.js
├── fetch-project-stats.js
└── update-readme.js
```

## Related Code Files

### Files to Create
- `.github/workflows/update-blog-posts.yml`
- `.github/workflows/update-project-stats.yml`
- `.github/workflows/update-wakatime.yml`
- `scripts/fetch-blog-posts.js`
- `scripts/fetch-project-stats.js`
- `scripts/update-readme.js`

### Files to Modify
- `README.md` - Add placeholder markers

## Implementation Steps

### Step 1: README Placeholder Markers (0.5h)

Add markers for dynamic content replacement:

```markdown
<!-- BLOG-POST-LIST:START -->
<!-- BLOG-POST-LIST:END -->

<!-- PROJECT-STATS:START -->
<!-- PROJECT-STATS:END -->

<!-- WAKATIME:START -->
<!-- WAKATIME:END -->
```

### Step 2: Blog Posts Workflow (2h)

**File: `.github/workflows/update-blog-posts.yml`**

```yaml
name: Update Blog Posts

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:      # Manual trigger

jobs:
  update-blog-posts:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Fetch blog posts
        run: node scripts/fetch-blog-posts.js
        env:
          BLOG_RSS_URL: ${{ secrets.BLOG_RSS_URL }}

      - name: Update README
        run: node scripts/update-readme.js

      - name: Check for changes
        id: changes
        run: |
          if git diff --quiet README.md; then
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
          fi

      - name: Commit and push
        if: steps.changes.outputs.changed == 'true'
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add README.md
          git commit -m "docs: update blog posts [skip ci]"
          git push
```

**File: `scripts/fetch-blog-posts.js`**

```javascript
const https = require('https');
const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const RSS_URL = process.env.BLOG_RSS_URL || 'https://dev.to/feed/manhquydev';
const OUTPUT_FILE = 'data/blog-posts.json';
const MAX_POSTS = 5;

async function fetchRSS(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

async function main() {
  try {
    console.log('Fetching RSS feed...');
    const xml = await fetchRSS(RSS_URL);

    const parser = new XMLParser();
    const feed = parser.parse(xml);

    const items = feed.rss?.channel?.item || [];
    const posts = items.slice(0, MAX_POSTS).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate).toISOString().split('T')[0],
      description: item.description?.substring(0, 100) + '...'
    }));

    // Ensure data directory exists
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data');
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
    console.log(`Saved ${posts.length} posts to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    process.exit(1);
  }
}

main();
```

### Step 3: Project Stats Workflow (1.5h)

**File: `.github/workflows/update-project-stats.yml`**

```yaml
name: Update Project Stats

on:
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Monday at 6 AM UTC
  workflow_dispatch:

jobs:
  update-stats:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Fetch project stats
        run: node scripts/fetch-project-stats.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Update README
        run: node scripts/update-readme.js

      - name: Commit if changed
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git diff --quiet README.md || (git add README.md && git commit -m "docs: update project stats [skip ci]" && git push)
```

**File: `scripts/fetch-project-stats.js`**

```javascript
const https = require('https');
const fs = require('fs');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'manhquydev';
const REPOS = ['Python-Visualizer', 'student-forum-web', 'CodeVision_Academy'];
const OUTPUT_FILE = 'data/project-stats.json';

async function fetchRepo(owner, repo) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}`,
      headers: {
        'User-Agent': 'GitHub-Profile-Updater',
        'Authorization': `token ${GITHUB_TOKEN}`
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    });
  });
}

async function main() {
  try {
    const stats = {};

    for (const repo of REPOS) {
      console.log(`Fetching stats for ${repo}...`);
      const data = await fetchRepo(USERNAME, repo);
      stats[repo] = {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        watchers: data.watchers_count || 0,
        language: data.language,
        updated: data.updated_at
      };
    }

    if (!fs.existsSync('data')) {
      fs.mkdirSync('data');
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stats, null, 2));
    console.log('Project stats saved!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
```

### Step 4: WakaTime Workflow (Optional) (1h)

**File: `.github/workflows/update-wakatime.yml`**

```yaml
name: Update WakaTime Stats

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  update-wakatime:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Update WakaTime
        uses: athul/waka-readme@master
        with:
          WAKATIME_API_KEY: ${{ secrets.WAKATIME_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SHOW_TITLE: true
          SECTION_NAME: WAKATIME
          BLOCKS: ░▒▓█
          TIME_RANGE: last_7_days
          LANG_COUNT: 5
          SHOW_TIME: true
```

### Step 5: README Updater Script (1h)

**File: `scripts/update-readme.js`**

```javascript
const fs = require('fs');

const README_PATH = 'README.md';
const BLOG_DATA = 'data/blog-posts.json';
const STATS_DATA = 'data/project-stats.json';

function generateBlogSection() {
  if (!fs.existsSync(BLOG_DATA)) return '';

  const posts = JSON.parse(fs.readFileSync(BLOG_DATA, 'utf8'));

  let markdown = '### 📝 Latest Blog Posts\n\n';
  posts.forEach(post => {
    markdown += `- [${post.title}](${post.link}) - ${post.pubDate}\n`;
  });
  markdown += '\n_Auto-updated daily via GitHub Actions_\n';

  return markdown;
}

function generateStatsSection() {
  if (!fs.existsSync(STATS_DATA)) return '';

  const stats = JSON.parse(fs.readFileSync(STATS_DATA, 'utf8'));

  let markdown = '### 📊 Project Stats\n\n';
  markdown += '| Project | ⭐ Stars | 🍴 Forks |\n';
  markdown += '|---------|----------|----------|\n';

  Object.entries(stats).forEach(([repo, data]) => {
    markdown += `| ${repo} | ${data.stars} | ${data.forks} |\n`;
  });

  markdown += '\n_Updated weekly_\n';

  return markdown;
}

function updateSection(content, startMarker, endMarker, newContent) {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.warn(`Markers not found: ${startMarker}`);
    return content;
  }

  return content.slice(0, startIdx + startMarker.length) +
         '\n' + newContent +
         content.slice(endIdx);
}

function main() {
  let readme = fs.readFileSync(README_PATH, 'utf8');

  // Update blog posts
  const blogContent = generateBlogSection();
  if (blogContent) {
    readme = updateSection(
      readme,
      '<!-- BLOG-POST-LIST:START -->',
      '<!-- BLOG-POST-LIST:END -->',
      blogContent
    );
  }

  // Update project stats
  const statsContent = generateStatsSection();
  if (statsContent) {
    readme = updateSection(
      readme,
      '<!-- PROJECT-STATS:START -->',
      '<!-- PROJECT-STATS:END -->',
      statsContent
    );
  }

  fs.writeFileSync(README_PATH, readme);
  console.log('README updated successfully!');
}

main();
```

### Step 6: Package.json Setup

**File: `package.json`**

```json
{
  "name": "manhquydev-profile",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "update:blog": "node scripts/fetch-blog-posts.js && node scripts/update-readme.js",
    "update:stats": "node scripts/fetch-project-stats.js && node scripts/update-readme.js",
    "update:all": "npm run update:blog && npm run update:stats"
  },
  "dependencies": {
    "fast-xml-parser": "^4.3.0"
  }
}
```

## Todo List

- [ ] Add placeholder markers to README
- [ ] Create update-blog-posts.yml workflow
- [ ] Create fetch-blog-posts.js script
- [ ] Create update-project-stats.yml workflow
- [ ] Create fetch-project-stats.js script
- [ ] Create update-readme.js script
- [ ] Create package.json with dependencies
- [ ] Setup WakaTime workflow (optional)
- [ ] Add repository secrets (BLOG_RSS_URL, WAKATIME_API_KEY)
- [ ] Test workflows manually
- [ ] Verify cron schedules

## Success Criteria

- [ ] All workflows run without errors
- [ ] Blog posts update automatically
- [ ] Project stats reflect current values
- [ ] No duplicate commits (idempotent)
- [ ] Graceful failure handling

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rate limit exceeded | High | Cache responses, reduce frequency |
| RSS feed format changes | Medium | Add error handling, fallback |
| Workflow timeout | Low | Optimize scripts, add timeout |
| Token exposure | Critical | Use GitHub secrets only |

## Security Considerations

- Never commit API keys or tokens
- Use GitHub Secrets for all credentials
- GITHUB_TOKEN has minimal required permissions
- Audit workflow permissions regularly

## Next Steps

- Test all workflows in fork first
- Monitor first week of automated runs
- Proceed to Phase 4 for polish

## Unresolved Questions

1. Blog RSS feed URL confirmed?
2. WakaTime account exists? API key available?
3. Any additional repos to track stats for?
4. Preferred update frequency (daily/weekly)?
