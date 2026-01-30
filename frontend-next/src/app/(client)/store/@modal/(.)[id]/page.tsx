import { productService } from "@/services/productService";
import InterceptedProductModal from "@/components/client/intercepted-product-modal";

export default async function InterceptedProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let product = null;
    try {
        product = await productService.getProductById(id);
    } catch (error) {
        console.error("Failed to fetch product for interceptor", error);
    }

    if (!product) return null;

    return <InterceptedProductModal product={product} />;
}
