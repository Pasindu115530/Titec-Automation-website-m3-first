export interface QuotationItem {
    name: string;
    quantity: number;
    notes?: string;
    price?: number; // Added during billing
}

export interface Quotation {
    id: string;
    name: string;
    email: string;
    phone?: string;
    customer_notes?: string;
    total_amount?: number;
    // Relations
    user?: {
        id: string;
        name: string;
        email: string;
    };
    products?: any[]; // or define Product type
    items?: QuotationItem[]; // For the reply/quote itself? Or request items?
    // Request items are in 'products' via pivot in existing code, but let's stick to what we see in the table
    // Table uses q.products and q.customer_notes
    status: 'pending' | 'quoted' | 'closed' | 'sent' | 'rejected';
    created_at: string;
    updated_at: string;
}
