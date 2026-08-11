import { productService } from "@/services/productService";
import StoreClient from "@/components/client/store-client";
import { createSlug } from "@/utils/slug-utils";
import { Metadata } from "next";

// ISR: revalidate every 5 minutes instead of force-dynamic
// This makes the store resilient if the API is briefly down during a Googlebot crawl
export const revalidate = 300;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

export const metadata: Metadata = {
    title: "Industrial Automation Products Store | TiTEC Automation Sri Lanka",
    description: "Buy PLCs, HMIs, VFDs, inverters, sensors and industrial automation components in Sri Lanka. TiTEC Automation — trusted supplier for manufacturers islandwide.",
    alternates: {
        canonical: `${baseUrl}/store`,
    },
    openGraph: {
        title: "Industrial Automation Products Store | TiTEC Automation Sri Lanka",
        description: "Buy PLCs, HMIs, VFDs, inverters, sensors and industrial automation components in Sri Lanka.",
        type: "website",
        url: `${baseUrl}/store`,
        siteName: "TiTEC Automation",
    },
    twitter: {
        card: "summary_large_image",
        title: "Industrial Automation Products Store | TiTEC Automation Sri Lanka",
        description: "Buy PLCs, HMIs, VFDs, inverters, sensors and industrial automation components in Sri Lanka.",
    }
};

export default async function Store() {
    let products: any[] = [];
    try {
        products = await productService.getProducts();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Failed to fetch products server-side:", error);
        }
    }

    // ── JSON-LD: ItemList Schema ──
    // This tells Google exactly what products are on this page,
    // enabling rich product carousels in search results.
    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "TiTEC Automation Product Catalog",
        "description": "Industrial automation products available from TiTEC Automation Sri Lanka",
        "url": `${baseUrl}/store`,
        "numberOfItems": products.length,
        "itemListElement": products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": product.name,
            "url": `${baseUrl}/store/${createSlug(product.name, product.id)}`,
        })),
    };

    // ── JSON-LD: BreadcrumbList ──
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Store", "item": `${baseUrl}/store` },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <StoreClient initialProducts={products} />
        </>
    );
}
