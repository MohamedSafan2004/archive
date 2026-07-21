/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // AVIF first: smaller files than WebP at the same visual quality.
    // Next.js tries AVIF, falls back to WebP, then original — all
    // automatic per-browser, no quality loss, just smaller delivery.
    formats: ["image/avif", "image/webp"],
    // Matches the actual grid/thumbnail sizes used across the site
    // (gallery grid, timeline photos, lightbox) so the browser never
    // downloads a bigger image than it will display.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for a year — they don't change once uploaded
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;