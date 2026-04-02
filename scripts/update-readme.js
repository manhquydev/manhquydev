const fs = require("fs");

const README_PATH = "README.md";
const METRICS_DATA = "data/github-metrics.json";
const STATS_DATA = "data/project-stats.json";

function updateSection(content, startMarker, endMarker, newContent) {
  if (!content.includes(startMarker) || !content.includes(endMarker)) {
    console.warn(`Markers not found: ${startMarker}`);
    return content;
  }

  const escapedStart = startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blockPattern = new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}`);
  const replacement = `${startMarker}\n${newContent.trimEnd()}\n${endMarker}`;

  return content.replace(blockPattern, replacement);
}

function formatDate(value) {
  if (!value) {
    return "N/A";
  }
  return value.slice(0, 10);
}

function formatDateTimeUtc(value) {
  if (!value) {
    return "N/A";
  }
  return `${value.slice(0, 19).replace("T", " ")} UTC`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function generateHeroKpiSection(metrics) {
  const user = metrics.user || {};
  const contribution = metrics.contribution || {};

  const followers = user.followers ?? 0;
  const publicRepos = user.publicRepos ?? 0;
  const last30 = contribution.totalContributionsLast30Days ?? 0;
  const lastYear = contribution.totalContributionsLastYear ?? 0;
  const updatedAt = formatDateTimeUtc(metrics.generatedAt || "");

  return [
    "<table>",
    "  <tr>",
    `    <td align="center"><strong>Followers</strong><br/>${followers}</td>`,
    `    <td align="center"><strong>Public Repos</strong><br/>${publicRepos}</td>`,
    `    <td align="center"><strong>Contributions (30d)</strong><br/>${last30}</td>`,
    `    <td align="center"><strong>Contributions (12m)</strong><br/>${lastYear}</td>`,
    "  </tr>",
    "</table>",
    "",
    `<sub>Last updated: ${updatedAt}</sub>`,
  ].join("\n");
}

function generateAnalyticsSection(metrics) {
  const user = metrics.user || {};
  const languages = Array.isArray(metrics.topLanguages) ? metrics.topLanguages : [];

  let markdown = "<table>\n";
  markdown += "  <tr><td><strong>Profile</strong></td>";
  markdown += `<td><a href="${escapeHtml(user.profileUrl || "#")}">${escapeHtml(user.login || "N/A")}</a></td></tr>\n`;
  markdown += `  <tr><td><strong>Following</strong></td><td>${user.following ?? 0}</td></tr>\n`;
  markdown += `  <tr><td><strong>Public Gists</strong></td><td>${user.publicGists ?? 0}</td></tr>\n`;
  markdown += `  <tr><td><strong>Total Stars (owned repos)</strong></td><td>${user.totalStars ?? 0}</td></tr>\n`;
  markdown += `  <tr><td><strong>Total Forks (owned repos)</strong></td><td>${user.totalForks ?? 0}</td></tr>\n`;
  markdown += `  <tr><td><strong>Account Created</strong></td><td>${formatDate(user.createdAt || "")}</td></tr>\n`;
  markdown += "</table>\n\n";

  markdown += "**Top Languages (by repository count)**\n\n";
  if (languages.length === 0) {
    markdown += "`N/A: 0`\n";
  } else {
    markdown += languages
      .map((item) => `\`${item.language}: ${item.repositories}\``)
      .join(" ");
    markdown += "\n";
  }

  markdown += "\n<sub>Source: GitHub REST API.</sub>\n";
  return markdown.trimEnd();
}

function buildSparkline(series) {
  const points = Array.isArray(series) ? series : [];
  if (points.length === 0) {
    return "";
  }

  const levels = [".", ":", "-", "=", "#"];
  const max = Math.max(...points.map((item) => item.count || 0), 1);

  return points
    .map((item) => {
      const count = item.count || 0;
      const index = Math.round((count / max) * (levels.length - 1));
      return levels[index];
    })
    .join("");
}

function buildHeatmapRows(weeks) {
  const lastWeeks = weeks.slice(-16);
  const levelChar = {
    NONE: ".",
    FIRST_QUARTILE: "-",
    SECOND_QUARTILE: "=",
    THIRD_QUARTILE: "#",
    FOURTH_QUARTILE: "@",
  };
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return weekdays.map((label, dayIndex) => {
    const trend = lastWeeks
      .map((week) => {
        const day = week.contributionDays?.[dayIndex];
        return levelChar[day?.contributionLevel] || ".";
      })
      .join("");
    return `${label}  ${trend}`;
  });
}

