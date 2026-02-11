import { productService } from "@/services/productService";
import StoreClient from "@/components/client/store-client";

import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Store - Titec Automation",
    description: "Explore our range of industrial automation products including PLCs, HMIs, VFDs, and more.",
    openGraph: {
        title: "Store - Titec Automation",
        description: "Explore our range of industrial automation products including PLCs, HMIs, VFDs, and more.",
        type: "website",
    }
};

export default async function Store() {
    let products: any[] = [];
    try {
        products = await productService.getProducts();
    } catch (error) {
        // Silently fail during build, log only in development client-side
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
            console.error("Failed to fetch products server-side:", error);
        }
    }

    return <StoreClient initialProducts={products} />;
}
