export interface Project {
    id: string; // slug
    title: string;
    clientName: string;
    description: string;
    details: string;
    image: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string; // mapped from 'desc' in backend if needed, or 'description'
    category: string;
    image?: string;
    stock?: number;
    sku?: string;
}
