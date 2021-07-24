const withCSS = require('@zeit/next-css');
module.exports = withCSS({
  images: {
    domains: ['s2.googleusercontent.com'],
  },
  pageExtensions: ['mdx', 'jsx', 'js', 'ts', 'tsx'],
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) config.node = { fs: 'empty' };
    return config;
  },
});
