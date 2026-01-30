import { productService } from "@/services/productService";
import StoreClient from "@/components/client/store-client";
import { Metadata, ResolvingMetadata } from "next";
import { getImageUrl } from "@/utils/image-utils";

type Props = {
    params: Promise<{ id: string }>
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
    const { id } = await params;
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
    const { id } = await params;
    let products: any[] = [];
    let product: any = null;

    try {
        // Fetch all for the store background
        products = await productService.getProducts();

        // Fetch specific for JSON-LD (or find in list if populated)
        // We use finding from list to save a request if possible, or fetch if needed.
        // But for guaranteed fresh data for SEO, we can fetchById. 
        // Let's just find it to render faster, assuming list has full data.
        product = products.find((p: any) => String(p.id) === id);

        // If not found in list (maybe pagination later?), try fetchById
        if (!product) {
            try {
                product = await productService.getProductById(id);
            } catch (err) {
                // ignore
            }
        }

    } catch (error) {
        console.error("Failed to fetch products server-side:", error);
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
                "url": `https://titecautomation.com/store/${product.id}`, // Ideally env var for host
                "priceCurrency": "LKR",
                "price": product.price,
                "availability": stockStatus,
                "itemCondition": "https://schema.org/NewCondition"
            }
        };
    }

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <StoreClient initialProducts={products} />
        </>
    );
}
