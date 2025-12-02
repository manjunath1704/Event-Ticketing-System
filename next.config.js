/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude server-side packages from webpack bundling
      config.externals = config.externals || [];
      config.externals.push({
        'undici': 'commonjs undici',
        'firebase-admin': 'commonjs firebase-admin',
      });
    }
    return config;
  },
}

module.exports = nextConfig
