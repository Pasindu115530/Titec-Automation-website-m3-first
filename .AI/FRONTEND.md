# Frontend Architecture — `frontend-next`

> **Framework**: Next.js 16 (App Router) · **React**: 19 · **Styling**: Tailwind CSS v4 · **Language**: TypeScript 5

---

## App Router Structure

The app uses **Route Groups** to separate admin and client concerns with **independent root layouts** (each has its own `<html>` and `<body>`):

```
src/app/
├── globals.css              ← Shared Tailwind CSS styles
├── icon.svg                 ← Favicon
├── robots.ts                ← Robots.txt generator
├── sitemap.ts               ← Sitemap.xml generator
│
├── (admin)/                 ← ADMIN route group
│   ├── layout.tsx           ← Root layout (Geist font, AuthProvider, Toaster)
│   │                          robots: noindex, nofollow
│   ├── not-found.tsx
│   └── admin/
│       ├── layout.tsx       ← Admin sidebar + top header (client component)
│       ├── page.tsx         ← Dashboard page (/admin)
│       ├── login/           ← /admin/login
│       ├── products/        ← /admin/products
│       ├── projects/        ← /admin/projects
│       ├── brands/          ← /admin/brands
│       ├── services/        ← /admin/services
│       ├── quotations/      ← /admin/quotations
│       ├── settings/        ← /admin/settings
│       ├── notification/    ← /admin/notification
│       └── order/           ← /admin/order
│
└── (client)/                ← PUBLIC route group
    ├── layout.tsx           ← Root layout (Header, Footer, CartProvider,
    │                          AuthProvider, JsonLd, SEO metadata)
    ├── page.tsx             ← Homepage (/)
    ├── not-found.tsx
    ├── about/               ← /about
    ├── store/               ← /store + /store/[slug]
    ├── projects/            ← /projects + /projects/[id]
    ├── services/            ← /services
    ├── contact/             ← /contact
    ├── clients/             ← /clients
    ├── faq/                 ← /faq
    └── customer-dashboard/  ← /customer-dashboard
```

### Key Layout Differences

| Feature              | `(admin)` Layout          | `(client)` Layout          |
|----------------------|---------------------------|----------------------------|
| SEO                  | `noindex, nofollow`       | Full SEO + OpenGraph/Twitter|
| Providers            | `AuthProvider`            | `AuthProvider` + `CartProvider`|
| Navigation           | Admin sidebar             | Header + Footer            |
| Extra Features       | `Toaster`, `VersionManager`| `JsonLd`, `FloatingActionButtons`, `CartDrawer`, `Toaster`, `VersionManager` |

---

## Component Organization

### `components/admin/` — Admin Panel Components

| File                          | Purpose                                      |
|-------------------------------|----------------------------------------------|
| `products-table.tsx`          | Product listing table with actions            |
| `add-product-modal.tsx`       | Create product form modal                     |
| `edit-product-modal.tsx`      | Edit product form modal                       |
| `projects-table.tsx`          | Project listing table                         |
| `add-project-modal.tsx`       | Create project modal                          |
| `edit-project-modal.tsx`      | Edit project modal                            |
| `brands-table.tsx`            | Brand listing + inline CRUD                   |
| `add-brand-modal.tsx`         | Create brand modal                            |
| `services-table.tsx`          | Services listing table                        |
| `add-service-modal.tsx`       | Create service modal                          |
| `quotations-table.tsx`        | Quotation requests listing                    |
| `quotation-modal.tsx`         | Full quotation reply modal (create/upload PDF)|
| `quotation-details-modal.tsx` | View quotation request details                |
| `quotation-preview.tsx`       | Preview quotation before sending              |
| `product-autocomplete.tsx`    | Product search autocomplete for quotations    |
| `delete-confirmation-modal.tsx`| Reusable delete confirmation dialog           |

### `components/client/` — Public-Facing Components

| File                      | Purpose                               |
|---------------------------|---------------------------------------|
| `home-client.tsx`         | Homepage sections (hero, features)    |
| `store-client.tsx`        | Store page with filters and grid      |
| `product-card.tsx`        | Individual product card               |
| `product-detail-page.tsx` | Product detail view                   |
| `similar-products.tsx`    | Related products section              |
| `projects-client.tsx`     | Projects gallery                      |
| `about-hero.tsx`          | About page hero section               |
| `brand-marquee.tsx`       | Brand logos marquee                   |
| `client-marquee.tsx`      | Client logos marquee                  |
| `faq-accordion.tsx`       | FAQ accordion component               |

### `components/ui/` — Reusable Primitives

| File            | Purpose                                 |
|-----------------|------------------------------------------|
| `button.tsx`    | Button with variants (ghost, outline, etc)|
| `card.tsx`      | Card container with header/content/footer|
| `input.tsx`     | Styled text input                        |
| `textarea.tsx`  | Styled textarea                          |
| `label.tsx`     | Form label                               |
| `badge.tsx`     | Status badges                            |
| `tabs.tsx`      | Tab navigation component                 |
| `sonner.tsx`    | Sonner toast wrapper                     |

