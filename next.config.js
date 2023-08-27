/** @type {import('next').NextConfig} */

const os = require("os");

module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    config.externals = [
      'nodejs-polars-android-arm64',
      'nodejs-polars-android-arm-eabi',
      'nodejs-polars-win32-x64-msvc',
      'nodejs-polars-win32-ia32-msvc',
      'nodejs-polars-win32-arm64-msvc',
      'nodejs-polars-darwin-x64',
      'nodejs-polars-darwin-arm64',
      'nodejs-polars-freebsd-x64',
      'nodejs-polars-linux-x64-musl',
      'nodejs-polars-linux-x64-gnu',
      'nodejs-polars-linux-arm64-musl',
      'nodejs-polars-linux-arm64-gnu',
      'nodejs-polars-linux-arm-gnueabihf',
      './nodejs-polars.android-arm64.node',
      './nodejs-polars.android-arm-eabi.node',
      './nodejs-polars.win32-x64-msvc.node',
      './nodejs-polars.win32-ia32-msvc.node',
      './nodejs-polars.win32-arm64-msvc.node',
      './nodejs-polars.darwin-x64.node',
      './nodejs-polars.darwin-arm64.node',
      './nodejs-polars.freebsd-x64.node',
      './nodejs-polars.linux-x64-musl.node',
      './nodejs-polars.linux-x64-gnu.node',
      './nodejs-polars.linux-arm64-musl.node',
      './nodejs-polars.linux-arm64-gnu.node',
      './nodejs-polars.linux-arm-gnueabihf.node'
    ]
    return config;
  },
};
