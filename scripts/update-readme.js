const fs = require("fs");

const README_PATH = "README.md";
const METRICS_DATA = "data/github-metrics.json";
const STATS_DATA = "data/project-stats.json";

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

function generateAnalyticsSection(metrics) {
  const user = metrics.user || {};
  const languages = Array.isArray(metrics.topLanguages) ? metrics.topLanguages : [];

  let markdown = "| Metric | Value |\n";
  markdown += "|---|---|\n";
  markdown += `| Profile | [${user.login || "N/A"}](${user.profileUrl || "#"}) |\n`;
  markdown += `| Followers | ${user.followers ?? "N/A"} |\n`;
  markdown += `| Following | ${user.following ?? "N/A"} |\n`;
  markdown += `| Public Repositories | ${user.publicRepos ?? "N/A"} |\n`;
  markdown += `| Public Gists | ${user.publicGists ?? "N/A"} |\n`;
  markdown += `| Total Stars (owned repos) | ${user.totalStars ?? "N/A"} |\n`;
  markdown += `| Total Forks (owned repos) | ${user.totalForks ?? "N/A"} |\n`;
  markdown += `| Account Created | ${(user.createdAt || "N/A").slice(0, 10)} |\n`;
  markdown += `| Last Updated (UTC) | ${(metrics.generatedAt || "N/A").slice(0, 19)} |\n\n`;

  markdown += "Top Languages (by repository count)\n\n";
  markdown += "| Language | Repositories |\n";
  markdown += "|---|---|\n";
  if (languages.length === 0) {
    markdown += "| N/A | 0 |\n";
  } else {
    languages.forEach((item) => {
      markdown += `| ${item.language} | ${item.repositories} |\n`;
    });
  }

  markdown += "\n_Source: GitHub REST API._\n";
  return markdown;
}

function generateContributionActivitySection(metrics) {
  const contribution = metrics.contribution || {};
  const series = Array.isArray(contribution.series) ? contribution.series : [];
  const eventTypes = Array.isArray(contribution.topEventTypes) ? contribution.topEventTypes : [];
  const totalYear = contribution.totalContributionsLastYear ?? 0;
  const last30 = contribution.totalContributionsLast30Days ?? 0;

  let markdown = `Total Contributions (Last 12 Months): **${totalYear}**  \n`;
  markdown += `Total Contributions (Last 30 Days): **${last30}**\n\n`;
  markdown += `Daily trend (last ${contribution.days || 30} days)\n\n`;
  markdown += "| Date | Contributions | Trend |\n";
  markdown += "|---|---:|---|\n";

  if (series.length === 0) {
    markdown += "| N/A | 0 | |\n";
  } else {
    series.forEach((item) => {
      markdown += `| ${item.date} | ${item.count} | ${item.bar || "."} |\n`;
    });
  }

  markdown += "\nTop Event Types (latest public events)\n\n";
  markdown += "| Event Type | Count |\n";
  markdown += "|---|---:|\n";
  if (eventTypes.length === 0) {
    markdown += "| N/A | 0 |\n";
  } else {
    eventTypes.forEach((item) => {
      markdown += `| ${item.type} | ${item.count} |\n`;
    });
  }

  markdown += "\n_Source: GitHub GraphQL + GitHub REST API._\n";
  return markdown;
}

function generateContributionGraphSection(metrics) {
  const contribution = metrics.contribution || {};
  const weeks = Array.isArray(contribution.calendarWeeks) ? contribution.calendarWeeks : [];

  if (weeks.length === 0) {
    return "_Contribution graph data is not available yet._\n";
  }

  const lastWeeks = weeks.slice(-12);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const levelChar = {
    NONE: ".",
    FIRST_QUARTILE: "-",
    SECOND_QUARTILE: "=",
    THIRD_QUARTILE: "#",
    FOURTH_QUARTILE: "@",
  };

  const rows = weekdays.map((label, dayIndex) => {
    let trend = "";
    lastWeeks.forEach((week) => {
      const day = week.contributionDays?.[dayIndex];
      trend += levelChar[day?.contributionLevel] || ".";
    });
    return { label, trend };
  });

  let markdown = "GitHub contribution heatmap (last 12 weeks)\n\n";
  markdown += "| Day | Pattern |\n";
  markdown += "|---|---|\n";
  rows.forEach((row) => {
    markdown += `| ${row.label} | \`${row.trend}\` |\n`;
  });
  markdown += "\nLegend: `.` none, `-` low, `=` medium, `#` high, `@` very high\n";
  markdown += "\n_Source: GitHub GraphQL contributions calendar._\n";
  return markdown;
}

function generateProjectStatsSection(stats) {
  const entries = Object.entries(stats || {});

  if (entries.length === 0) {
    return "_No public repositories available for stats yet._\n";
  }

  let markdown = "| Project | Stars | Forks | Language |\n";
  markdown += "|---|---:|---:|---|\n";
  entries.forEach(([repo, data]) => {
    markdown += `| [${repo}](${data.url}) | ${data.stars} | ${data.forks} | ${data.language} |\n`;
  });

  markdown += "\n_Source: GitHub REST API._\n";
  return markdown;
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