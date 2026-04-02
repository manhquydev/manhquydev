const https = require("https");
const fs = require("fs");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME || "manhquydev";
const MAX_REPOS = Number(process.env.MAX_PROJECT_STATS_REPOS || "6");
const OUTPUT_FILE = "data/project-stats.json";

function requestJson(path) {
  return new Promise((resolve, reject) => {
    const headers = {
      "User-Agent": "manhquydev-readme-updater",
      Accept: "application/vnd.github+json",
    };

    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const req = https.get(
      {
        hostname: "api.github.com",
        path,
        headers,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}: ${raw}`));
            return;
          }

          try {
            resolve(JSON.parse(raw));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", reject);
  });
}

function selectRepos(repos) {
  return repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => {
      if ((b.stargazers_count || 0) !== (a.stargazers_count || 0)) {
        return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      }
      return new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0);
    })
    .slice(0, MAX_REPOS);
}

async function main() {
  try {
    console.log(`Fetching repositories for ${USERNAME}...`);
    const repos = await requestJson(
      `/users/${encodeURIComponent(USERNAME)}/repos?type=owner&per_page=100&sort=updated`
    );

    const selected = selectRepos(Array.isArray(repos) ? repos : []);
    const stats = {};

    selected.forEach((repo) => {
      stats[repo.name] = {
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        watchers: repo.watchers_count || 0,
        language: repo.language || "N/A",
        updated: repo.updated_at,
        url: repo.html_url,
      };
    });

    if (!fs.existsSync("data")) {
      fs.mkdirSync("data", { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stats, null, 2), "utf8");
    console.log(`Saved ${Object.keys(stats).length} repository stat(s) to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Error fetching project stats: ${error.message}`);
    process.exit(1);
  }
}

main();
