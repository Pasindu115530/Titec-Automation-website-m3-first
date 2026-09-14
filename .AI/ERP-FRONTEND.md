# ERP Frontend Architecture — `frontend-erp`

> **Framework**: Next.js 16 (App Router, Static Export) · **React**: 19 · **Styling**: Tailwind CSS v4 · **Language**: TypeScript 5 · **Offline**: Dexie.js (IndexedDB) · **Animations**: Framer Motion

---

## Tech Stack & Dependencies

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.23",
    "@radix-ui/react-dropdown-menu": "^2.1.24",
    "@radix-ui/react-select": "^2.3.7",
    "axios": "^1.20.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.4.0",
    "dexie": "^4.4.5",
    "framer-motion": "^13.1.1",
    "lucide-react": "^1.39.0",
    "next": "16.3.4",
    "next-themes": "^0.4.6",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-icons": "^5.7.0",
    "sonner": "^2.0.8",
    "tailwind-merge": "^3.6.0",
    "uuid": "^14.0.2"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/uuid": "^10.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.3.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### Key Differences from `frontend-next`

| Aspect | `frontend-next` | `frontend-erp` |
|--------|-----------------|----------------|
| Output | SSR (Node server) | Static Export (`output: 'export'`) |
| Purpose | Public website + old admin | ERP-only (internal) |
| SEO | Full SEO, OpenGraph | `noindex, nofollow` |
| Offline | None | Dexie.js (IndexedDB) for POS/Service Logs |
| Auth | Simple admin/customer | RBAC with Spatie roles & permissions |
| UI Primitives | shadcn/ui subset | shadcn/ui (new-york style) + Radix UI |
| Icons | lucide-react | lucide-react (same) |
| Animations | framer-motion | framer-motion (same) |
| Font | Geist Sans/Mono | Inter + Orbitron (display) + Michroma |
| Deployment | cPanel via `server.js` | cPanel `public_html/erp/` static files |

---

## Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',          // Static HTML export — no Node server needed
  images: {
    unoptimized: true,        // Required for static export
  },
  trailingSlash: true,        // Generates /page/index.html structure
};

