/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Use a different hash function to avoid WebAssembly issues
    config.output.hashFunction = 'xxhash64';
    
    // Disable optimization that may be causing issues
    config.optimization.minimize = false;
    
    // Disable WebAssembly completely
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: false,
      syncWebAssembly: false,
    };
    
    // Fallback for modules that might try to use WebAssembly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    return config;
  },
}

export default nextConfig
