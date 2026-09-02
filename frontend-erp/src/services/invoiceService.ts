import { api } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';
import { offlineDb, PendingInvoice, PendingInvoiceItem } from '@/lib/offline-db';
import { syncService } from './syncService';

export interface CreateInvoiceData {
  client_id: number;
  client_name: string; // Used for offline display
  items: PendingInvoiceItem[];
  tax_rate: number;
  discount_amount: number;
  discount_type: 'fixed' | 'percentage';
  subtotal: number;
  tax_amount: number;
  grand_total: number;
  payment_method?: string;
  notes?: string;
  terms?: string;
  due_date?: string;
}

export const invoiceService = {
  async getInvoices(params: any = {}) {
    const response = await api.get('/api/invoices', { params });
    return response.data;
  },

  async getInvoice(id: number) {
    const response = await api.get(`/api/invoices/${id}`);
    return response.data;
  },

  async createInvoice(data: CreateInvoiceData) {
    if (!navigator.onLine) {
      // Save offline
      return this.saveOffline(data);
    }

    try {
      // Create via API
      const response = await api.post('/api/invoices', data);
      return response.data;
    } catch (error) {
      console.warn('API creation failed, falling back to offline storage', error);
      return this.saveOffline(data);
    }
  },

  async saveOffline(data: CreateInvoiceData) {
    const uuid = uuidv4();
    await offlineDb.pendingInvoices.add({
      uuid,
      ...data,
      status: 'pending',
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    
    // Attempt sync in background just in case network comes back quickly
    setTimeout(() => {
      if (navigator.onLine) syncService.syncAll();
    }, 2000);

    return { 
      message: 'Saved offline as draft', 
      offline: true,
      uuid 
    };
  },

  async confirmInvoice(id: number) {
    const response = await api.post(`/api/invoices/${id}/confirm`);
    return response.data;
  },

  async voidInvoice(id: number) {
    const response = await api.post(`/api/invoices/${id}/void`);
    return response.data;
  },

  async recordPayment(id: number, amount: number, payment_method: string) {
    const response = await api.post(`/api/invoices/${id}/payment`, {
      amount,
      payment_method,
    });
    return response.data;
  }
};