export default nextConfig;
```

### Build & Run Scripts

```json
{
  "dev": "next dev -p 3001 --webpack",
  "build": "next build",
  "start": "npx serve out",
  "lint": "eslint"
}
```

- Dev runs on port `3001` (avoids clash with `frontend-next` on `3000`)
- Production build outputs to `out/` directory
- Served via `npx serve out` locally, deployed to `public_html/erp/` on cPanel

---

## File Structure

```
frontend-erp/
├── .env                              ← Environment variables
├── .gitignore
├── components.json                   ← shadcn/ui config (new-york style)
├── next.config.ts                    ← Static export config
├── package.json
├── postcss.config.mjs
├── tsconfig.json
│
├── public/                           ← Static assets
│
└── src/
    ├── app/
    │   ├── globals.css               ← Global styles (Tailwind v4 + custom)
    │   ├── layout.tsx                ← Root layout (Inter font, AuthProvider)
    │   ├── page.tsx                  ← Landing/redirect page
    │   ├── icon.svg / favicon.ico
    │   │
    │   ├── (admin)/                  ← Legacy admin route group (migrated from frontend-next)
    │   ├── (client)/                 ← Legacy client route group (minimal)
    │   │
    │   └── dashboard/                ← ★ PRIMARY ERP ROUTE GROUP
    │       ├── layout.tsx            ← Dashboard shell (sidebar + header + auth guard)
    │       ├── page.tsx              ← Dashboard home (/dashboard)
    │       ├── login/                ← /dashboard/login
    │       │
    │       ├── clients/              ← /dashboard/clients
    │       ├── pos/                  ← /dashboard/pos
    │       ├── invoices/             ← /dashboard/invoices + /dashboard/invoices/[id]
    │       ├── inventory/            ← /dashboard/inventory
    │       ├── installations/        ← /dashboard/installations + /dashboard/installations/[id]
    │       ├── service-logs/         ← /dashboard/service-logs
    │       ├── warranty/             ← /dashboard/warranty
    │       ├── reports/              ← /dashboard/reports
    │       │
    │       ├── products/             ← /dashboard/products  (CMS)
    │       ├── projects/             ← /dashboard/projects  (CMS)
    │       ├── brands/               ← /dashboard/brands    (CMS)
    │       ├── services/             ← /dashboard/services  (CMS)
    │       ├── quotations/           ← /dashboard/quotations
    │       ├── settings/             ← /dashboard/settings  (Super Admin)
    │       ├── notification/         ← /dashboard/notification
    │       └── order/                ← /dashboard/order
    │
    ├── components/
    │   ├── ui/                       ← Reusable UI primitives (shadcn/ui)
    │   │   ├── badge.tsx
    │   │   ├── button.tsx            ← Framer Motion button with variants
    │   │   ├── card.tsx
    │   │   ├── dialog.tsx            ← Radix UI Dialog wrapper
    │   │   ├── dropdown-menu.tsx     ← Radix UI Dropdown
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── select.tsx            ← Radix UI Select
    │   │   ├── sheet.tsx             ← Radix UI Sheet (slide-over)
    │   │   ├── sonner.tsx            ← Toast notifications
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   └── textarea.tsx
    │   │
    │   ├── admin/                    ← Migrated admin CMS components
    │   │   ├── products-table.tsx
    │   │   ├── add-product-modal.tsx
    │   │   ├── edit-product-modal.tsx
    │   │   ├── projects-table.tsx
    │   │   ├── add-project-modal.tsx
    │   │   ├── edit-project-modal.tsx
    │   │   ├── brands-table.tsx
    │   │   ├── add-brand-modal.tsx
    │   │   ├── services-table.tsx
    │   │   ├── add-service-modal.tsx
    │   │   ├── quotations-table.tsx
    │   │   ├── quotation-modal.tsx
    │   │   ├── quotation-details-modal.tsx
    │   │   ├── quotation-preview.tsx
    │   │   ├── product-autocomplete.tsx
    │   │   └── delete-confirmation-modal.tsx
    │   │
    │   ├── erp/                      ← ★ NEW ERP feature components
    │   │   ├── clients-table.tsx
    │   │   ├── add-client-modal.tsx
    │   │   ├── edit-client-modal.tsx
    │   │   ├── client-detail-drawer.tsx
    │   │   ├── client-picker.tsx
    │   │   ├── pos-product-search.tsx
    │   │   ├── pos-item-row.tsx
    │   │   ├── pos-summary.tsx
    │   │   ├── pos-confirm-modal.tsx
    │   │   ├── invoices-table.tsx
    │   │   ├── invoice-detail-modal.tsx
    │   │   ├── record-payment-modal.tsx
    │   │   ├── inventory-table.tsx
    │   │   ├── stock-adjust-modal.tsx
    │   │   ├── stock-receive-modal.tsx
    │   │   ├── stock-history-drawer.tsx
    │   │   ├── installation-kanban.tsx
    │   │   ├── add-installation-modal.tsx
    │   │   ├── installation-note-form.tsx
    │   │   ├── technician-assignment.tsx
    │   │   ├── report-chart.tsx
    │   │   └── users-table.tsx
    │   │
    │   ├── layout/
    │   │   └── connection-status.tsx  ← Online/Offline indicator + sync badge
    │   │
    │   ├── client/                   ← Public-facing components (migrated)
    │   ├── VersionManager.tsx
    │   ├── cart-drawer.tsx
    │   ├── contact-form.tsx
    │   ├── floating-action-buttons.tsx
    │   ├── footer.tsx
    │   ├── header.tsx
    │   ├── json-ld.tsx
    │   ├── loader.tsx
    │   ├── map-section.tsx
    │   └── section-header.tsx
    │
    ├── context/
    │   ├── AuthContext.tsx            ← RBAC-aware auth (roles[] + permissions[])
    │   └── CartContext.tsx            ← Quotation cart (client routes)
    │
    ├── services/
    │   ├── api.ts                    ← Fetch wrapper (SSR-compatible, fallbacks)
    │   ├── syncService.ts            ← Dexie.js ↔ API sync engine
    │   ├── productService.ts
    │   ├── brandService.ts
    │   ├── projectService.ts
    │   ├── serviceService.ts
    │   ├── quotationService.ts
    │   ├── dashboardService.ts
    │   ├── clientService.ts          ← ★ NEW
    │   ├── invoiceService.ts         ← ★ NEW
    │   ├── inventoryService.ts       ← ★ NEW
    │   ├── installationService.ts    ← ★ NEW
    │   ├── serviceLogService.ts      ← ★ NEW
    │   ├── reportService.ts          ← ★ NEW
    │   └── userService.ts            ← ★ NEW
    │
    ├── lib/
    │   ├── api.ts                    ← Axios instance (client-side, interceptors)
    │   ├── offline-db.ts             ← Dexie.js schema (PendingInvoice, PendingServiceLog)
    │   └── utils.ts                  ← cn() utility (clsx + tailwind-merge)
    │
    ├── types/
    │   ├── index.ts                  ← Shared types (Product, Brand, Project, etc.)
    │   ├── quotation.ts              ← QuotationItem, Quotation
    │   └── lucide-react.d.ts         ← Module declaration
    │
    ├── hooks/
    │   └── (use-local-storage.ts)    ← localStorage hook (SSR-safe)
    │
    ├── utils/
    │   └── (image-utils.ts, slug-utils.ts)
    │
    ├── assets/
    └── data/
