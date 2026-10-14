/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        unoptimized: true, // Fail-safe for cPanel if optimization libraries (sharp) are missing
    },

    // Prevent browsers from caching pages — always fetch fresh content
    // Also add Link headers for agent discoverability (RFC 8288 / RFC 9727)
    async headers() {
        return [
            {
                // Apply to all pages
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, must-revalidate',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                    {
                        // RFC 8288 Link headers for agent discovery
                        key: 'Link',
                        value: '</.well-known/api-catalog>; rel="api-catalog", </.well-known/openapi.json>; rel="service-desc"; type="application/json", </api-docs>; rel="service-doc"; type="text/html", </auth.md>; rel="describedby"; type="text/markdown"',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
