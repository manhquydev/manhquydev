const https = require('https');
const fs = require('fs');

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'manhquydev';
const REPOS = ['Python-Visualizer', 'student-forum-web', 'CodeVision_Academy'];
const OUTPUT_FILE = 'data/project-stats.json';

/**
 * Fetch repository data from GitHub API
 * @param {string} owner - Repository owner username
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} Repository data
 */
async function fetchRepo(owner, repo) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}`,
      headers: {
        'User-Agent': 'GitHub-Profile-Updater',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Main execution function
 */
async function main() {
  try {
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }

    const stats = {};

    for (const repo of REPOS) {
      console.log(`Fetching stats for ${repo}...`);
      const data = await fetchRepo(USERNAME, repo);

      stats[repo] = {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        watchers: data.watchers_count || 0,
        language: data.language || 'N/A',
        updated: data.updated_at,
        url: data.html_url
      };

      console.log(`  ⭐ ${stats[repo].stars} stars | 🍴 ${stats[repo].forks} forks`);
    }

    // Ensure data directory exists
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data', { recursive: true });
    }

    // Save stats to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stats, null, 2));
    console.log(`✓ Project stats saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('✗ Error fetching project stats:', error.message);
    process.exit(1);
  }
}

main();