```

---

## Design System & Styling

### Fonts

| Font | Usage | Import |
|------|-------|--------|
| **Inter** | Body text, UI labels, table content | `next/font/google` (root layout) |
| **Orbitron** | H1 headings, section titles, branding | Google Fonts URL in `globals.css` |
| **Michroma** | Accent text, badges | Google Fonts URL in `globals.css` |
| **Poppins** | Header nav, paragraphs, buttons | Referenced in `globals.css` |

### Color System — CSS Custom Properties

```css
:root {
  --primary-red: #C1272D;
  --primary-blue: #0C2340;
  --secondary-blue: #0964d7;
  --neutral-gray-light: #F5F5F5;
  --neutral-gray: #6B7280;
  --blue-hover: #1A3A5F;
  --cta-hover-red: #ff0008;
  --background: #FFFFFF;

  /* Tech / Status Colors */
  --status-live: #f97316;
  --status-online: #2563eb;
  --tech-accent-blue: #60a5fa;
  --tech-accent-red: #f87171;
  --indicator-red: #ef4444;
}
```

### Dark Theme Colors (Dashboard Shell)

The ERP sidebar uses a dark theme aesthetic:

| Element | Class / Color |
|---------|---------------|
| Sidebar BG | `bg-[#000619]` (deep navy-black) |
| Sidebar border | `border-white/10` |
| Active nav item | `bg-blue-900/40 text-blue-400 border-l-2 border-blue-500` |
| Inactive nav item | `text-gray-400 hover:bg-white/5 hover:text-white` |
| Icon glow (active) | `drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]` |
| Logo badge | `bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]` |
| Header | `bg-white/80 backdrop-blur-md border-b border-gray-200` |
| Page content | `bg-gray-50` |

### Reusable CSS Classes

#### Tailwind `@layer components`

| Class | Description |
|-------|-------------|
| `.btn-gradient-primary` | Blue-to-indigo gradient button with hover/shadow |
| `.text-glow-blue` | Blue text with glow drop-shadow |
| `.tech-card-hover` | Card with blue border glow on hover |
| `.text-gradient-tech` | Blue-to-indigo text gradient |
| `.btn-glass` | Glassmorphism button (white/10, blur, Orbitron font) |
| `.glass-panel` | Transparent panel with blur background |
| `.glass-effect` | White glassmorphism with thick blur |

#### Tailwind `@layer utilities`

| Class | Description |
|-------|-------------|
| `.font-orbitron` | `font-family: 'Orbitron'` |
| `.font-michroma` | `font-family: 'Michroma'` |
| `.animate-float` | 6s float up/down animation |
| `.animate-splash` | 4s scale+fade splash |
| `.animate-slide-in-left/right` | 1s slide entrance |
| `.delay-100/200/300/500` | Animation delays |
| `.bg-grid-white` | Subtle white grid pattern |
| `.bg-radial-dot` | Dot pattern background |
| `.perspective-1000`, `.transform-style-3d`, `.backface-hidden`, `.rotate-y-180` | 3D card flip utilities |

### Style Merging Pattern

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

All components use `cn()` for conditional class merging. This is the **only** approach for combining Tailwind classes.

---

## UI Components (`components/ui/`)

All primitives follow the **shadcn/ui** pattern (`new-york` style). They use Radix UI primitives underneath and are styled with Tailwind + `cn()`.

### Button (`button.tsx`)

- Wraps `motion.button` from Framer Motion (not standard `<button>`)
- Built-in `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}`
- Variants: `default`, `outline`, `ghost`, `destructive`, `secondary`
- Sizes: `default`, `sm`, `lg`, `icon`

```tsx
<Button variant="ghost" size="icon">
  <Menu className="h-6 w-6" />
</Button>

<Button className="btn-gradient-primary border-0">
  View Quotations
</Button>
```

### Card (`card.tsx`)

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- Standard container pattern with header/content/footer slots

```tsx
<Card className="tech-card-hover border-gray-100/50 shadow-sm">
  <CardContent className="p-6">
    ...
  </CardContent>
</Card>
```

### Dialog (`dialog.tsx`)

- Radix UI `@radix-ui/react-dialog` with overlay + content wrappers
- Used for all modals (add/edit/confirm/delete)

### Select (`select.tsx`)

- Radix UI `@radix-ui/react-select`
- Full select with trigger, content, items, groups, separators

### Sheet (`sheet.tsx`)

- Radix UI-based slide-over panel
- Used for: `client-detail-drawer.tsx`, `stock-history-drawer.tsx`

### Table (`table.tsx`)

- Semantic HTML table with styled header/body/row/cell
- All tables share consistent: `bg-gray-50/50` header, `divide-y divide-gray-100` rows

### Other Primitives

| Component | Description |
|-----------|-------------|
| `badge.tsx` | Status badges with color variants |
| `input.tsx` | Styled text input |
| `textarea.tsx` | Styled multi-line input |
| `label.tsx` | Form label |
| `tabs.tsx` | Tab navigation |
| `sonner.tsx` | Toast notification wrapper (Sonner) |
| `dropdown-menu.tsx` | Radix UI dropdown menu |

---

## Dashboard Layout (`dashboard/layout.tsx`)

The dashboard layout is a **client component** (`'use client'`) that provides:

### Structure

```
┌──────────────────────────────────────────────────┐
│ ┌─────────┐ ┌──────────────────────────────────┐ │
│ │         │ │ Header (blur, user info, sync)    │ │
│ │ Sidebar │ ├──────────────────────────────────┤ │
│ │ (dark)  │ │                                  │ │
│ │         │ │   Page Content (children)        │ │
│ │ 16rem   │ │   max-w-7xl mx-auto              │ │
│ │         │ │                                  │ │
│ └─────────┘ └──────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Sidebar

- **Background**: `bg-[#000619]` with `border-r border-white/10`
- **Logo**: Blue badge + "Titec Admin" in Orbitron font
- **Navigation**: Permission-filtered `allMenuItems` array
- **Animation**: Framer Motion `animate={{ width, x }}` for open/close
- **Mobile**: Overlay backdrop + hamburger toggle

### Auth Guard

```typescript
useEffect(() => {
  if (!isLoading && !isAdmin && pathname !== '/dashboard/login') {
    router.push('/dashboard/login');
  }
}, [isAdmin, isLoading, pathname, router]);
```

### RBAC-Filtered Navigation

Menu items have `requiredPermissions` and/or `requiredRoles`:

```typescript
const allMenuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Clients', icon: Users, href: '/dashboard/clients',
    requiredPermissions: ['view_clients'] },
  { name: 'POS / Billing', icon: Package, href: '/dashboard/pos',
    requiredPermissions: ['view_pos'] },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings',
    requiredRoles: ['Super Admin'] },
  // ...
];
```

Super Admins see all items. Others see only items matching their roles/permissions.

### Header

- `bg-white/80 backdrop-blur-md border-b border-gray-200`
- Shows: `<ConnectionStatus />`, user name, user avatar (gradient initials)

### Sidebar Navigation Items (Full List)

```
📊  Dashboard
📝  Quotation Requests
────────────────────
💼  Clients
🏷️  POS / Billing
📦  Inventory
📄  Invoices
────────────────────
🔧  Installations
📋  Service Logs
🛡️  Warranty Check
────────────────────
📊  Reports
────────────────────
📁  Products Management
🏗️  Projects Management
🏷️  Brands Management
🔩  Services Management
⚙️  Settings
```

---

## State Management

### AuthContext (`context/AuthContext.tsx`)

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current authenticated user |
| `isLoading` | `boolean` | Initial load state |
| `login()` | `(email, password, role) => Promise<void>` | Authenticates via `/api/login` |
| `logout()` | `() => void` | Clears state + localStorage |
| `isAdmin` | `boolean` | `user.role === 'admin'` |
| `isCustomer` | `boolean` | `user.role === 'customer'` |
| `setUserExternal()` | `(payload) => void` | External auth state update |

#### User Type (RBAC-Enhanced)

```typescript
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  token: string;
  roles?: string[];        // Spatie roles: ['Super Admin', 'Sales', ...]
  permissions?: string[];  // Spatie permissions: ['view_pos', 'create_invoices', ...]
};
```

#### Login Flow

1. `POST /api/login` with `{ email, password }`
2. Response: `{ user: { id, name, email, roles, permissions }, access_token }`
3. Map Spatie roles to local `role` ('admin' if Super Admin)
4. Store in `localStorage('user')`
5. Redirect to `/dashboard`

### CartContext (`context/CartContext.tsx`)

- Client layout only (quotation cart for public store)
- Persistence: `localStorage('quotationCart')`
- Not relevant to dashboard/ERP routes

---

## API Communication — Dual Layer

### 1. `lib/api.ts` — Axios Instance (Client-Side)

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.titecautomation.lk',
  withCredentials: true,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 30000,
});
```

**Request interceptor**: Reads bearer token from `localStorage('user').token` or `localStorage('token')` and attaches `Authorization: Bearer <token>`.

**Response interceptor**: On `401` → clears storage + redirects to `/dashboard/login`. On `403` → logs forbidden error. On `419` → logs CSRF mismatch.

### 2. `services/api.ts` — Fetch Wrapper (SSR-Compatible)

```typescript
export async function fetchFromApi<T>(
  endpoint: string,
  options?: RequestInit,
  fallbackValue?: T
): Promise<T>
```

- Uses native `fetch()` with `credentials: 'include'`
- Returns `fallbackValue` or `[]` if API is unreachable (build-time safety)
- Base URL: `NEXT_PUBLIC_BACKEND_URL` or `https://127.0.0.1:8000`

