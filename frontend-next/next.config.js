/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        instantInsights: {
            validationLevel: 'warning',
        },
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

    // Cache headers — public pages are crawler-friendly, admin stays private
    async headers() {
        return [
            // ── Store product pages: aggressive caching for crawlers ──
            {
                source: '/store/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
                    },
                ],
            },
            // ── Other public pages: moderate caching ──
            {
                source: '/:section(projects|services|about|faq|contact|clients)/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
                    },
                ],
            },
            // ── Homepage ──
            {
                source: '/',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
                    },
                ],
            },
            // ── llms.txt files: long cache for AI crawlers ──
            {
                source: '/llms.txt',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, s-maxage=86400',
                    },
                ],
            },
            {
                source: '/llms-full.txt',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, s-maxage=86400',
                    },
                ],
            },
            // ── Admin & API: no caching ──
            {
                source: '/admin/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, must-revalidate',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                ],
            },
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, must-revalidate',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                ],
            },
            {
                source: '/customer-dashboard/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, must-revalidate',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;

