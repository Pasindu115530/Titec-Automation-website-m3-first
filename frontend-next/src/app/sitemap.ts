import { MetadataRoute } from 'next'
import { productService } from '@/services/productService'
import { createSlug } from '@/utils/slug-utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://titecautomation.lk'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/store`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ]

    // Dynamic product pages
    let productPages: MetadataRoute.Sitemap = []
    try {
        const products = await productService.getProducts()
        productPages = products.map(product => ({
            url: `${baseUrl}/store/${createSlug(product.name, product.id)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    } catch (error) {
        // Silently fail during build if API is unreachable
        if (process.env.NODE_ENV === 'development') {
            console.error('Failed to fetch products for sitemap:', error)
        }
    }

    return [...staticPages, ...productPages]
}