### Service Modules (`services/`)

#### Migrated from `frontend-next`

| Service | Key Methods |
|---------|-------------|
| `productService.ts` | `getProducts(search?, admin?)`, `getProductById(id)` |
| `brandService.ts` | `getBrands()` |
| `projectService.ts` | `getProjects()`, `getProjectById(id)` |
| `serviceService.ts` | `getServices()` |
| `quotationService.ts` | `getQuotations()`, `getQuotationRequests()`, `createQuotationRequest()`, `replyToRequest()`, `sendDirectQuote()`, `downloadQuotationPDF()` |
| `dashboardService.ts` | `getStats()` |

#### New ERP Services

| Service | Key Methods |
|---------|-------------|
| `clientService.ts` | `getClients()`, `getClient(id)`, `createClient()`, `updateClient(id)`, `deleteClient(id)`, `getClientHistory(id)` |
| `invoiceService.ts` | `getInvoices(filters)`, `getInvoice(id)`, `createInvoice()`, `confirmInvoice(id)`, `voidInvoice(id)`, `recordPayment(id)`, `batchCreate()`, `downloadPDF(id)` |
| `inventoryService.ts` | `getInventory(filters)`, `adjustStock(id, qty, reason)`, `receiveStock(items)`, `getStockHistory(id)`, `getLowStockAlerts()` |
| `installationService.ts` | `getInstallations(filters)`, `getInstallation(id)`, `createInstallation()`, `updateStatus(id, status)`, `assignTechnicians(id, techIds)`, `addNote(id, note)`, `getMyInstallations()` |
| `serviceLogService.ts` | `getServiceLogs(filters)`, `createServiceLog()`, `batchCreate()`, `checkWarranty(invoiceItemId)` |
| `reportService.ts` | `getSalesReport(dateRange)`, `getInventoryReport()`, `getWarrantyReport(period)`, `getTopProducts(dateRange)`, `getClientRevenue(dateRange)` |
| `userService.ts` | `getUsers()`, `createUser()`, `updateUser(id)`, `deleteUser(id)`, `getRoles()` |
| `syncService.ts` | `init()`, `syncAll()`, `syncInvoices()`, `syncServiceLogs()`, `getPendingCount()` |

