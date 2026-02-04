"use client";

import { useRouter } from "next/navigation";
import ProductDetailsModal from "./product-details-modal";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { getImageUrl } from "@/utils/image-utils";

export default function ProductDetailsModalWrapper({ product }: { product: Product }) {
    const router = useRouter();
    const { addItem } = useCart();

    const handleClose = () => {
        router.push('/store');
    };

    const handleAddToQuote = (p: Product) => {
        addItem({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            image: p.images && p.images.length > 0 ? getImageUrl(p.images[0], '') : (p.image ? getImageUrl(p.image, '') : ''),
        }, true); // Open cart after adding?
    };

    return (
        <ProductDetailsModal
            isOpen={true}
            onClose={handleClose}
            product={product}
            onAddToQuote={handleAddToQuote}
        />
    );
}
