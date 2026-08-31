import { MetadataRoute } from 'next'
import { createSlug } from '@/utils/slug-utils'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.titecautomation.lk'
const SITEMAP_FETCH_TIMEOUT_MS = 5000 // 5 s — generous but won't hang Google

/**
 * Fetch a backend endpoint server-side using native fetch.
 * Uses the axios api instance only on the client; here we bypass it entirely
 * to avoid the localStorage interceptor running in the Node.js runtime.
 * Returns null on any error so the caller can degrade gracefully.
 */
async function serverFetch<T>(path: string): Promise<T | null> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), SITEMAP_FETCH_TIMEOUT_MS)
    try {
        const res = await fetch(`${BACKEND_URL}${path}`, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
            // Next.js: don't cache sitemap data — always fresh
            cache: 'no-store',
        })
        if (!res.ok) return null
        const json = await res.json()
        return (json?.data ?? json) as T
    } catch {
        return null
    } finally {
        clearTimeout(timer)
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk'
    const now = new Date()

    // ── Static pages ──
    // Ordered by business priority / crawl importance
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/store`,
            lastModified: now,
            changeFrequency: 'daily',    // Products added/updated frequently
            priority: 0.9,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/clients`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    // ── Dynamic product pages ──
    let productPages: MetadataRoute.Sitemap = []
    try {
        const products = await serverFetch<any[]>('/api/products')
        if (Array.isArray(products)) {
            productPages = products.map((product: any) => ({
                url: `${baseUrl}/store/${createSlug(product.name, product.id)}`,
                lastModified: new Date(product.updated_at || now),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        }
    } catch {
        // Silently skip — sitemap will still include static pages
    }

    // ── Dynamic project pages ──
    let projectPages: MetadataRoute.Sitemap = []
    try {
        const projects = await serverFetch<any[]>('/api/projects')
        if (Array.isArray(projects)) {
            projectPages = projects.map((project: any) => ({
                url: `${baseUrl}/projects/${project.id}`,
                lastModified: new Date(project.updated_at || project.completion_date || now),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            }))
        }
    } catch {
        // Silently skip — sitemap will still include static pages
    }

    return [...staticPages, ...productPages, ...projectPages]
}
