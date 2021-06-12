const withOptimizedImages = require('next-optimized-images');
const withPreact = require('next-plugin-preact');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([
    [withOptimizedImages],
    [withPreact],
], {poweredByHeader: false});
