/**
 * Catppuccin Color Schemes for light and dark modes
 * https://github.com/catppuccin/catppuccin
 */

const colorSchemes = {
  // Catppuccin Latte (Light)
  light: {
    // Base colors
    base: '#eff1f5',
    mantle: '#e6e9ef',
    crust: '#dce0e8',
    surface0: '#ccd0da',
    surface1: '#bcc0cc',
    surface2: '#acb0be',

    // Text colors
    text: '#4c4f69',
    subtext0: '#6c6f85',
    subtext1: '#5c5f77',

    // Accent colors
    lavender: '#7287fd',
    blue: '#1e66f5',
    sapphire: '#209fb5',
    sky: '#04a5e5',
    teal: '#179299',
    green: '#40a02b',
    yellow: '#df8e1d',
    peach: '#fe640b',
    maroon: '#e64553',
    red: '#d20f39',
    mauve: '#8839ef',
    pink: '#ea76cb',
    flamingo: '#dd7878',
    rosewater: '#dc8a78',

    // Semantic aliases
    primary: '#1e66f5',
    secondary: '#8839ef',
    accent: '#fe640b',
    success: '#40a02b',
    warning: '#df8e1d',
    error: '#d20f39',
    info: '#04a5e5',

    // Glassmorphism
    glassFill: 'url(#card-gradient-light)',
    glassStroke: 'rgba(108, 111, 133, 0.2)',
    glassBg: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(204, 208, 218, 0.5)',

    // Backgrounds
    bg: '#eff1f5',
    surface: '#ffffff',
    card: '#ffffff',

    // Text
    textPrimary: '#4c4f69',
    textMuted: '#6c6f85',
    textSecondary: '#5c5f77'
  },

  // Catppuccin Mocha (Dark)
  dark: {
    // Base colors
    base: '#1e1e2e',
    mantle: '#181825',
    crust: '#11111b',
    surface0: '#313244',
    surface1: '#45475a',
    surface2: '#585b70',

    // Text colors
    text: '#cdd6f4',
    subtext0: '#a6adc8',
    subtext1: '#bac2de',

    // Accent colors
    lavender: '#b4befe',
    blue: '#89b4fa',
    sapphire: '#74c7ec',
    sky: '#89dceb',
    teal: '#94e2d5',
    green: '#a6e3a1',
    yellow: '#f9e2af',
    peach: '#fab387',
    maroon: '#eba0ac',
    red: '#f38ba8',
    mauve: '#cba6f7',
    pink: '#f5c2e7',
    flamingo: '#f2cdcd',
    rosewater: '#f5e0dc',

    // Semantic aliases
    primary: '#89b4fa',
    secondary: '#cba6f7',
    accent: '#fab387',
    success: '#a6e3a1',
    warning: '#f9e2af',
    error: '#f38ba8',
    info: '#89dceb',

    // Glassmorphism
    glassFill: 'url(#card-gradient-dark)',
    glassStroke: 'rgba(166, 173, 200, 0.2)',
    glassBg: 'rgba(49, 50, 68, 0.6)',
    glassBorder: 'rgba(69, 71, 90, 0.5)',

    // Backgrounds
    bg: '#1e1e2e',
    surface: '#313244',
    card: '#313244',

    // Text
    textPrimary: '#cdd6f4',
    textMuted: '#a6adc8',
    textSecondary: '#bac2de'
  }
};

/**
 * Get color scheme by mode
 * @param {string} mode - 'light' or 'dark'
 * @returns {object} Color scheme object
 */
function getColorScheme(mode) {
  return colorSchemes[mode] || colorSchemes.light;
}

/**
 * Get a specific color from a scheme
 * @param {string} mode - 'light' or 'dark'
 * @param {string} colorName - Name of the color
 * @returns {string} Color value
 */
function getColor(mode, colorName) {
  const scheme = getColorScheme(mode);
  return scheme[colorName] || scheme.text;
}

module.exports = {
  colorSchemes,
  getColorScheme,
  getColor
};
