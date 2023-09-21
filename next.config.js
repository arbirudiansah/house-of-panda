/** @type {import('next').NextConfig} */

const path = require("path");
const { a3 } = require("./utils")

const adminKey = process.env.ADMIN_KEY

if (process.env.RUN_MODE !== 'build' && !a3(adminKey, process.env.PASSWORD)) {
  console.error('Error: Wrong password')
  process.exit(1)
}

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    // loader: "custom",
    domains: ["ipfs.w3s.link", "ipfs.houseofpanda.co"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.w3s.link',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_MRHCQRUCJY5: process.env.ADMIN_KEY,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.md$/,
      use: [
        { loader: "html-loader" },
        { loader: "markdown-loader" },
      ],
    });
    config.module.rules.push({
      test: /\.html$/,
      use: [
        { loader: "html-loader" },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;