/**
 * robots.txt — Route Handler
 *
 * Returns a plain-text robots.txt that includes:
 *  • All existing User-agent rules for search and AI crawlers
 *  • Content-Signal directives per https://contentsignals.org/
 *    (IETF draft-romm-aipref-contentsignals)
 */
export function GET() {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk'

    const body = `# ─── Standard web crawlers ───────────────────────────────
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /customer-dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

# ─── Google-Extended (Bard / Gemini training) ────────────
User-agent: Google-Extended
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /customer-dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

# ─── OpenAI GPTBot (ChatGPT training & search) ──────────
User-agent: GPTBot
Allow: /store/
Allow: /projects/
Allow: /services/
Allow: /about/
Allow: /faq/
Disallow: /admin/
Disallow: /api/
Disallow: /customer-dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

# ─── OpenAI ChatGPT-User (real-time web browsing) ───────
User-agent: ChatGPT-User
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /customer-dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

# ─── Anthropic ClaudeBot (Claude web search & training) ──
User-agent: ClaudeBot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /customer-dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

# ─── Perplexity AI ──────────────────────────────────────
User-agent: PerplexityBot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /customer-dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

# ─── Meta AI (Llama crawlers) ───────────────────────────
User-agent: meta-externalagent
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /customer-dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

# ─── Apple Applebot-Extended (Apple Intelligence / Siri) ─
User-agent: Applebot-Extended
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /customer-dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

# ─── Common Crawl (open dataset) ────────────────────────
User-agent: CCBot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /customer-dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

# ─── Cohere AI ──────────────────────────────────────────
User-agent: cohere-ai
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /customer-dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

Sitemap: ${baseUrl}/sitemap.xml
`

    return new Response(body, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
    })
}
