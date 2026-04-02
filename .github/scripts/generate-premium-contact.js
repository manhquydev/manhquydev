/**
 * Generate Premium Contact SVG
 * Creates contact bar with social links and availability status
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

// Contact data - can be customized
const contactData = {
  website: {
    label: 'Website',
    value: 'manhquy.dev'
  },
  linkedin: {
    label: 'LinkedIn',
    value: '/in/manhquy'
  },
  email: {
    label: 'Email',
    value: 'hello@manhquy.dev'
  },
  github: {
    label: 'GitHub',
    value: '@manhquy'
  },
  status: {
    text: 'Open to work',
    color: '#40a02b', // green for light mode
    colorDark: '#a6e3a1' // green for dark mode
  },
  lastUpdated: new Date().toISOString()
};

async function generatePremiumContact() {
  console.log('📬 Generating Premium Contact Bar...');

  const engine = new TemplateEngine();

  try {
    // Generate light version
    const lightTemplatePath = path.join(TEMPLATES_DIR, 'premium-contact-light.svg');
    if (fs.existsSync(lightTemplatePath)) {
      const lightTemplate = fs.readFileSync(lightTemplatePath, 'utf8');
      const lightSvg = engine.render(lightTemplate, contactData);
      const lightOutputPath = path.join(OUTPUT_DIR, 'premium-contact-light.svg');
      fs.writeFileSync(lightOutputPath, lightSvg);
      console.log(`  ✓ Light version: ${lightOutputPath}`);
    } else {
      console.log(`  ⚠ Template not found: ${lightTemplatePath}`);
    }

    // Generate dark version
    const darkTemplatePath = path.join(TEMPLATES_DIR, 'premium-contact-dark.svg');
    if (fs.existsSync(darkTemplatePath)) {
      const darkTemplate = fs.readFileSync(darkTemplatePath, 'utf8');
      const darkSvg = engine.render(darkTemplate, contactData);
      const darkOutputPath = path.join(OUTPUT_DIR, 'premium-contact-dark.svg');
      fs.writeFileSync(darkOutputPath, darkSvg);
      console.log(`  ✓ Dark version: ${darkOutputPath}`);
    } else {
      console.log(`  ⚠ Template not found: ${darkTemplatePath}`);
    }

    console.log('✅ Premium Contact Bar generated successfully!\n');
    return true;
  } catch (error) {
    console.error('❌ Error generating Premium Contact Bar:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  generatePremiumContact();
}

module.exports = { generatePremiumContact };
