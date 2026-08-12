import { productService } from "@/services/productService";
import StoreClient from "@/components/client/store-client";
import { createSlug } from "@/utils/slug-utils";
import { Metadata } from "next";
import { Product } from "@/types";

import { Metadata } from "next";

// Fetch products on every request (fully dynamic)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Industrial Automation Products Store | TiTEC Automation Sri Lanka",
    description: "Buy PLCs, HMIs, VFDs, inverters, sensors and industrial automation components in Sri Lanka. TiTEC Automation — trusted supplier for manufacturers islandwide.",
    keywords: [
        "PLC Sri Lanka",
        "HMI automation Sri Lanka",
        "VFD inverter Sri Lanka",
        "industrial sensors",
        "automation components",
        "buy automation products Sri Lanka",
        "TiTEC Automation store",
        "SCADA hardware",
        "control panel components",
        "industrial electronics",
    ],
    alternates: {
        canonical: `${baseUrl}/store`,
    },
    openGraph: {
        title: "Store - Titec Automation",
        description: "Explore our range of industrial automation products including PLCs, HMIs, VFDs, and more.",
        type: "website",
        url: `${baseUrl}/store`,
        siteName: "TiTEC Automation",
        images: [
            {
                url: `${baseUrl}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "TiTEC Automation Industrial Products Store",
            },
        ],
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Industrial Automation Products Store | TiTEC Automation Sri Lanka",
        description: "Buy PLCs, HMIs, VFDs, inverters, sensors and industrial automation components in Sri Lanka.",
        images: [`${baseUrl}/og-image.jpg`],
    },
};

export default async function Store() {
    let products: Product[] = [];
    try {
        products = await productService.getProducts();
    } catch {
        // Fail silently — StoreClient will show empty state
    }

    // ── JSON-LD: ItemList Schema ──
    // This tells Google exactly what products are on this page,
    // enabling rich product carousels in search results.
    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${baseUrl}/store`,
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
