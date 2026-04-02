const https = require("https");
const fs = require("fs");

const DEVTO_USERNAME = process.env.DEVTO_USERNAME || "manhquydev";
const MAX_POSTS = Number(process.env.MAX_BLOG_POSTS || "5");
const OUTPUT_FILE = "data/blog-posts.json";

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": "manhquydev-readme-updater" } },
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

async function main() {
  try {
    const url = `https://dev.to/api/articles?username=${encodeURIComponent(DEVTO_USERNAME)}&per_page=${MAX_POSTS}`;
    console.log(`Fetching posts from Dev.to for @${DEVTO_USERNAME}...`);
    const posts = await requestJson(url);

    const normalized = Array.isArray(posts)
      ? posts.map((post) => ({
          title: post.title,
          link: post.url,
          pubDate: (post.published_at || "").slice(0, 10),
        }))
      : [];

    if (!fs.existsSync("data")) {
      fs.mkdirSync("data", { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(normalized, null, 2), "utf8");
    console.log(`Saved ${normalized.length} post(s) to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Error fetching blog posts: ${error.message}`);
    process.exit(1);
  }
}

main();
