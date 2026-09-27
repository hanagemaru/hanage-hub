import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: {
    // ルートレイアウトが言語ごとに2つあるので、共通の404は global-not-found で作る
    globalNotFound: true,
  },
};

export default nextConfig;
