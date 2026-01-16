export interface Project {
    id: number;
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
    id: number;
    name: string;
    price: number;
    description: string; // mapped from 'desc' in backend if needed, or 'description'
    category: string;
    image?: string;
    stock?: number;
    sku?: string;
}
