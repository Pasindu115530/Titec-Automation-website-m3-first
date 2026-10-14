/**
 * /api/markdown — Internal Markdown Content API
 *
 * Serves markdown representations of public pages.
 * Called internally by the middleware when a request
 * includes Accept: text/markdown.
 *
 * NOT intended to be called directly by browsers.
 */
import { NextRequest } from 'next/server'
import { getMarkdownForPath, estimateTokens } from '@/lib/markdown-pages'

export function GET(request: NextRequest) {
    const path = request.nextUrl.searchParams.get('path') || '/'
    const markdown = getMarkdownForPath(path)

    if (!markdown) {
        return new Response('# Not Found\n\nNo markdown representation available for this page.', {
            status: 404,
            headers: {
                'Content-Type': 'text/markdown; charset=utf-8',
            },
        })
    }

    const tokenCount = estimateTokens(markdown)

    return new Response(markdown, {
        status: 200,
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'x-markdown-tokens': String(tokenCount),
            'Vary': 'Accept',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    })
}
