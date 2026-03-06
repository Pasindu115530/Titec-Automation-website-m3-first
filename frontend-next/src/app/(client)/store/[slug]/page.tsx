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

// Helper to strip HTML tags for description
function stripHtml(html: string) {
    return html.replace(/<[^>]*>?/gm, '');
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const id = extractIdFromSlug(slug);
    let product = null;

    try {
        product = await productService.getProductById(id);
    } catch (e) {
        console.error("Failed to fetch product for metadata", e);
    }

    if (!product) {
        return {
            title: "Product Not Found | Titec Automation",
            description: "The requested product could not be found."
        };
    }

    const imageUrl = product.images && product.images.length > 0
        ? getImageUrl(product.images[0])
        : product.image
            ? getImageUrl(product.image)
            : '/placeholder-product.jpg';

    const brandName = product.brand || "Titec Automation";
    const title = `${product.name} | ${brandName}`;
    const cleanDesc = stripHtml(product.description || "");
    const priceText = product.show_price !== false && product.price ? `Price: LKR ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}` : '';
    const description = priceText ? `${cleanDesc.substring(0, 130)}... ${priceText}`.trim() : `${cleanDesc.substring(0, 150)}...`.trim();

    const canonicalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://titecautomation.lk'}/store/${slug}`;

    return {
        title: title,
        description: description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: title,
            description: description,
            type: "website",
            url: canonicalUrl,
            images: [imageUrl],
            siteName: "Titec Automation",
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
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
    } catch (error) {
        console.error("Failed to fetch product data server-side:", error);
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
            : '/placeholder-product.jpg';

    const brandName = product.brand || "Titec Automation";
    const stockStatus = (product.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
    const cleanDesc = stripHtml(product.description || "");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://titecautomation.lk';

    const productJsonLd: any = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": [imageUrl],
        "description": cleanDesc,
        "brand": {
            "@type": "Brand",
            "name": brandName
        },
        "sku": product.sku || undefined,
        "mpn": product.model_number || undefined,
    };

    if (product.show_price !== false) {
        productJsonLd.offers = {
            "@type": "Offer",
            "url": `${baseUrl}/store/${slug}`,
            "priceCurrency": "LKR",
            "price": product.price,
            "availability": stockStatus,
            "itemCondition": "https://schema.org/NewCondition"
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
            {
                "@type": "ListItem",
                "position": 3,
                "name": product.category,
                "item": `${baseUrl}/store?category=${encodeURIComponent(product.category)}`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": product.name
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
