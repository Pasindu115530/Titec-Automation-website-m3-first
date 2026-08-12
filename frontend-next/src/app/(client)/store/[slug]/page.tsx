import { productService } from "@/services/productService";
import { Metadata, ResolvingMetadata } from "next";
import { getImageUrl } from "@/utils/image-utils";
import { extractIdFromSlug, createSlug } from "@/utils/slug-utils";
import ProductDetailPage from "@/components/client/product-detail-page";
import { Product } from "@/types";

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Enable ISR – revalidate every 60 seconds
export const revalidate = 60;

// ── Pre-render known product pages at build time ──
// Falls back gracefully if the API is unreachable during build
export async function generateStaticParams() {
    try {
        const products = await productService.getProducts();
        return (Array.isArray(products) ? products : []).map((product: Product) => ({
            slug: createSlug(product.name, product.id),
        }));
    } catch {
        return [];
    }
}

// Helper to strip HTML tags for description
function stripHtml(html: string) {
    return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

export async function generateMetadata(
    { params }: Props,
    _parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const id = extractIdFromSlug(slug);
    let product: Product | null = null;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

    try {
        product = await productService.getProductById(id);
    } catch {
        // Fail silently — return minimal fallback metadata
    }

    if (!product) {
        return {
            title: "Product Not Found | TiTEC Automation",
            description: "The requested product could not be found."
        };
    }

    const imageUrl = product.images && product.images.length > 0
        ? getImageUrl(product.images[0])
        : product.image
            ? getImageUrl(product.image)
            : `${baseUrl}/og-image.jpg`;

    const brandName = product.brand || "TiTEC Automation";
    const title = `${product.name} | ${brandName} | TiTEC Automation`;
    const cleanDesc = stripHtml(product.description || "");
    const priceText = product.show_price !== false && product.price
        ? ` Price: LKR ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}.`
        : '';
    const description = cleanDesc.length > 10
        ? `${cleanDesc.substring(0, 145)}...${priceText}`.trim()
        : `${product.name} by ${brandName}. Industrial automation product available in Sri Lanka.${priceText}`;

    const canonicalUrl = `${baseUrl}/store/${slug}`;

    // Build keyword list from product attributes
    const keywords: string[] = [
        product.name,
        brandName,
        product.category,
        product.model_number,
        'industrial automation Sri Lanka',
        'TiTEC Automation',
        'buy automation product Sri Lanka',
    ].filter(Boolean) as string[];

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            type: "website",
            url: canonicalUrl,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
            siteName: "TiTEC Automation",
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        }
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const id = extractIdFromSlug(slug);
    let product: Product | null = null;
    let allProducts: Product[] = [];

    try {
        // Fetch the specific product + all products (for similar/related) in parallel
        const [productData, productsData] = await Promise.all([
            productService.getProductById(id),
            productService.getProducts()
        ]);
        product = productData;
        allProducts = productsData;
    } catch {
        // Will render not-found state below
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
                    <p className="text-gray-600 mt-2">The product you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    // ── Filter similar products (same category, different brand) ──
    const similarProducts = allProducts
        .filter(p =>
            p.id !== product!.id &&
            p.category === product!.category &&
            p.brand !== product!.brand
        )
        .slice(0, 8);

    // ── Filter related products (same brand, different product) ──
    const relatedProducts = allProducts
        .filter(p =>
            p.id !== product!.id &&
            product!.brand &&
            p.brand === product!.brand
        )
        .slice(0, 8);

    // ── JSON-LD: Product Schema ──
    const imageUrl = product.images && product.images.length > 0
        ? getImageUrl(product.images[0])
        : product.image
            ? getImageUrl(product.image)
            : null;

    // Collect all product images for the schema (Google supports multiple)
    const allImageUrls: string[] = product.images && product.images.length > 0
        ? product.images.map((img: string) => getImageUrl(img)).filter(Boolean)
        : imageUrl
            ? [imageUrl]
            : [];

    const brandName = product.brand || "TiTEC Automation";
    const stockStatus = (product.stock || 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock";
    const cleanDesc = stripHtml(product.description || "");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';
    const canonicalUrl = `${baseUrl}/store/${slug}`;

    const productJsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": canonicalUrl,
        "name": product.name,
        "image": allImageUrls.length > 0 ? allImageUrls : undefined,
        "description": cleanDesc,
        "brand": {
            "@type": "Brand",
            "name": brandName,
        },
        "sku": product.sku || undefined,
        "mpn": product.model_number || undefined,
        "category": product.category || undefined,
        "url": canonicalUrl,
        // Seller is always TiTEC — surfaces in AI-powered shopping results
        "seller": {
            "@type": "Organization",
            "name": "TiTEC Automation",
            "url": baseUrl,
        },
    };

    if (product.show_price !== false) {
        productJsonLd["offers"] = {
            "@type": "Offer",
            "@id": `${canonicalUrl}#offer`,
            "url": canonicalUrl,
            "priceCurrency": "LKR",
            "price": product.price,
            "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                .toISOString().split('T')[0],
            "availability": stockStatus,
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "TiTEC Automation",
                "url": baseUrl,
            },
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "LK",
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "businessDays": {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                            "Monday", "Tuesday", "Wednesday",
                            "Thursday", "Friday",
                        ],
                    },
                },
            },
        };
    }

    // ── JSON-LD: BreadcrumbList Schema ──
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Store",
                "item": `${baseUrl}/store`
            },
            ...(product.category ? [{
                "@type": "ListItem",
                "position": 3,
                "name": product.category,
                "item": `${baseUrl}/store?category=${encodeURIComponent(product.category)}`
            }] : []),
            {
                "@type": "ListItem",
                "position": product.category ? 4 : 3,
                "name": product.name,
                "item": canonicalUrl,
            }
        ]
    };

    return (
        <>
            {/* Product JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />

            {/* Breadcrumb JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <ProductDetailPage
                product={product}
                similarProducts={similarProducts}
                relatedProducts={relatedProducts}
            />
        </>
    );
}
