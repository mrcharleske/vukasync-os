import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vukasync/types", "@vukasync/ui", "@vukasync/utils"]
};

export default nextConfig;
