const fs = require("fs");

const README_PATH = "README.md";
const METRICS_DATA = "data/github-metrics.json";
const STATS_DATA = "data/project-stats.json";
const DASHBOARD_DIR = "assets/readme";
const DASHBOARD_LIGHT = `${DASHBOARD_DIR}/github-dashboard-light.svg`;
const DASHBOARD_DARK = `${DASHBOARD_DIR}/github-dashboard-dark.svg`;

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

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function ensureDirectory(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

function escapeMermaidLabel(value) {
  return String(value).replaceAll('"', '\\"');
}

function buildMermaidPieChart(title, items, labelKey, valueKey) {
  const safeItems = (items || [])
    .map((item) => ({
      label: item?.[labelKey] ?? "Unknown",
      value: Number(item?.[valueKey] ?? 0),
    }))
    .filter((item) => Number.isFinite(item.value) && item.value > 0);

  if (safeItems.length === 0) {
    return "_No chart data available._";
  }

  let chart = "```mermaid\n";
  chart += "pie showData\n";
  chart += `  title ${title}\n`;
  safeItems.forEach((item) => {
    chart += `  "${escapeMermaidLabel(item.label)}" : ${item.value}\n`;
  });
  chart += "```";
  return chart;
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

  markdown += "\n";
  markdown += buildMermaidPieChart(
    "Top Languages by Repository Count",
    languages,
    "language",
    "repositories"
  );
  markdown += "\n";
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

function formatDateCompact(value) {
  if (!value || !value.includes("T")) {
    return formatDate(value);
  }
  return `${value.slice(0, 10)} ${value.slice(11, 16)} UTC`;
}

function buildSvgDashboard(metrics, theme) {
  const user = metrics.user || {};
  const contribution = metrics.contribution || {};
  const languages = Array.isArray(metrics.topLanguages) ? metrics.topLanguages.slice(0, 5) : [];
  const series = Array.isArray(contribution.series) ? contribution.series.slice(-14) : [];

  const width = 1120;
  const height = 560;

  const cards = [
    { label: "Followers", value: user.followers ?? 0 },
    { label: "Public Repos", value: user.publicRepos ?? 0 },
    { label: "Contrib (30d)", value: contribution.totalContributionsLast30Days ?? 0 },
    { label: "Contrib (12m)", value: contribution.totalContributionsLastYear ?? 0 },
  ];

  const chartX = 48;
  const chartY = 252;
  const chartW = 670;
  const chartH = 230;

  const counts = series.map((item) => Number(item.count || 0));
  const maxCount = Math.max(...counts, 1);
  const barGap = 8;
  const barW = Math.floor((chartW - barGap * (series.length - 1)) / Math.max(series.length, 1));

  const langMax = Math.max(...languages.map((item) => Number(item.repositories || 0)), 1);
  const updatedAt = formatDateCompact(metrics.generatedAt || "");

  let svg = "";
  svg += `<?xml version="1.0" encoding="UTF-8"?>\n`;
  svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="GitHub visual dashboard">\n`;
  svg += `  <defs>\n`;
  svg += `    <linearGradient id="header-gradient" x1="0%" y1="0%" x2="100%" y2="0%">\n`;
  svg += `      <stop offset="0%" stop-color="${theme.gradientA}" />\n`;
  svg += `      <stop offset="100%" stop-color="${theme.gradientB}" />\n`;
  svg += `    </linearGradient>\n`;
  svg += `  </defs>\n`;
  svg += `  <rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="${theme.bg}" />\n`;
  svg += `  <rect x="0" y="0" width="${width}" height="88" rx="18" fill="url(#header-gradient)" />\n`;
  svg += `  <text x="38" y="54" fill="${theme.headerText}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="30" font-weight="700">GitHub Visual Dashboard</text>\n`;
  svg += `  <text x="${width - 340}" y="54" fill="${theme.headerText}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="16">Updated: ${escapeXml(updatedAt)}</text>\n`;

  const cardY = 116;
  const cardW = 246;
  const cardH = 110;
  const cardGap = 22;
  cards.forEach((card, index) => {
    const x = 48 + index * (cardW + cardGap);
    svg += `  <rect x="${x}" y="${cardY}" width="${cardW}" height="${cardH}" rx="14" fill="${theme.cardBg}" stroke="${theme.border}" />\n`;
    svg += `  <text x="${x + 18}" y="${cardY + 36}" fill="${theme.muted}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="15">${escapeXml(card.label)}</text>\n`;
    svg += `  <text x="${x + 18}" y="${cardY + 80}" fill="${theme.text}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="36" font-weight="700">${escapeXml(card.value)}</text>\n`;
  });

  svg += `  <text x="${chartX}" y="${chartY - 20}" fill="${theme.text}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="20" font-weight="600">Contribution Trend (Last 14 Days)</text>\n`;
  svg += `  <rect x="${chartX}" y="${chartY}" width="${chartW}" height="${chartH}" rx="12" fill="${theme.panel}" stroke="${theme.border}" />\n`;
  svg += `  <line x1="${chartX + 18}" y1="${chartY + chartH - 28}" x2="${chartX + chartW - 18}" y2="${chartY + chartH - 28}" stroke="${theme.grid}" />\n`;
  svg += `  <line x1="${chartX + 18}" y1="${chartY + 20}" x2="${chartX + 18}" y2="${chartY + chartH - 28}" stroke="${theme.grid}" />\n`;

  series.forEach((item, idx) => {
    const count = Number(item.count || 0);
    const h = Math.round((count / maxCount) * (chartH - 62));
    const x = chartX + 28 + idx * (barW + barGap);
    const y = chartY + chartH - 30 - h;
    svg += `  <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(h, 2)}" rx="4" fill="${theme.accent}" />\n`;
  });

  const langX = 760;
  const langY = 252;
  const langW = 312;
  const langH = 230;
  svg += `  <text x="${langX}" y="${langY - 20}" fill="${theme.text}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="20" font-weight="600">Top Languages</text>\n`;
  svg += `  <rect x="${langX}" y="${langY}" width="${langW}" height="${langH}" rx="12" fill="${theme.panel}" stroke="${theme.border}" />\n`;

  languages.forEach((item, idx) => {
    const y = langY + 40 + idx * 36;
    const barFull = 162;
    const barSize = Math.round((Number(item.repositories || 0) / langMax) * barFull);
    svg += `  <text x="${langX + 16}" y="${y}" fill="${theme.muted}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="14">${escapeXml(item.language)}</text>\n`;
    svg += `  <rect x="${langX + 132}" y="${y - 12}" width="${barFull}" height="14" rx="7" fill="${theme.gridSoft}" />\n`;
    svg += `  <rect x="${langX + 132}" y="${y - 12}" width="${Math.max(barSize, 4)}" height="14" rx="7" fill="${theme.accentAlt}" />\n`;
    svg += `  <text x="${langX + 300}" y="${y}" fill="${theme.text}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="14" text-anchor="end">${escapeXml(item.repositories)}</text>\n`;
  });

  svg += `  <text x="48" y="528" fill="${theme.muted}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="13">Source: GitHub REST API + GitHub GraphQL</text>\n`;
  svg += `</svg>\n`;
  return svg;
}

function writeDashboardAssets(metrics) {
  const lightTheme = {
    bg: "#f8fafc",
    panel: "#ffffff",
    cardBg: "#ffffff",
    border: "#d0d7de",
    text: "#111827",
    muted: "#6b7280",
    accent: "#2563eb",
    accentAlt: "#0ea5e9",
    grid: "#d1d5db",
    gridSoft: "#e5e7eb",
    gradientA: "#1d4ed8",
    gradientB: "#0f766e",
    headerText: "#f8fafc",
  };

  const darkTheme = {
    bg: "#0d1117",
    panel: "#161b22",
    cardBg: "#161b22",
    border: "#30363d",
    text: "#e6edf3",
    muted: "#9aa4b2",
    accent: "#58a6ff",
    accentAlt: "#3fb950",
    grid: "#30363d",
    gridSoft: "#21262d",
    gradientA: "#1f6feb",
    gradientB: "#2ea043",
    headerText: "#f8fafc",
  };

  ensureDirectory(DASHBOARD_DIR);
  fs.writeFileSync(DASHBOARD_LIGHT, buildSvgDashboard(metrics, lightTheme), "utf8");
  fs.writeFileSync(DASHBOARD_DARK, buildSvgDashboard(metrics, darkTheme), "utf8");
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

  markdown += "\n";
  markdown += buildMermaidPieChart(
    "Public Event Type Mix",
    eventTypes,
    "type",
    "count"
  );
  markdown += "\n";
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

    writeDashboardAssets(metrics);

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
