import { productService } from '@/services/productService';
import { Product } from '@/types';

export const revalidate = 3600; // Revalidate every hour

/**
 * Dynamic route that generates a full plain-text product catalog
 * for AI chatbot consumption. This follows the llms-full.txt convention
 * where AI crawlers can ingest a complete text representation of all products.
 */
export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

    let products: Product[] = [];
    try {
        products = await productService.getProducts();
    } catch {
        // Return minimal response if API is down
        return new Response(
            '# TiTEC Automation — Product Catalog\n\nProduct data temporarily unavailable. Visit https://www.titecautomation.lk/store for the latest catalog.\n',
            {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Cache-Control': 'public, max-age=300',
                },
            }
        );
    }

    // Strip HTML tags from descriptions
    const stripHtml = (html: string) =>
        html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();

    // Build plain text catalog
    const lines: string[] = [
        '# TiTEC Automation — Full Product Catalog',
        '',
        `> Generated: ${new Date().toISOString()}`,
        `> Total Products: ${products.length}`,
        `> Store URL: ${baseUrl}/store`,
        '',
        '---',
        '',
    ];

    // Group by category
    const byCategory = products.reduce((acc, p) => {
        const cat = p.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(p);
        return acc;
    }, {} as Record<string, Product[]>);

    for (const [category, categoryProducts] of Object.entries(byCategory)) {
        lines.push(`## ${category}`);
        lines.push('');

        for (const product of categoryProducts) {
            lines.push(`### ${product.name}`);
            if (product.brand) lines.push(`- Brand: ${product.brand}`);
            if (product.model_number) lines.push(`- Model: ${product.model_number}`);
            if (product.sku) lines.push(`- SKU: ${product.sku}`);
            if (product.show_price !== false && product.price) {
                const price = typeof product.price === 'string'
                    ? parseFloat(product.price).toFixed(2)
                    : product.price.toFixed(2);
                lines.push(`- Price: LKR ${price}`);
            }
            lines.push(`- Availability: ${(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}`);
            if (product.unit) lines.push(`- Unit: ${product.unit}`);
            if (product.description) {
                const desc = stripHtml(product.description);
                // Truncate very long descriptions to keep file manageable
                lines.push(`- Description: ${desc.length > 500 ? desc.substring(0, 500) + '...' : desc}`);
            }
            lines.push(`- URL: ${baseUrl}/store/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}-${product.id}`);
            lines.push('');
        }

        lines.push('---');
        lines.push('');
    }

    lines.push('## About TiTEC Automation');
    lines.push('');
    lines.push('TiTEC Automation is a leading industrial automation solutions provider in Sri Lanka.');
    lines.push('We supply PLCs, HMIs, VFDs, sensors, and control panel components for manufacturers islandwide.');
    lines.push('');
    lines.push(`Website: ${baseUrl}`);
    lines.push(`Store: ${baseUrl}/store`);
    lines.push(`Contact: ${baseUrl}/contact`);

    return new Response(lines.join('\n'), {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
