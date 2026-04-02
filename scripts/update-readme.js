const fs = require("fs");

const README_PATH = "README.md";
const BLOG_DATA = "data/blog-posts.json";
const STATS_DATA = "data/project-stats.json";

function generateBlogSection() {
  if (!fs.existsSync(BLOG_DATA)) {
    console.warn("Blog posts data not found");
    return "";
  }

  const posts = JSON.parse(fs.readFileSync(BLOG_DATA, "utf8"));
  let markdown = "### Latest Blog Posts\n\n";

  if (!Array.isArray(posts) || posts.length === 0) {
    markdown += "_No recent Dev.to posts found._\n";
    return markdown;
  }

  posts.forEach((post) => {
    markdown += `- [${post.title}](${post.link})`;
    if (post.pubDate) {
      markdown += ` - \`${post.pubDate}\``;
    }
    markdown += "\n";
  });
  markdown += "\n_Auto-updated daily via GitHub Actions._\n";

  return markdown;
}

function generateStatsSection() {
  if (!fs.existsSync(STATS_DATA)) {
    console.warn("Project stats data not found");
    return "";
  }

  const stats = JSON.parse(fs.readFileSync(STATS_DATA, "utf8"));
  let markdown = "### Live Project Stats\n\n";

  if (!stats || Object.keys(stats).length === 0) {
    markdown += "_No public repositories available for stats yet._\n";
    return markdown;
  }

  markdown += "| Project | Stars | Forks | Language |\n";
  markdown += "|---------|-------|-------|----------|\n";

  Object.entries(stats).forEach(([repo, data]) => {
    markdown += `| [${repo}](${data.url}) | ${data.stars} | ${data.forks} | ${data.language} |\n`;
  });

  markdown += "\n_Updated weekly via GitHub Actions._\n";
  return markdown;
}

function updateSection(content, startMarker, endMarker, newContent) {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.warn(`Markers not found: ${startMarker}`);
    return content;
  }

  return (
    content.slice(0, startIdx + startMarker.length) +
    "\n" +
    newContent +
    content.slice(endIdx)
  );
}

function main() {
  try {
    let readme = fs.readFileSync(README_PATH, "utf8");

    const blogContent = generateBlogSection();
    if (blogContent) {
      readme = updateSection(
        readme,
        "<!-- BLOG-POST-LIST:START -->",
        "<!-- BLOG-POST-LIST:END -->",
        blogContent
      );
    }

    const statsContent = generateStatsSection();
    if (statsContent) {
      readme = updateSection(
        readme,
        "<!-- PROJECT-STATS:START -->",
        "<!-- PROJECT-STATS:END -->",
        statsContent
      );
    }

    fs.writeFileSync(README_PATH, readme, "utf8");
    console.log("README.md updated successfully");
  } catch (error) {
    console.error(`Error updating README: ${error.message}`);
    process.exit(1);
  }
}

main();
