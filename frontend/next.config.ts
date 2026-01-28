import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the Codespace proxy domain to access the server
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  // Sometimes required for dev proxies
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
