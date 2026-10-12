const fs = require("fs");

const README_PATH = "README.md";
const METRICS_DATA = "data/github-metrics.json";
const HEATMAP_DIR = "assets/readme";
const HEATMAP_LIGHT = `${HEATMAP_DIR}/contribution-heatmap-light.svg`;
const HEATMAP_DARK = `${HEATMAP_DIR}/contribution-heatmap-dark.svg`;

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

function ensureDirectory(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

function buildContributionHeatmapSvg(metrics, theme) {
  const weeksAll = metrics?.contribution?.calendarWeeks || [];
  const weeks = weeksAll.slice(-26);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const width = 1120;
  const height = 260;
  const gridX = 130;
  const gridY = 56;
  const cell = 12;
  const gap = 4;

  const colors = {
    NONE: theme.none,
    FIRST_QUARTILE: theme.q1,
    SECOND_QUARTILE: theme.q2,
    THIRD_QUARTILE: theme.q3,
    FOURTH_QUARTILE: theme.q4,
  };

  let svg = "";
  svg += `<?xml version="1.0" encoding="UTF-8"?>\n`;
  svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="GitHub contribution heatmap">\n`;
  svg += `  <rect x="0" y="0" width="${width}" height="${height}" rx="16" fill="${theme.bg}" />\n`;
  svg += `  <text x="30" y="36" fill="${theme.text}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="22" font-weight="700">Contribution Heatmap (Last 26 Weeks)</text>\n`;

  days.forEach((day, idx) => {
    const y = gridY + idx * (cell + gap) + 10;
    svg += `  <text x="30" y="${y}" fill="${theme.muted}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="13">${day}</text>\n`;
  });

  weeks.forEach((week, w) => {
    const x = gridX + w * (cell + gap);
    (week.contributionDays || []).forEach((d, i) => {
      const y = gridY + i * (cell + gap);
      const fill = colors[d.contributionLevel] || colors.NONE;
      svg += `  <rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="3" fill="${fill}" />\n`;
    });
  });

  const legendX = 30;
  const legendY = 205;
  svg += `  <text x="${legendX}" y="${legendY}" fill="${theme.muted}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12">Less</text>\n`;
  [colors.NONE, colors.FIRST_QUARTILE, colors.SECOND_QUARTILE, colors.THIRD_QUARTILE, colors.FOURTH_QUARTILE].forEach((c, idx) => {
    const x = legendX + 36 + idx * 18;
    svg += `  <rect x="${x}" y="${legendY - 10}" width="12" height="12" rx="3" fill="${c}" />\n`;
  });
  svg += `  <text x="${legendX + 134}" y="${legendY}" fill="${theme.muted}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12">More</text>\n`;
  svg += `  <text x="30" y="236" fill="${theme.muted}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12">Source: GitHub GraphQL contribution calendar</text>\n`;
  svg += `</svg>\n`;
  return svg;
}

function writeContributionHeatmapAssets(metrics) {
  const lightTheme = {
    bg: "#ffffff",
    text: "#1f2328",
    muted: "#57606a",
    none: "#f0f2f5",
    q1: "#d7dee6",
    q2: "#b3c2d1",
    q3: "#8aa5bc",
    q4: "#5f83a3",
  };

  const darkTheme = {
    bg: "#0d1117",
    text: "#e6edf3",
    muted: "#9aa4b2",
    none: "#1c2128",
    q1: "#2a3a48",
    q2: "#3a5064",
    q3: "#4d6a82",
    q4: "#6d8fac",
  };

  ensureDirectory(HEATMAP_DIR);
  fs.writeFileSync(HEATMAP_LIGHT, buildContributionHeatmapSvg(metrics, lightTheme), "utf8");
  fs.writeFileSync(HEATMAP_DARK, buildContributionHeatmapSvg(metrics, darkTheme), "utf8");
}

function generateContributionGraphSection(metrics) {
  const contribution = metrics.contribution || {};
  const weeks = Array.isArray(contribution.calendarWeeks) ? contribution.calendarWeeks : [];

  if (weeks.length === 0) {
    return "_Contribution graph data is not available yet._";
  }

  let markdown = "<div align=\"center\">\n";
  markdown += "  <picture>\n";
  markdown += "    <source media=\"(prefers-color-scheme: dark)\" srcset=\"./assets/readme/contribution-heatmap-dark.svg\">\n";
  markdown += "    <source media=\"(prefers-color-scheme: light)\" srcset=\"./assets/readme/contribution-heatmap-light.svg\">\n";
  markdown += "    <img alt=\"Contribution Heatmap\" src=\"./assets/readme/contribution-heatmap-light.svg\" width=\"100%\">\n";
  markdown += "  </picture>\n";
  markdown += "</div>";
  return markdown;
}

function loadJson(path) {
  if (!fs.existsSync(path)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function main() {
  try {
    const metrics = loadJson(METRICS_DATA);

    if (!metrics || typeof metrics !== "object" || Object.keys(metrics).length === 0) {
      console.error(
        `Missing or empty data file: ${METRICS_DATA} — run fetch scripts first; README not modified.`
      );
      process.exit(1);
    }

    let readme = fs.readFileSync(README_PATH, "utf8");

    writeContributionHeatmapAssets(metrics);

    readme = updateSection(
      readme,
      "<!-- CONTRIBUTION-GRAPH:START -->",
      "<!-- CONTRIBUTION-GRAPH:END -->",
      generateContributionGraphSection(metrics)
    );

    fs.writeFileSync(README_PATH, readme, "utf8");
    console.log("README.md updated successfully");
  } catch (error) {
    console.error(`Error updating README: ${error.message}`);
    process.exit(1);
  }
}

main();
