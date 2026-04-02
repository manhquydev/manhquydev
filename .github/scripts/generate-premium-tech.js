/**
 * Generate Premium Tech Stack SVG
 * Creates tech stack section with technology badges
 */

const fs = require('fs');
const path = require('path');
const TemplateEngine = require('./lib/template-engine');

// Configuration
const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
const OUTPUT_DIR = path.join(process.cwd(), 'assets', 'premium');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Tech stack data - can be customized
const techStackData = {
  technologies: [
    { name: 'JavaScript', color: '#df8e1d', width: 120 },
    { name: 'TypeScript', color: '#1e66f5', width: 120 },
    { name: 'React', color: '#04a5e5', width: 90 },
    { name: 'Node.js', color: '#40a02b', width: 100 },
    { name: 'MongoDB', color: '#40a02b', width: 100 },
    { name: 'PostgreSQL', color: '#1e66f5', width: 110 },
    { name: 'Docker', color: '#1e66f5', width: 90 },
    { name: 'AWS', color: '#fe640b', width: 70 },
    { name: 'Git', color: '#fe640b', width: 70 }
  ],
  lastUpdated: new Date().toISOString()
};

async function generatePremiumTech() {
  console.log('💻 Generating Premium Tech Stack...');

  const engine = new TemplateEngine();

  try {
    // Generate light version
    const lightTemplatePath = path.join(TEMPLATES_DIR, 'premium-tech-stack-light.svg');
    if (fs.existsSync(lightTemplatePath)) {
      const lightTemplate = fs.readFileSync(lightTemplatePath, 'utf8');
      const lightSvg = engine.render(lightTemplate, techStackData);
      const lightOutputPath = path.join(OUTPUT_DIR, 'premium-tech-stack-light.svg');
      fs.writeFileSync(lightOutputPath, lightSvg);
      console.log(`  ✓ Light version: ${lightOutputPath}`);
    } else {
      console.log(`  ⚠ Template not found: ${lightTemplatePath}`);
    }

    // Generate dark version
    const darkTemplatePath = path.join(TEMPLATES_DIR, 'premium-tech-stack-dark.svg');
    if (fs.existsSync(darkTemplatePath)) {
      const darkTemplate = fs.readFileSync(darkTemplatePath, 'utf8');
      const darkSvg = engine.render(darkTemplate, techStackData);
      const darkOutputPath = path.join(OUTPUT_DIR, 'premium-tech-stack-dark.svg');
      fs.writeFileSync(darkOutputPath, darkSvg);
      console.log(`  ✓ Dark version: ${darkOutputPath}`);
    } else {
      console.log(`  ⚠ Template not found: ${darkTemplatePath}`);
    }

    console.log('✅ Premium Tech Stack generated successfully!\n');
    return true;
  } catch (error) {
    console.error('❌ Error generating Premium Tech Stack:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  generatePremiumTech();
}

module.exports = { generatePremiumTech };
