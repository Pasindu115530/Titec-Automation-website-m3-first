"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import ProductDetailsModal from "@/components/client/product-details-modal";
import { getImageUrl } from "@/utils/image-utils";

export default function InterceptedProductModal({ product }: { product: Product }) {
    const router = useRouter();
    const { addItem } = useCart();

    const handleAddToQuote = (p: Product) => {
        addItem({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            image: p.images && p.images.length > 0 ? getImageUrl(p.images[0], '') : (p.image ? getImageUrl(p.image, '') : ''),
        }, false);
    };

    return (
        <ProductDetailsModal
            isOpen={true}
            onClose={() => router.back()}
            product={product}
            onAddToQuote={handleAddToQuote}
        />
    );
}
