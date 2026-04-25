const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add the custom transformer for .mjs files if needed
// config.resolver.assetExts.push('mjs');
// config.transformer.babelTransformerPath = require.resolve('react-native-mjs-transformer');

module.exports = config;
