/**
 * Generate Premium Hero SVG
 * Creates hero section with name and title
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

async function generatePremiumHero() {
  console.log('🎨 Generating Premium Hero...');

  const engine = new TemplateEngine();

  // Data for the hero (mostly static, but can be customized)
  const heroData = {
    name: 'Manh Quy',
    title: 'Full-Stack Developer',
    greeting: "Hello, I'm",
    lastUpdated: new Date().toISOString()
  };

  try {
    // Generate light version
    const lightTemplatePath = path.join(TEMPLATES_DIR, 'premium-hero-light.svg');
    if (fs.existsSync(lightTemplatePath)) {
      const lightTemplate = fs.readFileSync(lightTemplatePath, 'utf8');
      const lightSvg = engine.render(lightTemplate, heroData);
      const lightOutputPath = path.join(OUTPUT_DIR, 'premium-hero-light.svg');
      fs.writeFileSync(lightOutputPath, lightSvg);
      console.log(`  ✓ Light version: ${lightOutputPath}`);
    } else {
      console.log(`  ⚠ Template not found: ${lightTemplatePath}`);
    }

    // Generate dark version
    const darkTemplatePath = path.join(TEMPLATES_DIR, 'premium-hero-dark.svg');
    if (fs.existsSync(darkTemplatePath)) {
      const darkTemplate = fs.readFileSync(darkTemplatePath, 'utf8');
      const darkSvg = engine.render(darkTemplate, heroData);
      const darkOutputPath = path.join(OUTPUT_DIR, 'premium-hero-dark.svg');
      fs.writeFileSync(darkOutputPath, darkSvg);
      console.log(`  ✓ Dark version: ${darkOutputPath}`);
    } else {
      console.log(`  ⚠ Template not found: ${darkTemplatePath}`);
    }

    console.log('✅ Premium Hero generated successfully!\n');
    return true;
  } catch (error) {
    console.error('❌ Error generating Premium Hero:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  generatePremiumHero();
}

module.exports = { generatePremiumHero };