---

## Offline-First Architecture (Dexie.js)

### IndexedDB Schema (`lib/offline-db.ts`)

```typescript
import Dexie, { type Table } from 'dexie';

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
```

### Offline Types

#### `PendingInvoice`

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | `string` | Primary key (UUID v4, idempotency key) |
| `client_id` | `number` | |
| `client_name` | `string` | Denormalized for offline display |
| `items` | `PendingInvoiceItem[]` | Line items |
| `tax_rate` | `number` | |
| `discount_amount` | `number` | |
| `discount_type` | `'fixed' \| 'percentage'` | |
| `subtotal` | `number` | |
| `tax_amount` | `number` | |
| `grand_total` | `number` | |
| `payment_method?` | `string` | Cash, Card, Bank Transfer, Cheque, Credit |
| `notes?` | `string` | |
| `terms?` | `string` | |
| `due_date?` | `string` | |
| `status` | `'pending' \| 'syncing' \| 'synced' \| 'error'` | Sync lifecycle |
| `error_message?` | `string` | |
| `created_at` | `number` | timestamp (Date.now()) |
| `updated_at` | `number` | timestamp |

#### `PendingInvoiceItem`

| Field | Type |
|-------|------|
| `product_id` | `number` |
| `product_name` | `string` |
| `product_model?` | `string` |
| `unit_price` | `number` |
| `quantity` | `number` |
| `unit` | `string` |
| `serial_number?` | `string` |
| `warranty_months` | `number` |
| `line_total` | `number` |

#### `PendingServiceLog`

| Field | Type |
|-------|------|
| `uuid` | `string` (PK) |
| `client_id` | `number` |
| `client_name` | `string` |
| `invoice_item_id?` | `number` |
| `product_id?` | `number` |
| `product_name?` | `string` |
| `technician_id` | `number` |
| `title` | `string` |
| `description` | `string` |
| `diagnosis?` | `string` |
| `resolution?` | `string` |
| `service_type` | `string` |
| `service_date` | `string` |
| `next_service_date?` | `string` |
| `service_charge` | `number` |
| `status` | `'pending' \| 'syncing' \| 'synced' \| 'error'` |
| `error_message?` | `string` |
| `created_at` | `number` |
| `updated_at` | `number` |

### Sync Service (`services/syncService.ts`)

- **Init**: Listens for `window.addEventListener('online', ...)`, syncs on startup if online
- **Sync flow**: `pending` → mark as `syncing` → batch POST → `synced` or `error` → revert to `pending` on network failure
- **Deduplication**: Backend uses UUID-based `upsert`/`firstOrCreate` — safe for retries
- **Cleanup**: Synced records auto-deleted after 24h
- **Batch endpoints**: `POST /api/invoices/batch`, `POST /api/service-logs/batch`

### Connection Status Component (`components/layout/connection-status.tsx`)

- Shows `🟢 Online` / `🟡 Offline` badge
- Displays pending sync count with manual sync button
- Polls pending count every 5 seconds
- Initialized in the dashboard header

---

## TypeScript Types (`types/`)

### `types/index.ts` — Shared Types

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  brand?: string;
  brand_id?: number;
  brand_details?: Brand;
  image?: string;
  images?: string[];
  datasheet_path?: string;
  stock?: number;
  sku?: string;
  unit?: string;
  model_number?: string;
  on_store?: boolean;
  show_price?: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_path?: string;
  created_at?: string;
  updated_at?: string;
}

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

export interface ServiceItem {
  id: number;
  service_category_id: number;
  title: string;
  description: string;
  sort_order: number;
}
```

### New ERP Types (to be added to `types/`)

```typescript
// types/erp.ts

export interface Client {
  id: number;
  type: 'individual' | 'business';
  name: string;
  company_name?: string;
  email?: string;
  phone: string;
  phone_secondary?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  tin?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  uuid: string;
  client_id: number;
  client?: Client;
  status: 'draft' | 'confirmed' | 'paid' | 'void';
  subtotal: number;
  discount_amount: number;
  discount_type: 'fixed' | 'percentage';
  tax_rate: number;
  tax_amount: number;
  grand_total: number;
  amount_paid: number;
  payment_method?: string;
  notes?: string;
  terms?: string;
  due_date?: string;
  confirmed_at?: string;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number;
  product?: Product;
  product_name: string;
  product_model?: string;
  unit_price: number;
  quantity: number;
  unit: string;
  serial_number?: string;
  warranty_months: number;
  warranty_start_date?: string;
  warranty_end_date?: string;
  line_total: number;
}

