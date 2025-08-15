// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Enhanced resolver configuration for React Native stability
defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.resolver.unstable_enablePackageExports = true; // Enable proper module resolution
defaultConfig.resolver.unstable_conditionNames = ['react-native', 'browser', 'require'];

// Ensure proper asset and platform resolution
defaultConfig.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = defaultConfig;
