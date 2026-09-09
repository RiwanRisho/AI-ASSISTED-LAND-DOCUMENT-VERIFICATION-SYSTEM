/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // pdfjs-dist contains an optional Node-only canvas dependency.
    // LandGuard parses PDFs in the browser, so do not bundle native canvas.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
