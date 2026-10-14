import { NextRequest, NextResponse } from 'next/server'

/**
 * Next.js Edge Middleware
 *
 * Handles two agent-readiness features:
 *
 * 1. **Markdown Content Negotiation** — When a request includes
 *    `Accept: text/markdown`, rewrite to an internal API route
 *    that serves the markdown representation.
 *
 * 2. **Link Response Headers** — Adds RFC 8288 / RFC 9727 Link headers
 *    to all responses for agent discoverability.
 */

/** Pages that have markdown representations available */
const MARKDOWN_PAGES = new Set([
    '/',
    '/about',
    '/store',
    '/services',
    '/projects',
    '/contact',
    '/faq',
    '/clients',
])

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const accept = request.headers.get('accept') || ''

    // ── 1. Markdown Content Negotiation ─────────────────────
    // Only apply to client-facing pages (not admin, API, or static assets)
    const isClientPage =
        !pathname.startsWith('/admin') &&
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/_next') &&
        !pathname.startsWith('/.well-known') &&
        !pathname.startsWith('/auth.md') &&
        !pathname.startsWith('/robots.txt') &&
        !pathname.includes('.')

    // Normalise path: strip trailing slash
    const normalised = pathname.replace(/\/$/, '') || '/'

    if (
        isClientPage &&
        accept.includes('text/markdown') &&
        MARKDOWN_PAGES.has(normalised)
    ) {
        // Rewrite to the internal markdown API route
        const url = request.nextUrl.clone()
        url.pathname = '/api/markdown'
        url.searchParams.set('path', normalised)
        return NextResponse.rewrite(url)
    }

    // ── 2. Link Response Headers ────────────────────────────
    const response = NextResponse.next()

    // Add Link headers to ALL responses for discoverability
    const linkHeaders = [
        '</.well-known/api-catalog>; rel="api-catalog"',
        '</.well-known/openapi.json>; rel="service-desc"; type="application/json"',
        '</api-docs>; rel="service-doc"; type="text/html"',
        '</auth.md>; rel="describedby"; type="text/markdown"',
    ]

    response.headers.set('Link', linkHeaders.join(', '))

    // Add Vary header to signal content negotiation to caches
    if (isClientPage) {
        response.headers.set('Vary', 'Accept')
    }

    return response
}

/**
 * Only run middleware on relevant paths.
 * Skip static files and _next internals.
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, icon.svg (browser icons)
         */
        '/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg).*)',
    ],
}
