import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
