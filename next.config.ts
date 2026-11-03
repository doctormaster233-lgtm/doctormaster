import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // The Chinese ↔ English translator is a static app in public/translator/.
      // Next.js does not serve index.html for folders, so map the clean URL to it.
      // (/translator/ is redirected to /translator by the default trailing-slash rule.)
      { source: "/translator", destination: "/translator/index.html" },
      // Animated 3D taekwondo techniques, a static page in public/taekwondo/.
      { source: "/taekwondo", destination: "/taekwondo/index.html" },
    ];
  },
};

export default nextConfig;
