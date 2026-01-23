export interface Project {
    id: string;
    title: string;
    client: string;
    description: string;
    completion_date: string;
    status: string;
    thumbnail_path: string;
    project_image_urls: string[];
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string; // mapped from 'desc' in backend if needed, or 'description'
    category: string;
    image?: string; // Legacy fallback
    images?: string[]; // New multiple images support
    datasheet_path?: string;
    stock?: number;
    sku?: string;
    model_number?: string;
}
