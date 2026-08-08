import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // /about merged into the homepage
    return [{ source: "/about", destination: "/", permanent: true }];
  },
};

export default nextConfig;
