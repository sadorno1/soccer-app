// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
// allow Metro to resolve Firebase’s .cjs modules:
defaultConfig.resolver.sourceExts.push('cjs');
// disable the new exports-only resolution so auth registers properly:
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
