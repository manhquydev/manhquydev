/**
 * Simple template engine for SVG generation
 * Supports: {{variable}}, {{#each array}}, {{#if condition}}
 */
class TemplateEngine {
  /**
   * Render a template with data
   * @param {string} template - The template string
   * @param {object} data - The data object to render with
   * @returns {string} - The rendered output
   */
  render(template, data) {
    let result = template;

    // Handle {{#each}} loops
    result = this._processLoops(result, data);

    // Handle {{#if}} conditionals
    result = this._processConditionals(result, data);

    // Handle simple variable replacement
    result = this._processVariables(result, data);

    return result;
  }

  /**
   * Process {{#each array}}...{{/each}} loops
   */
  _processLoops(template, data) {
    const loopRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;

    return template.replace(loopRegex, (match, arrayKey, content) => {
      const array = data[arrayKey];

      if (!Array.isArray(array) || array.length === 0) {
        return '';
      }

      return array.map((item, index) => {
        let itemContent = content;

        // Handle {{@index}} for index access
        itemContent = itemContent.replace(/\{\{@index\}\}/g, index.toString());

        if (typeof item === 'object' && item !== null) {
          // Replace object properties: {{property}}
          itemContent = itemContent.replace(/\{\{(\w+)\}\}/g, (m, key) => {
            if (key === 'each' || key === 'index') return m;
            return item[key] !== undefined ? item[key] : '';
          });
        } else {
          // For primitive values, use {{.}} or {{this}}
          itemContent = itemContent.replace(/\{\{(?:\.|this)\}\}/g, String(item));
        }

        return itemContent;
      }).join('');
    });
  }

  /**
   * Process {{#if condition}}...{{/if}} conditionals
   */
  _processConditionals(template, data) {
    const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;

    return template.replace(ifRegex, (match, conditionKey, content) => {
      const value = data[conditionKey];
      const isTruthy = value &&
        (Array.isArray(value) ? value.length > 0 : true) &&
        value !== false &&
        value !== 0;

      return isTruthy ? content : '';
    });
  }

  /**
   * Process simple {{variable}} replacements
   */
  _processVariables(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      // Skip special keywords
      if (['each', 'if', 'index', 'this'].includes(key)) {
        return match;
      }

      // Handle nested paths like {{user.name}} (basic support)
      if (key.includes('.')) {
        const parts = key.split('.');
        let value = data;
        for (const part of parts) {
          value = value?.[part];
          if (value === undefined) break;
        }
        return value !== undefined ? value : match;
      }

      return data[key] !== undefined ? data[key] : match;
    });
  }

  /**
   * Escape HTML special characters
   * @param {string} text
   * @returns {string}
   */
  escapeHtml(text) {
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (div) {
      div.textContent = text;
      return div.innerHTML;
    }
    // Node.js fallback
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

module.exports = TemplateEngine;