export interface Installation {
  id: number;
  invoice_id?: number;
  invoice?: Invoice;
  client_id: number;
  client?: Client;
  title: string;
  description?: string;
  location?: string;
  status: 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_date?: string;
  completed_date?: string;
  technicians: User[];
  notes: InstallationNote[];
  created_at: string;
  updated_at: string;
}

export interface InstallationNote {
  id: number;
  installation_id: number;
  user_id: number;
  user?: User;
  content: string;
  photo_path?: string;
  created_at: string;
}

export interface ServiceLog {
  id: number;
  uuid: string;
  client_id: number;
  client?: Client;
  invoice_item_id?: number;
  invoice_item?: InvoiceItem;
  product_id?: number;
  product?: Product;
  technician_id: number;
  technician?: User;
  title: string;
  description: string;
  diagnosis?: string;
  resolution?: string;
  service_type: 'maintenance' | 'repair' | 'inspection' | 'installation' | 'warranty' | 'other';
  service_date: string;
  next_service_date?: string;
  service_charge: number;
  is_under_warranty: boolean;
  status: 'scheduled' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference_type?: string;
  reference_id?: number;
  user_id: number;
  user?: User;
  created_at: string;
}

export interface SalesReport {
  total_sales: number;
  invoice_count: number;
  avg_invoice: number;
  payments_received: number;
  outstanding: number;
  daily_sales: { date: string; amount: number }[];
  top_products: { product: Product; units: number; revenue: number }[];
}

export interface WarrantyInfo {
  invoice_item: InvoiceItem;
  client: Client;
  invoice: Invoice;
  status: 'active' | 'expiring_soon' | 'expired';
  remaining_days: number;
  service_logs: ServiceLog[];
}
```

---

## ERP Component Details

### Clients Module

| Component | File | Features |
|-----------|------|----------|
| `clients-table.tsx` | `components/erp/` | Searchable, paginated. Filters: type, city, district. Columns: Name/Company, Phone, Email, Type, City, Last Invoice, Actions |
| `add-client-modal.tsx` | `components/erp/` | Create form: name, company, type, phone, email, address, TIN |
| `edit-client-modal.tsx` | `components/erp/` | Edit form (same fields as add) |
| `client-detail-drawer.tsx` | `components/erp/` | Sheet slide-over: full client info, tabs for Invoices/Installations/Service History, total revenue, active warranties |
| `client-picker.tsx` | `components/erp/` | Autocomplete search/select used in POS and Service Log forms |

### POS / Billing Module

| Component | File | Features |
|-----------|------|----------|
| `pos/page.tsx` | `app/dashboard/` | 2-column layout: product search (left) + invoice builder (right) |
| `pos-product-search.tsx` | `components/erp/` | Instant search autocomplete, shows stock levels, "Add" button |
| `pos-item-row.tsx` | `components/erp/` | Editable line item: qty, serial number, warranty override, remove |
| `pos-summary.tsx` | `components/erp/` | Subtotal, discount, tax, grand total calculations |
| `pos-confirm-modal.tsx` | `components/erp/` | Final confirmation with payment method selection |
| `client-picker.tsx` | `components/erp/` | Client selection with inline create capability |

**POS Offline Flow**:
1. User builds invoice → clicks "Save Draft"
2. If offline: generates UUID v4 → saves to IndexedDB (`offlineDb.pendingInvoices.add(...)`)
3. When online: `syncService.syncAll()` → `POST /api/invoices/batch` with UUID → deduplicated on server
4. Status: `pending` → `syncing` → `synced` / `error`

### Invoice Module

| Component | File | Features |
|-----------|------|----------|
| `invoices/page.tsx` | `app/dashboard/` | List with filters (status, date range, client), stats row |
| `invoices/[id]/page.tsx` | `app/dashboard/` | Full detail view: items, totals, payment status |
| `invoices-table.tsx` | `components/erp/` | Columns: #, Date, Client, Amount, Status, Payment, Actions |
| `invoice-detail-modal.tsx` | `components/erp/` | Modal detail view with item table |
| `record-payment-modal.tsx` | `components/erp/` | Record payment amount + method |

### Inventory Module

| Component | File | Features |
|-----------|------|----------|
| `inventory/page.tsx` | `app/dashboard/` | Dashboard: Total/Low/Out stats, product list |
| `inventory-table.tsx` | `components/erp/` | Color-coded stock status (🟢 In / 🟡 Low / 🔴 Out) |
| `stock-adjust-modal.tsx` | `components/erp/` | Manual +/- with reason field |
| `stock-receive-modal.tsx` | `components/erp/` | Bulk stock receiving form |
| `stock-history-drawer.tsx` | `components/erp/` | Slide-over: stock movement log (in/out/adjustment) |

### Installation Module

| Component | File | Features |
|-----------|------|----------|
| `installations/page.tsx` | `app/dashboard/` | Kanban board (primary) + list view toggle |
| `installations/[id]/page.tsx` | `app/dashboard/` | Detail: linked invoice/client, technicians, status, timeline |
| `installation-kanban.tsx` | `components/erp/` | 4-column board: Scheduled → In Progress → On Hold → Completed |
| `add-installation-modal.tsx` | `components/erp/` | Create: title, client, invoice, priority, date, technicians |
| `installation-note-form.tsx` | `components/erp/` | Add note with optional photo upload |
| `technician-assignment.tsx` | `components/erp/` | Multi-select technician picker |

### Service Logs & Warranty Module

| Component | File | Features |
|-----------|------|----------|
| `service-logs/page.tsx` | `app/dashboard/` | List + create form. Filters: client, technician, type, date, warranty |
| `warranty/page.tsx` | `app/dashboard/` | Warranty checker: search by serial/client/product. Expiring soon + recently expired alerts |

**Warranty Auto-Detection**: When selecting equipment in service log form → checks `warranty_end_date` from invoice item → shows status (ACTIVE / EXPIRED) → auto-sets charge to Rs. 0 if under warranty.

### Reports Module

| Component | File | Features |
|-----------|------|----------|
| `reports/page.tsx` | `app/dashboard/` | Tabs: Sales, Inventory, Warranty |
| `report-chart.tsx` | `components/erp/` | CSS-based bar chart (no chart library for MVP) |

Report types:
1. **Sales Summary**: Date range, daily totals, top products, total/outstanding
2. **Stock Valuation**: Total SKUs, stock value, low/out counts
3. **Warranty Expiry**: Period filter, expiring items, expired items

### User Management (Settings)

| Component | File | Features |
|-----------|------|----------|
| `settings/page.tsx` | `app/dashboard/` | Super Admin only |
| `users-table.tsx` | `components/erp/` | User list + CRUD + role assignment |

---

## RBAC — Roles & Permissions

### Roles (Spatie)

| Role | Access |
|------|--------|
| **Super Admin** | Everything |
| **Content Editor** | Products, Projects, Brands, Services |
| **Sales** | POS, Clients, Invoices, Quotations |
| **Technician** | Installations (own), Service Logs |
| **Accountant** | Reports, Invoices (read-only) |
| **Store Keeper** | Inventory only |

### Permission Keys

```
view_clients, create_clients, edit_clients, delete_clients
view_pos, create_invoices
view_invoices, edit_invoices, void_invoices, record_payments
view_inventory, adjust_stock, receive_stock
view_installations, create_installations, edit_installations
view_service_logs, create_service_logs
view_warranty
view_reports
view_products, create_products, edit_products, delete_products
view_projects, create_projects, edit_projects, delete_projects
view_brands, create_brands, edit_brands, delete_brands
view_services, create_services, edit_services, delete_services
view_quotation_requests, reply_quotation_requests
users.view, users.create, users.edit, users.delete
reports.sales, reports.inventory, reports.warranty
```

### Frontend Permission Guard Pattern

```typescript
// In dashboard/layout.tsx
const menuItems = allMenuItems.filter(item => {
  if (user?.roles?.includes('Super Admin')) return true;

  if (item.requiredRoles?.length > 0) {
    if (!item.requiredRoles.some(r => user?.roles?.includes(r))) return false;
  }

  if (item.requiredPermissions?.length > 0) {
    if (!item.requiredPermissions.some(p => user?.permissions?.includes(p))) return false;
  }

  return true;
});
```

---

## Responsive Design Rules

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Sidebar | Always visible (collapsible) | Hidden, hamburger toggle |
| POS | 2-column layout | Stacked (search on top, cart below) |
| Tables | Full columns | Horizontal scroll or card view |
| Modals | Centered dialog | Full-screen bottom sheet |
| Kanban | 4-column horizontal | Vertical stacked cards with status filter |

### Mobile Sidebar

```tsx
{/* Mobile Overlay */}
<AnimatePresence>
  {isSidebarOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsSidebarOpen(false)}
      className="fixed inset-0 bg-black/50 z-20 lg:hidden"
    />
  )}
