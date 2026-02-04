import { productService } from "@/services/productService";
import { Metadata, ResolvingMetadata } from "next";

import { getImageUrl } from "@/utils/image-utils";
import { extractIdFromSlug } from "@/utils/slug-utils";
import ProductDetailsModalWrapper from "@/components/client/product-details-wrapper";

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

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
    const priceText = product.price ? `Price: LKR ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}` : '';
    const description = `${cleanDesc.substring(0, 130)}... ${priceText}`.trim();

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: "website",
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
    let product: any = null;

    try {
        // Fetch only the specific product for SEO and performance
        product = await productService.getProductById(id);
    } catch (error) {
        console.error("Failed to fetch product server-side:", error);
    }

    // JSON-LD Construction
    let jsonLd = null;
    if (product) {
        const imageUrl = product.images && product.images.length > 0
            ? getImageUrl(product.images[0])
            : product.image
                ? getImageUrl(product.image)
                : '/placeholder-product.jpg';

        const brandName = product.brand || "Titec Automation";
        const stockStatus = (product.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
        const cleanDesc = stripHtml(product.description || "");

        jsonLd = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": [imageUrl],
            "description": cleanDesc,
            "brand": {
                "@type": "Brand",
                "name": brandName
            },
            "offers": {
                "@type": "Offer",
                "url": `https://titecautomation.com/store/${slug}`,
                "priceCurrency": "LKR",
                "price": product.price,
                "availability": stockStatus,
                "itemCondition": "https://schema.org/NewCondition"
            }
        };
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

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}

            {/* Render primarily the Product Details as a standalone page */}
            <ProductDetailsModalWrapper product={product} />
        </>
    );
}
