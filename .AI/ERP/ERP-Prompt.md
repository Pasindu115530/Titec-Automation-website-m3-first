# Role and Context
You are an expert Full-Stack & DevOps Engineer. You are working within the "TiTEC Automation" monorepo, which currently contains a Next.js 16 SSR frontend (`frontend-next`) and a Laravel 12 API backend (`backend-laravel`). 

# Objective
Architect and implement a unified cloud-based ERP module (`frontend-erp`) and update the backend and CI/CD pipeline. The implementation must happen in two phases:
0. **Phase 0 (Analize the Existing Project and Check for Issues):** Refer .AI and analyze the Project Environments, Architecture, Database, and Codebase to identify potential compatibility issues.
1. **Phase 1 (Consolidation & RBAC):** Migrate the existing website admin panel out of the SSR frontend and into the new static ERP frontend, securing it with Role-Based Access Control (RBAC).
2. **Phase 2 (ERP Features):** Implement an offline-capable Point of Sale/Billing system, Supply & Installation tracking, and Client Service History for warranty tracking. on top of current products tables. (Note: No barcode scanning is required).

# Tech Stack & Environment Constraints
*   **Monorepo Addition:** Create a new directory `frontend-erp` alongside `frontend-next` and `backend-laravel`.
*   **ERP Frontend:** Next.js 16 (React 19). Must be configured for **Static HTML Export** (`output: 'export'`) because the shared cPanel hosting struggles with multiple persistent Node.js processes.
*   **Backend:** Laravel 12 (PHP 8.2+).
*   **Database:** MySQL.
*   **Real-time:** Pusher (or equivalent managed WebSocket provider) for inventory updates.
*   **Local Storage:** IndexedDB via Dexie.js for offline queueing of invoices and stock updates.
*   **Auth & RBAC:** Laravel Sanctum bearer tokens with `spatie/laravel-permission`.

---

# Architecture & Implementation Requirements

Please generate the necessary code, file structures, database schemas, and configurations for the following:

## 1. Phase 1: Admin Panel Migration & RBAC Setup
*   **Migration:** Provide instructions/code to move the existing `(admin)` routes and components from `frontend-next/src/app/(admin)` into the new `frontend-erp` application.
*   **RBAC Backend:** Install and configure `spatie/laravel-permission`. 
*   **Roles & Permissions:** Define standard roles (e.g., `Super Admin`, `Content Editor`, `Sales`, `Technician`). 
*   **Route Protection:** Update the existing Laravel API routes to use Spatie's middleware (`middleware('role:Super Admin|Content Editor')`) so the public frontend is completely isolated from admin operations.

## 2. Phase 2: Database Architecture & Migrations (`backend-laravel`)
Design the Eloquent Models and Migrations for the new workflows:
*   **Clients/Customers:** Extension of existing users or a new `clients` table.
*   **Invoices & Invoice Items:** To handle equipment sales. Must include a `uuid` column for offline idempotency, and a `warranty_end_date` at the item level.
*   **Installations/Projects:** Tied to an invoice or client, tracking installation status, location, and assigned technicians.
*   **Service History/Logs:** Tied to a specific client and product/invoice item to log maintenance visits and check if a repair falls under the active warranty period.

## 3. Phase 2: Frontend Offline-First Billing & Inventory (`frontend-erp`)
*   **Export Config:** Provide `next.config.js` with `output: 'export'` and `images: { unoptimized: true }`.
*   **Offline-First IndexedDB (Dexie.js):**
    *   Configure Dexie.js with `pending_invoices` and `pending_service_logs` tables.
    *   Generate a client-side UUID (v4) as an **Idempotency Key** upon creation.
    *   Save locally: `{ uuid, client_id, items, total, timestamp, status: 'pending' }`.
*   **Sync Service:**
    *   Listen to `window.addEventListener('online', ...)` and batch `POST` pending records to the Laravel API. Include Bearer tokens.
    *   Delete successfully processed UUIDs from IndexedDB on a `200 OK` response. 

## 4. Phase 2: Backend Deduplication & Real-Time Sync
*   **Batch Endpoint:** Create a controller method to receive the batch array. Use `upsert()` or `firstOrCreate()` based on the `uuid` to gracefully ignore duplicates during network retries.
*   **Event Broadcasting:** Fire an `InventoryUpdated` event implementing `ShouldBroadcast` when an invoice reduces stock.
*   **Echo Listener (Frontend):** Provide a React component utilizing Laravel Echo and `pusher-js` to listen for `InventoryUpdated` and instantly adjust available stock on the UI across all connected PCs.

## 5. Monorepo Structure & CI/CD Pipeline Update (`.github/workflows/deploy.yml`)
*   Implement path filtering (`dorny/paths-filter` or `on.push.paths`) to separate build/deploy jobs.
*   **Job 1 (`deploy-main-web`):** Triggers on `frontend-next/**` changes. Builds and deploys the SSR Next.js app via custom `server.js`.
*   **Job 2 (`deploy-erp`):** Triggers on `frontend-erp/**` changes. Runs `npm run build` (Static Export) and overwrites static assets in the cPanel ERP sub-directory (`public_html/erp/`).
*   **Job 3 (`deploy-backend`):** Triggers on `backend-laravel/**` changes. Runs Composer, zips, ships, and executes `php artisan migrate --force` via SSH.

---

# Output Instructions
1. Provide the code for Spatie RBAC and the frontend Admin migration strategy.
2. Provide the Database schema plan (Migrations and Eloquent Models) for Billing, Installations, and Warranty Tracking.
3. Provide the `frontend-erp` Dexie.js store setup, offline invoice logic, and the sync runner service.
4. Provide the Laravel batch controller logic utilizing the UUID for idempotency, and the `InventoryUpdated` broadcast setup.
5. Provide the updated `.github/workflows/deploy.yml` with path-filtering and independent deployment logic.