/**
 * /.well-known/api-catalog — RFC 9727 API Catalog
 *
 * Publishes a machine-readable API catalog for automated discovery.
 * Content-Type: application/linkset+json
 *
 * @see https://www.rfc-editor.org/rfc/rfc9727
 * @see https://www.rfc-editor.org/rfc/rfc9727#appendix-A
 */
export function GET() {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk'
    const apiBaseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.titecautomation.lk'

    const catalog = {
        linkset: [
            {
                anchor: `${apiBaseUrl}/api`,
                'service-desc': [
                    {
                        href: `${baseUrl}/.well-known/openapi.json`,
                        type: 'application/json',
                    },
                ],
                'service-doc': [
                    {
                        href: `${baseUrl}/api-docs`,
                        type: 'text/html',
                    },
                ],
                status: [
                    {
                        href: `${apiBaseUrl}/api/health`,
                        type: 'application/json',
                    },
                ],
            },
        ],
    }

    return new Response(JSON.stringify(catalog, null, 2), {
        status: 200,
        headers: {
            'Content-Type': 'application/linkset+json',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            'Access-Control-Allow-Origin': '*',
        },
    })
}
