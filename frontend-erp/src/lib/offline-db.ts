import Dexie, { type Table } from 'dexie';

// ── Types ────────────────────────────────────────

export interface PendingInvoice {
  uuid: string;                    // Primary key (UUID v4)
  client_id: number;
  client_name: string;             // Denormalized for offline display
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
  status: 'pending' | 'syncing' | 'synced' | 'error';
  error_message?: string;
  created_at: number;              // timestamp
  updated_at: number;
}

export interface PendingInvoiceItem {
  product_id: number;
  product_name: string;
  product_model?: string;
  unit_price: number;
  quantity: number;
  unit: string;
  serial_number?: string;
  warranty_months: number;
  line_total: number;
}

export interface PendingServiceLog {
  uuid: string;                    // Primary key (UUID v4)
  client_id: number;
  client_name: string;
  invoice_item_id?: number;
  product_id?: number;
  product_name?: string;
  technician_id: number;
  title: string;
  description: string;
  diagnosis?: string;
  resolution?: string;
  service_type: string;
  service_date: string;
  next_service_date?: string;
  service_charge: number;
  status: 'pending' | 'syncing' | 'synced' | 'error';
  error_message?: string;
  created_at: number;
  updated_at: number;
}

// ── Database Class ───────────────────────────────

class OfflineDB extends Dexie {
  pendingInvoices!: Table<PendingInvoice, string>;
  pendingServiceLogs!: Table<PendingServiceLog, string>;

  constructor() {
    super('TiTEC_ERP_Offline');

    this.version(1).stores({
      pendingInvoices: 'uuid, client_id, status, created_at',
      pendingServiceLogs: 'uuid, client_id, status, created_at',
    });
  }
}

export const offlineDb = new OfflineDB();
