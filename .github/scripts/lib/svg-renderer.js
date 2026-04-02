/**
 * SVG Renderer Helper Functions
 * Utilities for generating and manipulating SVG elements
 */

const { getColorScheme } = require('./color-schemes');

class SVGRenderer {
  constructor(mode = 'light') {
    this.mode = mode;
    this.colors = getColorScheme(mode);
  }

  /**
   * Create a glassmorphism card SVG group
   * @param {object} options - Card options
   * @returns {string} SVG group string
   */
  createGlassCard(options = {}) {
    const {
      x = 0,
      y = 0,
      width = 260,
      height = 140,
      rx = 16,
      accentColor = this.colors.primary,
      showAccentBar = true,
      blur = true
    } = options;

    let svg = `<g transform="translate(${x}, ${y})">`;

    // Blur backdrop
    if (blur) {
      const backdropColor = this.mode === 'light' ? '#dce0e8' : '#45475a';
      svg += `  <rect x="-4" y="-4" width="${width + 8}" height="${height + 8}" rx="${rx + 2}" fill="${backdropColor}" opacity="0.4" filter="url(#glass-blur)"/>\n`;
    }

    // Main card
    const strokeColor = this.mode === 'light' ? '#ccd0da' : '#45475a';
    svg += `  <rect width="${width}" height="${height}" rx="${rx}" fill="url(#card-bg)" stroke="${strokeColor}" stroke-width="1"/>\n`;

    // Accent bar
    if (showAccentBar) {
      svg += `  <rect x="0" y="0" width="${width}" height="4" rx="2" fill="${accentColor}"/>\n`;
    }

    // Top highlight for glass effect
    const highlightColor = this.mode === 'light' ? '#ffffff' : '#9399b2';
    const highlightOpacity = this.mode === 'light' ? '0.6' : '0.3';
    svg += `  <rect x="12" y="8" width="${width - 24}" height="2" rx="1" fill="${highlightColor}" opacity="${highlightOpacity}"/>\n`;

    svg += '</g>';
    return svg;
  }

  /**
   * Create a stat card with icon
   * @param {object} options - Stat card options
   * @returns {string} SVG group string
   */
  createStatCard(options = {}) {
    const {
      x = 0,
      y = 0,
      title = 'Stat',
      value = '0',
      icon = '',
      accentColor = this.colors.primary,
      delay = 0
    } = options;

    let svg = `<g transform="translate(${x}, ${y})">`;

    // Card background
    const cardWidth = 260;
    const cardHeight = 140;
    const backdropColor = this.mode === 'light' ? '#dce0e8' : '#45475a';

    svg += `  <rect x="-4" y="-4" width="${cardWidth + 8}" height="${cardHeight + 8}" rx="18" fill="${backdropColor}" opacity="0.4" filter="url(#glass-blur)"/>\n`;

    const strokeColor = this.mode === 'light' ? '#ccd0da' : '#45475a';
    svg += `  <rect width="${cardWidth}" height="${cardHeight}" rx="16" fill="url(#card-bg)" stroke="${strokeColor}" stroke-width="1"/>\n`;
    svg += `  <rect x="0" y="0" width="${cardWidth}" height="4" rx="2" fill="${accentColor}"/>\n`;

    // Title
    const titleColor = this.colors.textMuted;
    svg += `  <text x="20" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="13" fill="${titleColor}" font-weight="500">${title}</text>\n`;

    // Value with animation
    const valueColor = this.colors.textPrimary;
    const animDelay = delay + 0.5;
    svg += `  <text x="20" y="95" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="42" font-weight="700" fill="${valueColor}">\n`;
    svg += `    <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${animDelay}s" fill="freeze"/>\n`;
    svg += `    ${value}\n`;
    svg += `  </text>\n`;

    // Icon background
    svg += `  <circle cx="220" cy="75" r="20" fill="${accentColor}" opacity="0.1"/>\n`;

    // Icon (if provided)
    if (icon) {
      svg += `  ${icon}\n`;
    }

    svg += '</g>';
    return svg;
  }

  /**
   * Create a gradient definition
   * @param {string} id - Gradient ID
   * @param {string} color1 - First color
   * @param {string} color2 - Second color
   * @returns {string} SVG gradient definition
   */
  createGradient(id, color1, color2, options = {}) {
    const { x1 = '0%', y1 = '0%', x2 = '100%', y2 = '0%' } = options;
    return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>`;
  }

  /**
   * Create common filter definitions
   * @returns {string} SVG filter definitions
   */
  createCommonFilters() {
    return `<filter id="glass-blur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
    </filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="${this.colors.primary}" flood-opacity="0.1"/>
    </filter>`;
  }

  /**
   * Create gradient definitions for light mode
   * @returns {string} SVG gradient definitions
   */
  createLightGradients() {
    return `<linearGradient id="card-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#e6e9ef" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="card-gradient-light" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#eff1f5" stop-opacity="0.4"/>
    </linearGradient>`;
  }

  /**
   * Create gradient definitions for dark mode
   * @returns {string} SVG gradient definitions
   */
  createDarkGradients() {
    return `<linearGradient id="card-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#313244" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#1e1e2e" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="card-gradient-dark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#313244" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#1e1e2e" stop-opacity="0.3"/>
    </linearGradient>`;
  }

  /**
   * Wrap content in an SVG document
   * @param {string} content - SVG content
   * @param {object} options - SVG options
   * @returns {string} Complete SVG document
   */
  wrapSVG(content, options = {}) {
    const {
      width = 1200,
      height = 400,
      viewBox = `0 0 ${width} ${height}`
    } = options;

    const bgColor = this.colors.bg;

    return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${this.mode === 'light' ? this.createLightGradients() : this.createDarkGradients()}
    ${this.createCommonFilters()}
  </defs>
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  ${content}
</svg>`;
  }
}

module.exports = SVGRenderer;