### Shared Components (root of `components/`)

| File                        | Purpose                            |
|-----------------------------|------------------------------------|
| `header.tsx`                | Main site header/navigation        |
| `footer.tsx`                | Site footer                        |
| `contact-form.tsx`          | Contact page form                  |
| `cart-drawer.tsx`           | Sliding cart drawer for quotations |
| `floating-action-buttons.tsx`| WhatsApp/call FABs               |
| `loader.tsx`                | Loading spinner                    |
| `section-header.tsx`        | Reusable section title component   |
| `map-section.tsx`           | Google Maps embed                  |
| `json-ld.tsx`               | Structured data for SEO            |
| `VersionManager.tsx`        | Cache-busting version manager      |

---

## State Management

### AuthContext (`context/AuthContext.tsx`)

- **Provider**: Wraps both admin and client layouts
- **State**: `user: User | null`, `isLoading: boolean`
- **Persistence**: `localStorage.getItem('user')`
- **Actions**: `login()`, `logout()`, `setUserExternal()`
- **Derived**: `isAdmin`, `isCustomer`
- **User type**: `{ id, email, firstName, lastName, role: 'admin'|'customer', token }`

### CartContext (`context/CartContext.tsx`)

- **Provider**: Client layout only
- **State**: `items: CartItem[]`, `isOpen: boolean`
- **Persistence**: `localStorage.getItem('quotationCart')`
- **Actions**: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`, `submitQuotationRequest()`
- **Key**: Cart is a **quotation cart**, not a purchase cart. Items are sent as quotation requests.

---

## API Communication — Dual Layer

The frontend has **two API utilities**:

### 1. `lib/api.ts` — Axios Instance (Client-Side)
- Used by **services/** for client-side (browser) API calls
- Configures Axios with `withCredentials: true`
- **Request interceptor**: Attaches `Authorization: Bearer <token>` from localStorage
- **Response interceptor**: On 401 → clears storage + redirects to `/admin/login`
- Base URL: `NEXT_PUBLIC_BACKEND_URL` or `https://api.titecautomation.lk`

### 2. `services/api.ts` — Fetch Wrapper (SSR-Compatible)
- Used for **server-side rendering** (no localStorage access)
- Uses native `fetch()` with `credentials: 'include'`
- Has **fallback values** for build-time failures (returns `[]` if API unreachable)
- Base URL: `NEXT_PUBLIC_BACKEND_URL` or `https://127.0.0.1:8000`

### Service Modules (`services/`)

| Service                 | Methods                                                        |
|-------------------------|----------------------------------------------------------------|
| `productService.ts`     | `getProducts(search?, admin?)`, `getProductById(id)`           |
| `brandService.ts`       | `getBrands()`, etc.                                            |
| `projectService.ts`     | `getProjects()`, `getProjectById(id)`, etc.                    |
| `serviceService.ts`     | `getServices()`, etc.                                          |
| `quotationService.ts`   | `getQuotations()`, `getQuotationRequests()`, `createQuotationRequest()`, `replyToRequest()`, `sendDirectQuote()`, `downloadQuotationPDF()` |
| `dashboardService.ts`   | `getDashboardStats()`                                          |

---

## TypeScript Types (`types/`)

### `types/index.ts`
- `Project`, `Brand`, `Product`, `ServiceCategory`, `ServiceItem`

### `types/quotation.ts`
- `QuotationItem`, `Quotation`

### `types/lucide-react.d.ts`
- Module declaration for lucide-react

---

## Utilities

### `lib/utils.ts` — `cn()` function
```typescript
cn(...inputs: ClassValue[]) → string  // clsx + twMerge
```

### `utils/image-utils.ts`
- Image URL helper functions

### `utils/slug-utils.ts` / `utils/slugify.ts`
- URL slug generation utilities

### `hooks/use-local-storage.ts`
- Custom hook for localStorage with SSR safety

---

## Fonts & Styling

- **Font**: Geist Sans + Geist Mono (Google Fonts via `next/font`)
- **CSS Variables**: `--font-geist-sans`, `--font-geist-mono`
- **Tailwind**: v4 via `@tailwindcss/postcss` plugin
- **Style merging**: `cn()` utility (clsx + tailwind-merge)

---

## Important Conventions

1. **'use client'** directive on interactive components (forms, context consumers)
2. **Server components** are the default for pages (data fetching via `fetchFromApi`)
3. **Admin auth guard**: `admin/layout.tsx` redirects to `/admin/login` if `!isAdmin`
4. **No global `layout.tsx`** in `src/app/` — each route group has its own root layout
5. **Images**: Remote patterns allow `**` hostname; optimization is disabled for cPanel
6. **Caching**: All pages set `no-store, must-revalidate` headers
