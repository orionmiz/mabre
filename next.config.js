const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  img-src 'self' data: ${process.env.CDN};
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net/gh/orioncactus/pretendard/;
  font-src 'self' https://cdn.jsdelivr.net/gh/orioncactus/pretendard/;  
`;

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  eslint: {
    dirs: ["src", "__tests__"],
  },
};

module.exports = nextConfig;
