import { MetadataRoute } from 'next'
import { productService } from '@/services/productService'
import { projectService } from '@/services/projectService'
import { createSlug } from '@/utils/slug-utils'

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
        const products = await productService.getProducts()
        productPages = products.map(product => ({
            url: `${baseUrl}/store/${createSlug(product.name, product.id)}`,
            lastModified: new Date((product as any).updated_at || now),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    } catch {
        // Silently skip — sitemap will still include static pages
    }

    // ── Dynamic project pages ──
    let projectPages: MetadataRoute.Sitemap = []
    try {
        const projects = await projectService.getProjects()
        projectPages = projects.map(project => ({
            url: `${baseUrl}/projects/${project.id}`,
            lastModified: new Date(
                (project as any).updated_at || project.completion_date || now
            ),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }))
    } catch {
        // Silently skip — sitemap will still include static pages
    }

    return [...staticPages, ...productPages, ...projectPages]
}