</AnimatePresence>
```

---

## Animation Patterns

| Pattern | Implementation |
|---------|---------------|
| Page entrance | `motion.div` with `initial={{ opacity: 0, y: 20 }}` + staggered `delay` |
| Button hover | `whileHover={{ scale: 1.02 }}` / `whileTap={{ scale: 0.98 }}` (built into Button) |
| Sidebar toggle | Framer Motion `animate={{ width, x }}` |
| Card hover | `.tech-card-hover` class (CSS box-shadow + border transition) |
| Status badges | Pulse animation on "pending" status |
| Sync indicator | `animate-spin` on RefreshCw icon during sync |
| Toast | Sonner with auto-dismiss |
| Skeleton loading | Shimmer animation while data loads |

### Stats Card Stagger Pattern

```tsx
{stats.map((stat, index) => (
  <motion.div
    key={stat.label}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="tech-card-hover border-gray-100/50 shadow-sm">
      ...
    </Card>
  </motion.div>
))}
```

---

## Status Badge Color System

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    // Invoice / Quotation statuses
    case 'Quoted':    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Reviewed':  return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Pending':   return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Rejected':  return 'bg-red-100 text-red-700 border-red-200';

    // Invoice payment statuses
    case 'paid':      return 'bg-emerald-100 text-emerald-700';
    case 'confirmed': return 'bg-blue-100 text-blue-700';
    case 'draft':     return 'bg-gray-100 text-gray-700';
    case 'void':      return 'bg-red-100 text-red-700';

    // Installation statuses
    case 'scheduled':   return 'bg-blue-100 text-blue-700';
    case 'in_progress': return 'bg-amber-100 text-amber-700';
    case 'on_hold':     return 'bg-orange-100 text-orange-700';
    case 'completed':   return 'bg-emerald-100 text-emerald-700';
    case 'cancelled':   return 'bg-red-100 text-red-700';

    // Stock levels
    case 'in_stock':  return 'text-green-500';   // 🟢
    case 'low_stock': return 'text-amber-500';   // 🟡
    case 'out_stock': return 'text-red-500';     // 🔴

    // Warranty
    case 'active':        return 'bg-emerald-100 text-emerald-700';
    case 'expiring_soon': return 'bg-amber-100 text-amber-700';
    case 'expired':       return 'bg-red-100 text-red-700';

    default: return 'bg-gray-100 text-gray-700';
  }
};
```

