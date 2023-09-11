/** @type {import('next').NextConfig} */
const isForIPFS = process.env.NEXT_PUBLIC_DEPLOY_FOR_IPFS === 'true';

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    config.experiments = { topLevelAwait: true, layers: true };
    return config;
  },
  reactStrictMode: true,
  trailingSlash: true,
};

module.exports = isForIPFS
  ? {
      ...nextConfig,
      experimental: {
        appDir: false,
      },
      output: 'export',
      images: {
        unoptimized: true,
      },
      // assetPrefix: './',
    }
  : {
      ...nextConfig,
      pageExtensions: [
        'page.tsx',
        'page.ts',
        'page.jsx',
        'page.js',
        'page.md',
        'page.mdx',
      ],
    };