function generateContributionActivitySection(metrics) {
  const contribution = metrics.contribution || {};
  const series = Array.isArray(contribution.series) ? contribution.series : [];
  const eventTypes = Array.isArray(contribution.topEventTypes) ? contribution.topEventTypes : [];
  const totalYear = contribution.totalContributionsLastYear ?? 0;
  const last30 = contribution.totalContributionsLast30Days ?? 0;
  const sparkline = buildSparkline(series);
  const recentSeries = series.slice(-14);

  let markdown = `**Contributions (12m):** ${totalYear}  \n`;
  markdown += `**Contributions (30d):** ${last30}\n\n`;

  if (sparkline) {
    markdown += `\`${sparkline}\`\n\n`;
    markdown += "<sub>Trend line for recent days (`.` low -> `#` high).</sub>\n\n";
  }

  markdown += "<details>\n";
  markdown += "<summary>Daily breakdown (last 14 days)</summary>\n\n";
  markdown += "| Date | Contributions |\n";
  markdown += "|---|---:|\n";

  if (recentSeries.length === 0) {
    markdown += "| N/A | 0 |\n";
  } else {
    recentSeries.forEach((item) => {
      markdown += `| ${item.date} | ${item.count} |\n`;
    });
  }

  markdown += "\n</details>\n\n";
  markdown += "**Top Event Types (latest public events)**\n\n";
  markdown += "| Event Type | Count |\n";
  markdown += "|---|---:|\n";
  if (eventTypes.length === 0) {
    markdown += "| N/A | 0 |\n";
  } else {
    eventTypes.forEach((item) => {
      markdown += `| ${item.type} | ${item.count} |\n`;
    });
  }

  markdown += "\n<sub>Source: GitHub GraphQL + GitHub REST API.</sub>\n";
  return markdown.trimEnd();
}

function generateContributionGraphSection(metrics) {
  const contribution = metrics.contribution || {};
  const weeks = Array.isArray(contribution.calendarWeeks) ? contribution.calendarWeeks : [];

  if (weeks.length === 0) {
    return "_Contribution graph data is not available yet._\n";
  }

  const rows = buildHeatmapRows(weeks);
  let markdown = "```text\n";
  rows.forEach((row) => {
    markdown += `${row}\n`;
  });
  markdown += "```\n\n";
  markdown += "Legend: `.` none, `-` low, `=` medium, `#` high, `@` very high\n\n";
  markdown += "<sub>Source: GitHub GraphQL contribution calendar (last 16 weeks).</sub>\n";
  return markdown.trimEnd();
}

function generateProjectStatsSection(stats) {
  const entries = Object.entries(stats || {});

  if (entries.length === 0) {
    return "_No public repositories available for stats yet._\n";
  }

  let markdown = "<table>\n";
  entries.forEach(([repo, data]) => {
    const updated = formatDate(data.updated || "");
    markdown += "  <tr>\n";
    markdown += "    <td>\n";
    markdown += `      <strong><a href="${escapeHtml(data.url || "#")}">${escapeHtml(repo)}</a></strong><br/>\n`;
    markdown += `      ${escapeHtml(data.language || "N/A")} | Stars ${data.stars ?? 0} | Forks ${data.forks ?? 0} | Watchers ${data.watchers ?? 0} | Updated ${updated}\n`;
    markdown += "    </td>\n";
    markdown += "  </tr>\n";
  });
  markdown += "</table>\n\n";
  markdown += "<sub>Source: GitHub REST API.</sub>\n";
  return markdown.trimEnd();
}

function loadJson(path, fallback) {
  if (!fs.existsSync(path)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function main() {
  try {
    const metrics = loadJson(METRICS_DATA, {});
    const stats = loadJson(STATS_DATA, {});
    let readme = fs.readFileSync(README_PATH, "utf8");

    readme = updateSection(
      readme,
      "<!-- HERO-KPI:START -->",
      "<!-- HERO-KPI:END -->",
      generateHeroKpiSection(metrics)
    );

    readme = updateSection(
      readme,
      "<!-- GITHUB-ANALYTICS:START -->",
      "<!-- GITHUB-ANALYTICS:END -->",
      generateAnalyticsSection(metrics)
    );

    readme = updateSection(
      readme,
      "<!-- CONTRIBUTION-ACTIVITY:START -->",
      "<!-- CONTRIBUTION-ACTIVITY:END -->",
      generateContributionActivitySection(metrics)
    );

    readme = updateSection(
      readme,
      "<!-- CONTRIBUTION-GRAPH:START -->",
      "<!-- CONTRIBUTION-GRAPH:END -->",
      generateContributionGraphSection(metrics)
    );

    readme = updateSection(
      readme,
      "<!-- PROJECT-STATS:START -->",
      "<!-- PROJECT-STATS:END -->",
      generateProjectStatsSection(stats)
    );

    fs.writeFileSync(README_PATH, readme, "utf8");
    console.log("README.md updated successfully");
  } catch (error) {
    console.error(`Error updating README: ${error.message}`);
    process.exit(1);
  }
}

main();
