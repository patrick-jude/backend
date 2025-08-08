// This custom resolver helps Jest resolve .js imports to .ts files in ESM mode.

const { resolve } = require('node:path');
const { readFileSync } = require('node:fs');
const ts = require('typescript');

/**
 * Custom Jest resolver for TypeScript ESM projects.
 * This resolver attempts to map '.js' imports to '.ts' source files.
 * It's designed to work with 'type: "module"' in package.json.
 */
module.exports = function (request, options) {
  // If it's a node_module, let the default resolver handle it.
  if (request.startsWith('.')) {
    // It's a relative import, potentially one of our source files.
    try {
      // Try to resolve as .ts first
      const tsPath = request.replace(/\.js$/, '.ts');
      return options.defaultResolver(tsPath, {
        ...options,
        pathFilter: (path) => {
          // Ensure that the resolved path points to a file that actually exists
          try {
            readFileSync(path);
            return path;
          } catch (e) {
            return null; // File doesn't exist, let default resolver try other options
          }
        },
      });
    } catch (e) {
      // If .ts resolution fails, fall back to default resolver (which might find .js)
      // This handles cases where the import might genuinely be a .js file (e.g., from dist)
    }
  }

  // For all other cases (node_modules, absolute paths, etc.), use the default resolver.
  return options.defaultResolver(request, options);
};