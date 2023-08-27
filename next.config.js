/** @type {import('next').NextConfig} */

const os = require("os");

module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    console.log('CONFIG OUTPUT PATH', config.output.path)
    config.module.rules.push({
      test: /\.node$/,
      parser: { amd: false },
      use: [{
        loader: '@vercel/webpack-asset-relocator-loader',
        options: {}
      }],
    })
    return config;
  },
};
