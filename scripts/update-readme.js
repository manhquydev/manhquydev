const fs = require('fs');

// File paths
const README_PATH = 'README.md';
const BLOG_DATA = 'data/blog-posts.json';
const STATS_DATA = 'data/project-stats.json';

/**
 * Generate blog posts markdown section
 * @returns {string} Markdown content for blog posts
 */
function generateBlogSection() {
  if (!fs.existsSync(BLOG_DATA)) {
    console.warn('⚠ Blog posts data not found');
    return '';
  }

  const posts = JSON.parse(fs.readFileSync(BLOG_DATA, 'utf8'));

  let markdown = '### 📝 Latest Blog Posts\n\n';
  posts.forEach(post => {
    markdown += `- [${post.title}](${post.link}) - \`${post.pubDate}\`\n`;
  });
  markdown += '\n_Auto-updated daily via GitHub Actions_\n';

  return markdown;
}

/**
 * Generate project stats markdown section
 * @returns {string} Markdown content for project stats
 */
function generateStatsSection() {
  if (!fs.existsSync(STATS_DATA)) {
    console.warn('⚠ Project stats data not found');
    return '';
  }

  const stats = JSON.parse(fs.readFileSync(STATS_DATA, 'utf8'));

  let markdown = '### 📊 Live Project Stats\n\n';
  markdown += '| Project | ⭐ Stars | 🍴 Forks | 💻 Language |\n';
  markdown += '|---------|----------|----------|-------------|\n';

  Object.entries(stats).forEach(([repo, data]) => {
    markdown += `| [${repo}](${data.url}) | ${data.stars} | ${data.forks} | ${data.language} |\n`;
  });

  markdown += '\n_Updated weekly via GitHub Actions_\n';

  return markdown;
}

/**
 * Update section in README between markers
 * @param {string} content - README content
 * @param {string} startMarker - Start marker comment
 * @param {string} endMarker - End marker comment
 * @param {string} newContent - New content to insert
 * @returns {string} Updated README content
 */
function updateSection(content, startMarker, endMarker, newContent) {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.warn(`⚠ Markers not found: ${startMarker}`);
    return content;
  }

  return content.slice(0, startIdx + startMarker.length) +
         '\n' + newContent +
         content.slice(endIdx);
}

/**
 * Main execution function
 */
function main() {
  try {
    console.log('Reading README.md...');
    let readme = fs.readFileSync(README_PATH, 'utf8');

    // Update blog posts section
    const blogContent = generateBlogSection();
    if (blogContent) {
      console.log('Updating blog posts section...');
      readme = updateSection(
        readme,
        '<!-- BLOG-POST-LIST:START -->',
        '<!-- BLOG-POST-LIST:END -->',
        blogContent
      );
    }

    // Update project stats section
    const statsContent = generateStatsSection();
    if (statsContent) {
      console.log('Updating project stats section...');
      readme = updateSection(
        readme,
        '<!-- PROJECT-STATS:START -->',
        '<!-- PROJECT-STATS:END -->',
        statsContent
      );
    }

    // Write updated README
    fs.writeFileSync(README_PATH, readme);
    console.log('✓ README.md updated successfully!');
  } catch (error) {
    console.error('✗ Error updating README:', error.message);
    process.exit(1);
  }
}

main();
