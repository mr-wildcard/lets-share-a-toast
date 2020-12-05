const path = require('path');
const withNx = require('@nrwl/next/plugins/with-nx');

const {
  APP_URL,
  API_URL,
  REAL_TIME_APP_BASE_URL,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} = process.env;

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'source-map',
});

const nextConfig = {
  env: {
    APP_URL,
    API_URL,
    REAL_TIME_APP_BASE_URL,
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
  },
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
