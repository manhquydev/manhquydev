# GitHub Profile Maintenance Guide

## Automated Maintenance

### Daily (Automated)
- **Blog Posts Update** (00:00 UTC)
  - Workflow: `.github/workflows/update-blog-posts.yml`
  - Source: Dev.to RSS feed
  - Check: Actions tab for workflow status

### Weekly (Automated)
- **Project Stats Update** (Monday 06:00 UTC)
  - Workflow: `.github/workflows/update-project-stats.yml`
  - Updates: Stars, forks, language stats
  - Check: Actions tab for workflow status

## Manual Maintenance

### Weekly Checks
- [ ] Verify workflows ran successfully (Actions tab)
- [ ] Check for broken images in README
- [ ] Review GitHub Insights (profile views)

### Monthly Tasks
- [ ] Audit blog post integration (verify latest posts show)
- [ ] Check project stats accuracy
- [ ] Test README on mobile devices
- [ ] Review and update project descriptions if needed

### Quarterly Reviews
- [ ] Full accessibility audit (WCAG AA compliance)
- [ ] Performance audit (load time <2s)
- [ ] Update project showcase if new flagship projects
- [ ] Review and update skills radar chart data
- [ ] Check all external links still work

## Monitoring Checklist

### Workflow Health
```bash
# Check workflow runs
gh run list --limit 10

# View specific workflow
gh run view <run-id>
```

### Performance Metrics
- Profile views: Track via badge in README
- Load time: Should be <2s on 3G
- Asset size: Keep total <500KB (currently 5.4KB)

### Content Freshness
- Blog posts: Auto-updated daily
- Project stats: Auto-updated weekly
- Manual content: Review quarterly

## Troubleshooting

### Workflow Failures
1. Check Actions tab for error logs
2. Verify GitHub token permissions
3. Check if external APIs are accessible
4. Re-run failed workflow manually

### Content Not Updating
1. Verify `data/` directory exists
2. Check workflow permissions (Settings → Actions)
3. Ensure markers exist in README:
   - `<!-- BLOG-POST-LIST:START/END -->`
   - `<!-- PROJECT-STATS:START/END -->`

### Image Display Issues
1. Check file paths are relative (`./assets/...`)
2. Verify images committed to repository
3. Test on different GitHub themes (light/dark)

## Repository Settings

### Required Settings
- **Actions**: Enabled (Allow all actions)
- **Workflow Permissions**: Read and write
- **Description**: "Full-Stack Developer | EdTech Solutions | Interactive Learning Platforms"
- **Topics**: edtech, fullstack, javascript, react, nodejs, education, portfolio
- **Website**: https://www.manhquy.id.vn/

### Security
- Never commit `data/*.json` files (in `.gitignore`)
- GitHub secrets managed via Settings → Secrets
- Workflows use `[skip ci]` to prevent loops

## Contact for Issues

- Email: manhquydev@gmail.com
- GitHub Issues: Create issue in repository
- Automation: Check `.github/workflows/` for configuration

---

**Last Updated:** 2026-02-08
**Status:** Active, Fully Automated