---

## Environment Variables

```env
# .env
NEXT_PUBLIC_BACKEND_URL=https://api.titecautomation.lk
NEXT_PUBLIC_APP_NAME=Titec ERP
NEXT_PUBLIC_APP_VERSION=0.1.0
```

---

## Important Conventions

1. **`'use client'`** directive on all interactive components (forms, context consumers, motion)
2. **Static export** — no server components can use `cookies()`, `headers()`, or dynamic server functions
3. **Auth guard** in `dashboard/layout.tsx` — redirects to `/dashboard/login` if `!isAdmin`
4. **RBAC filtering** — navigation items filtered by `user.permissions[]` and `user.roles[]`
5. **Offline-first** — POS and Service Logs save to IndexedDB when offline, sync when online
6. **UUID idempotency** — all offline records use UUID v4 as primary key for safe retries
7. **No global `layout.tsx`** at route group level — root `layout.tsx` wraps everything with `AuthProvider`
8. **Images**: `unoptimized: true` for static export compatibility
9. **Port**: Dev server runs on `3001` (frontend-next uses `3000`)
10. **shadcn/ui style**: `new-york` with `zinc` base color
11. **All Tailwind classes merged via `cn()`** — never raw string concatenation
12. **Framer Motion** for all animations — no raw CSS animation where interaction is needed
13. **Sonner** for toast notifications — imported via `components/ui/sonner.tsx`
14. **Date formatting** via `date-fns` — not `moment.js`

---

## API Endpoints Reference (Backend)

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Returns `{ user, access_token }` |

### CMS (Migrated)
| Method | Endpoint | Permission |
|--------|----------|-----------|
| GET/POST | `/api/products` | `view_products` / `create_products` |
| GET/POST | `/api/projects` | `view_projects` / `create_projects` |
| GET/POST | `/api/brands` | `view_brands` / `create_brands` |
| GET/POST | `/api/services` | `view_services` / `create_services` |
| GET/POST | `/api/quotation-requests` | `view_quotation_requests` |

### ERP
| Method | Endpoint | Permission |
|--------|----------|-----------|
| GET/POST | `/api/clients` | `view_clients` / `create_clients` |
| GET/POST | `/api/invoices` | `view_invoices` / `create_invoices` |
| POST | `/api/invoices/batch` | `create_invoices` (offline sync) |
| PUT | `/api/invoices/{id}/confirm` | `edit_invoices` |
| PUT | `/api/invoices/{id}/void` | `void_invoices` |
| POST | `/api/invoices/{id}/payment` | `record_payments` |
| GET | `/api/inventory` | `view_inventory` |
| POST | `/api/inventory/{id}/adjust` | `adjust_stock` |
| POST | `/api/inventory/receive` | `receive_stock` |
| GET/POST | `/api/installations` | `view_installations` / `create_installations` |
| PUT | `/api/installations/{id}/status` | `edit_installations` |
| POST | `/api/installations/{id}/notes` | `edit_installations` |
| GET/POST | `/api/service-logs` | `view_service_logs` / `create_service_logs` |
| POST | `/api/service-logs/batch` | `create_service_logs` (offline sync) |
| GET | `/api/warranty/check` | `view_warranty` |
| GET | `/api/reports/sales` | `reports.sales` |
| GET | `/api/reports/inventory` | `reports.inventory` |
| GET | `/api/reports/warranty` | `reports.warranty` |
| GET/POST | `/api/users` | `users.view` / `users.create` |
| GET | `/api/roles` | `users.view` |

---

## Deployment

### Build

```bash
cd frontend-erp
npm run build    # outputs to out/
```

### Deploy (cPanel)

The CI/CD pipeline (`deploy-erp` job) uploads the `out/` directory contents to `public_html/erp/` via SSH/SCP.

### Path Filtering (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
on:
  push:
    paths:
      - 'frontend-erp/**'

jobs:
  deploy-erp:
    runs-on: ubuntu-latest
    steps:
      - run: cd frontend-erp && npm ci && npm run build
      # ... upload out/ to cPanel
```

---

*Main website frontend docs: [FRONTEND.md](./FRONTEND.md)*
*Backend docs: [BACKEND.md](./BACKEND.md)*
*ERP Phase 2B features: [Phase-2B-Frontend-Features.md](./ERP/Phase-2B-Frontend-Features.md)*
*ERP Prompt: [ERP-Prompt.md](./ERP/ERP-Prompt.md)*
