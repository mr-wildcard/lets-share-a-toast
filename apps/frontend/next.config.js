const path = require('path');
const withNx = require('@nrwl/next/plugins/with-nx');
const withSourceMaps = require('@zeit/next-source-maps');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  webpack(config) {
    config.resolve.alias.core = path.join(__dirname, 'src', 'core');
    config.resolve.alias.pages = path.join(__dirname, 'src', 'pages');
    config.resolve.alias.homepage = path.join(__dirname, 'src', 'homepage');
    config.resolve.alias.subjects = path.join(__dirname, 'src', 'subjects');
    config.resolve.alias.header = path.join(__dirname, 'src', 'header');
    config.resolve.alias.notifications = path.join(
      __dirname,
      'src',
      'notifications'
    );

    return config;
  },
};

module.exports = withBundleAnalyzer(withSourceMaps(withNx(nextConfig)));
