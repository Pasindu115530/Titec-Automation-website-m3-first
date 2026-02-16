export interface Project {
    id: string;
    title: string;
    client: string;
    description: string;
    location?: string;
    completion_date: string;
    status: string;
    technologies?: string[];
    thumbnail_path: string;
    logo_path?: string;
    project_image_urls: string[];
    created_at: string;
    updated_at: string;
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
    logo_path?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string; // mapped from 'desc' in backend if needed, or 'description'
    category: string;
    brand?: string; // Legacy string
    brand_id?: number; // New relation
    brand_details?: Brand; // Expanded relation
    image?: string; // Legacy fallback
    images?: string[]; // New multiple images support
    datasheet_path?: string;
    stock?: number;
    sku?: string;
    unit?: string;
    model_number?: string;
    on_store?: boolean; // Visibility toggle for client store
}

export interface ServiceItem {
    id: number;
    service_category_id: number;
    title: string;
    description: string;
    sort_order: number;
}

export interface ServiceCategory {
    id: number;
    title: string;
    description: string;
    image_path: string | null;
    slug: string;
    sort_order: number;
    items: ServiceItem[];
    created_at?: string;
    updated_at?: string;
}
