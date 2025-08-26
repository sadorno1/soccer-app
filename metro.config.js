// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.resolver.unstable_enablePackageExports = true; 
defaultConfig.resolver.unstable_conditionNames = ['react-native', 'browser', 'require'];

defaultConfig.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = defaultConfig;
