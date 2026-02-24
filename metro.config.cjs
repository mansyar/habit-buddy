const { getDefaultConfig } = require('expo/config-metro');

/** @type {import('expo/config-metro').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');
config.resolver.sourceExts.push('wasm');
config.resolver.sourceExts.push('mjs');
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
