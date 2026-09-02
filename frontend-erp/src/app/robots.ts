import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk'

    return {
        rules: [
            // ── Standard web crawlers ──
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/customer-dashboard/'],
            },
            // ── Google-Extended (Bard / Gemini training) ──
            // Allow: site content is informational and benefits from AI visibility
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/customer-dashboard/'],
            },
            // ── OpenAI GPTBot (ChatGPT training & search) ──
            {
                userAgent: 'GPTBot',
                allow: ['/store/', '/projects/', '/services/', '/about/', '/faq/'],
                disallow: ['/dashboard/', '/api/', '/customer-dashboard/'],
            },
            // ── OpenAI ChatGPT-User (real-time web browsing via ChatGPT) ──
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/customer-dashboard/'],
            },
            // ── Anthropic ClaudeBot (Claude web search & training) ──
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/customer-dashboard/'],
            },
            // ── Perplexity AI ──
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/customer-dashboard/'],
            },
            // ── Meta AI (Llama crawlers) ──
            {
                userAgent: 'meta-externalagent',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/customer-dashboard/'],
            },
            // ── Apple Applebot-Extended (Apple Intelligence / Siri) ──
            {
                userAgent: 'Applebot-Extended',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/customer-dashboard/'],
            },
            // ── Common Crawl (open dataset used by many AI models) ──
            {
                userAgent: 'CCBot',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/customer-dashboard/'],
            },
            // ── Cohere AI ──
            {
                userAgent: 'cohere-ai',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/customer-dashboard/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
