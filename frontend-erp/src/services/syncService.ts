import { offlineDb, PendingInvoice, PendingServiceLog } from '@/lib/offline-db';
import { api } from '@/lib/api';

class SyncService {
  private isSyncing = false;

  // ── Initialize ─────────────────────────────

  init(): void {
    if (typeof window !== 'undefined') {
      // Listen for online events
      window.addEventListener('online', () => this.syncAll());

      // Sync on startup if online
      if (navigator.onLine) {
        this.syncAll();
      }
    }
  }

  // ── Sync All Pending Records ───────────────

  async syncAll(): Promise<SyncResult> {
    if (this.isSyncing) {
      return { invoices: 0, serviceLogs: 0, errors: [] };
    }

    this.isSyncing = true;
    const result: SyncResult = { invoices: 0, serviceLogs: 0, errors: [] };

    try {
      result.invoices = await this.syncInvoices();
      result.serviceLogs = await this.syncServiceLogs();
    } catch (error) {
      result.errors.push(String(error));
    } finally {
      this.isSyncing = false;
    }

    return result;
  }

  // ── Sync Pending Invoices ──────────────────

  private async syncInvoices(): Promise<number> {
    const pending = await offlineDb.pendingInvoices
      .where('status')
      .equals('pending')
      .toArray();

    if (pending.length === 0) return 0;

    // Mark as syncing
    await Promise.all(
      pending.map(inv =>
        offlineDb.pendingInvoices.update(inv.uuid, { status: 'syncing' })
      )
    );

    try {
      const response = await api.post('/invoices/batch', {
        invoices: pending.map(inv => ({
          uuid: inv.uuid,
          client_id: inv.client_id,
          items: inv.items,
          tax_rate: inv.tax_rate,
          discount_amount: inv.discount_amount,
          discount_type: inv.discount_type,
          payment_method: inv.payment_method,
          notes: inv.notes,
          terms: inv.terms,
          due_date: inv.due_date,
        })),
      });

      // Process results
      let synced = 0;
      for (const result of response.data.results) {
        if (result.status === 'created' || result.status === 'already_exists') {
          await offlineDb.pendingInvoices.update(result.uuid, {
            status: 'synced',
            updated_at: Date.now(),
          });
          synced++;
        } else {
          await offlineDb.pendingInvoices.update(result.uuid, {
            status: 'error',
            error_message: result.message,
            updated_at: Date.now(),
          });
        }
      }

      // Clean up synced records (keep for 24h for reference)
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      await offlineDb.pendingInvoices
        .where('status').equals('synced')
        .and(inv => inv.updated_at < cutoff)
        .delete();

      return synced;
    } catch (error) {
      // Revert to pending on network error
      await Promise.all(
        pending.map(inv =>
          offlineDb.pendingInvoices.update(inv.uuid, { status: 'pending' })
        )
      );
      throw error;
    }
  }

  // ── Sync Pending Service Logs ──────────────

  private async syncServiceLogs(): Promise<number> {
    const pending = await offlineDb.pendingServiceLogs
      .where('status')
      .equals('pending')
      .toArray();

    if (pending.length === 0) return 0;

    try {
      const response = await api.post('/service-logs/batch', {
        service_logs: pending.map(log => ({
          uuid: log.uuid,
          client_id: log.client_id,
          invoice_item_id: log.invoice_item_id,
          product_id: log.product_id,
          technician_id: log.technician_id,
          title: log.title,
          description: log.description,
          diagnosis: log.diagnosis,
          resolution: log.resolution,
          service_type: log.service_type,
          service_date: log.service_date,
          next_service_date: log.next_service_date,
          service_charge: log.service_charge,
        })),
      });

      let synced = 0;
      for (const result of response.data.results) {
        if (result.status === 'created' || result.status === 'already_exists') {
          await offlineDb.pendingServiceLogs.update(result.uuid, {
            status: 'synced',
          });
          synced++;
        }
      }
      return synced;
    } catch {
      return 0;
    }
  }

  // ── Get Pending Count ──────────────────────

  async getPendingCount(): Promise<{ invoices: number; serviceLogs: number }> {
    const invoices = await offlineDb.pendingInvoices
      .where('status').equals('pending').count();
    const serviceLogs = await offlineDb.pendingServiceLogs
      .where('status').equals('pending').count();
    return { invoices, serviceLogs };
  }
}

export interface SyncResult {
  invoices: number;
  serviceLogs: number;
  errors: string[];
}

export const syncService = new SyncService();
