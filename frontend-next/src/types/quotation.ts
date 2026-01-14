export interface QuotationItem {
    name: string;
    quantity: number;
    notes?: string;
    price?: number; // Added during billing
}

export interface Quotation {
    id: number;
    name: string;
    email: string;
    phone?: string;
    items: QuotationItem[];
    status: 'pending' | 'sent' | 'rejected';
    total_amount?: number;
    created_at: string;
    updated_at: string;
}
