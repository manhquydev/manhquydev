const https = require("https");
const fs = require("fs");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME || "manhquydev";
const OUTPUT_FILE = "data/github-metrics.json";
const TREND_DAYS = Number(process.env.CONTRIBUTION_TREND_DAYS || "30");

function requestRest(path) {
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

function requestGraphQL(query, variables) {
  if (!GITHUB_TOKEN) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query, variables });
    const req = https.request(
      {
        hostname: "api.github.com",
        path: "/graphql",
        method: "POST",
        headers: {
          "User-Agent": "manhquydev-readme-updater",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(new Error(`GraphQL HTTP ${res.statusCode}: ${raw}`));
            return;
          }
          try {
            const parsed = JSON.parse(raw);
            if (parsed.errors) {
              reject(new Error(`GraphQL errors: ${JSON.stringify(parsed.errors)}`));
              return;
            }
            resolve(parsed.data);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function buildDailySeriesFromCalendar(calendarWeeks, days) {
  const byDate = {};
  (calendarWeeks || []).forEach((week) => {
    (week.contributionDays || []).forEach((day) => {
      byDate[day.date] = day.contributionCount;
    });
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const values = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const key = toDateKey(d);
    values.push({ date: key, count: byDate[key] || 0 });
  }

  const max = Math.max(...values.map((v) => v.count), 1);
  return values
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((item) => {
      const width = Math.round((item.count / max) * 16);
      return {
        date: item.date,
        count: item.count,
        bar: width > 0 ? "#".repeat(width) : ".",
      };
    });
}

function summarizeEventTypes(events) {
  const summary = {};
  events.forEach((event) => {
    const type = event.type || "UnknownEvent";
    summary[type] = (summary[type] || 0) + 1;
  });
  return Object.entries(summary)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function topLanguagesByRepoCount(repos) {
  const counts = {};
  repos.forEach((repo) => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([language, repositories]) => ({ language, repositories }))
    .sort((a, b) => b.repositories - a.repositories)
    .slice(0, 8);
}

async function main() {
  try {
    const [user, repos, events] = await Promise.all([
      requestRest(`/users/${encodeURIComponent(USERNAME)}`),
      requestRest(`/users/${encodeURIComponent(USERNAME)}/repos?type=owner&per_page=100&sort=updated`),
      requestRest(`/users/${encodeURIComponent(USERNAME)}/events/public?per_page=100`),
    ]);

    const ownedRepos = Array.isArray(repos) ? repos.filter((repo) => !repo.fork) : [];
    const eventList = Array.isArray(events) ? events : [];

    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setUTCFullYear(now.getUTCFullYear() - 1);

    const gqlData = await requestGraphQL(
      `
      query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
      `,
      {
        login: USERNAME,
        from: oneYearAgo.toISOString(),
        to: now.toISOString(),
      }
    );

    const calendar =
      gqlData?.user?.contributionsCollection?.contributionCalendar || null;
    const calendarWeeks = calendar?.weeks || [];
    const dailySeries = buildDailySeriesFromCalendar(calendarWeeks, TREND_DAYS);

    const payload = {
      user: {
        login: user.login,
        profileUrl: user.html_url,
        followers: user.followers || 0,
        following: user.following || 0,
        publicRepos: user.public_repos || 0,
        publicGists: user.public_gists || 0,
        totalStars: ownedRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
        totalForks: ownedRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
        createdAt: user.created_at || "",
      },
      topLanguages: topLanguagesByRepoCount(ownedRepos),
      contribution: {
        days: TREND_DAYS,
        totalContributionsLastYear: calendar?.totalContributions || 0,
        totalContributionsLast30Days: dailySeries.slice(-30).reduce((sum, day) => sum + day.count, 0),
        series: dailySeries,
        calendarWeeks,
        topEventTypes: summarizeEventTypes(eventList),
      },
      generatedAt: new Date().toISOString(),
    };

    if (!fs.existsSync("data")) {
      fs.mkdirSync("data", { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), "utf8");
    console.log(`Saved GitHub metrics to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Error fetching GitHub metrics: ${error.message}`);
    process.exit(1);
  }
}

main();
