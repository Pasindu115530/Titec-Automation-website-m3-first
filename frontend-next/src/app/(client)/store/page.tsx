import { productService } from "@/services/productService";
import StoreClient from "@/components/client/store-client";
import { createSlug } from "@/utils/slug-utils";
import { getImageUrl } from "@/utils/image-utils";
import { Metadata } from "next";
import { Product } from "@/types";

export const revalidate = 300;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

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

    // ── Group products by category for the server-rendered catalog ──
    const productsByCategory = products.reduce((acc, product) => {
        const cat = product.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

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

            {/*
              Server-rendered product catalog for AI chatbot crawlability.
              Visible to both users (as a secondary browsing aid) and crawlers.
              This ensures crawlers that don't execute JS can discover every product.
            */}
            {products.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 pb-16">
                    <div className="border-t border-gray-200 pt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Complete Product Catalog
                        </h2>
                        <p className="text-gray-500 text-sm mb-8">
                            Browse all {products.length} industrial automation products available at TiTEC Automation Sri Lanka.
                        </p>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                                <div key={category}>
                                    <h3 className="text-lg font-semibold text-gray-700 capitalize mb-3 pb-2 border-b border-gray-100">
                                        {category}
                                        <span className="text-sm font-normal text-gray-400 ml-2">
                                            ({categoryProducts.length})
                                        </span>
                                    </h3>
                                    <ul className="space-y-1.5">
                                        {categoryProducts.map(product => {
                                            const productImage = product.images && product.images.length > 0
                                                ? getImageUrl(product.images[0])
                                                : product.image
                                                    ? getImageUrl(product.image)
                                                    : null;
                                            return (
                                                <li key={product.id}>
                                                    <a
                                                        href={`/store/${createSlug(product.name, product.id)}`}
                                                        className="group flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors py-1.5 px-2 -mx-2 rounded-lg hover:bg-blue-50/50"
                                                    >
                                                        {productImage && (
                                                            <img
                                                                src={productImage}
                                                                alt={product.name}
                                                                className="w-8 h-8 object-contain rounded border border-gray-100 bg-white shrink-0"
                                                                loading="lazy"
                                                            />
                                                        )}
                                                        <span className="group-hover:underline truncate">
                                                            {product.name}
                                                        </span>
                                                        {product.show_price !== false && product.price && (
                                                            <span className="ml-auto text-xs text-gray-400 shrink-0">
                                                                LKR {typeof product.price === 'string' ? parseFloat(product.price).toFixed(0) : product.price.toFixed(0)}
                                                            </span>
                                                        )}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
