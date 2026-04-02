/**
 * Generate Premium Work Focus SVG
 * Creates work focus section with domain and delivery focus cards
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

// Work focus data - can be customized
const workFocusData = {
  domainFocus: {
    title: 'Domain Focus',
    description: 'Web Applications • API Development • Cloud Infrastructure',
    tags: [
      { name: 'SaaS', color: '#1e66f5' },
      { name: 'Fintech', color: '#04a5e5' },
      { name: 'E-commerce', color: '#8839ef' }
    ]
  },
  deliveryFocus: {
    title: 'Delivery Focus',
    description: 'Performance • Scalability • Maintainability',
    tags: [
      { name: 'Performance', color: '#8839ef' },
      { name: 'Testing', color: '#ea76cb' },
      { name: 'CI/CD', color: '#40a02b' }
    ]
  },
  lastUpdated: new Date().toISOString()
};

async function generatePremiumWorkFocus() {
  console.log('🎯 Generating Premium Work Focus...');

  const engine = new TemplateEngine();

  try {
    // Generate light version
    const lightTemplatePath = path.join(TEMPLATES_DIR, 'premium-work-focus-light.svg');
    if (fs.existsSync(lightTemplatePath)) {
      const lightTemplate = fs.readFileSync(lightTemplatePath, 'utf8');
      const lightSvg = engine.render(lightTemplate, workFocusData);
      const lightOutputPath = path.join(OUTPUT_DIR, 'premium-work-focus-light.svg');
      fs.writeFileSync(lightOutputPath, lightSvg);
      console.log(`  ✓ Light version: ${lightOutputPath}`);
    } else {
      console.log(`  ⚠ Template not found: ${lightTemplatePath}`);
    }

    // Generate dark version
    const darkTemplatePath = path.join(TEMPLATES_DIR, 'premium-work-focus-dark.svg');
    if (fs.existsSync(darkTemplatePath)) {
      const darkTemplate = fs.readFileSync(darkTemplatePath, 'utf8');
      const darkSvg = engine.render(darkTemplate, workFocusData);
      const darkOutputPath = path.join(OUTPUT_DIR, 'premium-work-focus-dark.svg');
      fs.writeFileSync(darkOutputPath, darkSvg);
      console.log(`  ✓ Dark version: ${darkOutputPath}`);
    } else {
      console.log(`  ⚠ Template not found: ${darkTemplatePath}`);
    }

    console.log('✅ Premium Work Focus generated successfully!\n');
    return true;
  } catch (error) {
    console.error('❌ Error generating Premium Work Focus:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  generatePremiumWorkFocus();
}

module.exports = { generatePremiumWorkFocus };
