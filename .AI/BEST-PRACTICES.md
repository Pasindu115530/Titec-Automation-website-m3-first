# Best Practices & Conventions Guide

> Guidelines for AI models and developers working on the TiTEC Automation codebase.  
> Follow these conventions to maintain consistency across the project.

---

## General Principles

1. **This is a production website** for an industrial automation company. Changes should be tested thoroughly.
2. **Admin panel and public site are isolated** via Next.js route groups. Changes in one should not break the other.
3. **Backend is API-only** — no server-rendered HTML views (except email templates and PDF templates).
4. **Mobile responsiveness** is critical — the admin needs to send quotations from mobile devices.

---

## Frontend Conventions

### File Naming
- **Components**: `kebab-case.tsx` (e.g., `product-card.tsx`, `add-product-modal.tsx`)
- **Services**: `camelCase.ts` (e.g., `productService.ts`, `quotationService.ts`)
- **Types**: `camelCase.ts` in `types/` folder
- **Utilities**: `kebab-case.ts` (e.g., `image-utils.ts`, `slug-utils.ts`)

### Component Patterns
- Use `'use client'` only when the component needs browser APIs, state, or event handlers
- Server components are the default — prefer them for pages that only fetch and display data
- Admin components follow a **table + modal** pattern:
  - `*-table.tsx` — Lists items with action buttons
  - `add-*-modal.tsx` — Create new item form
  - `edit-*-modal.tsx` — Edit existing item form
  - `delete-confirmation-modal.tsx` — Reusable delete dialog

### Styling
- Use **Tailwind CSS v4** utility classes
- Use `cn()` from `lib/utils.ts` for conditional class merging
- Use `clsx` for conditional class names within `cn()`
- Admin sidebar uses dark theme (`bg-[#000619]`)
- Client site uses light theme with blue accents
- Animations: Use `framer-motion` for transitions and animated components

### State Management
- **No Redux or Zustand** — use React Context for global state
- `AuthContext` for authentication state
- `CartContext` for quotation cart state (client only)
- Component-local state via `useState` for UI concerns
- Use `localStorage` for persistence (with SSR safety checks)

### API Calls
- **Client-side**: Use service modules from `services/` (they use the Axios instance from `lib/api.ts`)
- **Server-side (SSR)**: Use `fetchFromApi` from `services/api.ts` (native fetch with fallbacks)
- Always handle loading and error states in the UI
- The Axios interceptor handles 401 → redirect to login automatically

### Adding a New Page
1. Create the page file in the appropriate route group: `(admin)/admin/[name]/page.tsx` or `(client)/[name]/page.tsx`
2. For admin pages, they inherit the sidebar layout automatically
3. For client pages, they inherit the header/footer layout automatically
4. Add SEO metadata for client pages (title, description, OpenGraph)

### Adding a New Admin CRUD Feature
1. Create a `*-table.tsx` component in `components/admin/`
2. Create `add-*-modal.tsx` and `edit-*-modal.tsx` if needed
3. Create a service module in `services/`
4. Create a page in `(admin)/admin/[name]/page.tsx`
5. Add the menu item in `(admin)/admin/layout.tsx` menuItems array
6. Add TypeScript types in `types/`

---

## Backend Conventions

### File Naming
- **Controllers**: `PascalCase` + `Controller.php` (e.g., `ProductController.php`)
- **Models**: Singular `PascalCase` (e.g., `Product.php`, `QuotationRequest.php`)
- **Migrations**: Laravel default `yyyy_mm_dd_hhmmss_description.php`
- **Seeders**: `PascalCase` + `Seeder.php`
- **Mail**: `PascalCase` + descriptive name (e.g., `QuotationReplyMail.php`)

### Controller Patterns
- Controllers use standard Laravel resource methods: `index`, `store`, `show`, `update`, `destroy`
- Validation is done **inline** in controllers (no Form Request classes)
- Return JSON responses consistently
- Use API Resources (`ProductResource`, `QuotationRequestResource`) for complex serialization
- Simple endpoints return raw Eloquent models

### Model Patterns
- Always define `$fillable` or `$guarded`
- Use `$casts` for JSON columns, booleans, decimals, and dates
- Define relationships as methods with clear docblock comments
- Use pivot tables for many-to-many relationships (e.g., `quotation_request_items`)

### Adding a New Endpoint
1. Create/update the controller in `app/Http/Controllers/`
2. Add the Eloquent model in `app/Models/` if new entity
3. Create a migration: `php artisan make:migration create_*_table`
4. Add routes in `routes/api.php`:
   - Public routes: Outside the `auth:sanctum` middleware group
   - Admin routes: Inside the `auth:sanctum` middleware group
5. Create an API Resource if response needs transformation
6. Run migration: `php artisan migrate`

### Database
- Use migrations for **all** schema changes — never modify DB directly
- Define `$fillable` in models to match migration columns
- Use `$casts` for non-string column types
- Pivot tables follow the convention: `{model1}_{model2}_items` or alphabetical Laravel default

### File Uploads
- Store files in `storage/app/public/[category]/` (e.g., `products/`, `brands/`)
- Return full URLs using `asset('storage/' . $path)` in API Resources
- After deployment, ensure `php artisan storage:link` has been run

### Email
- Create Mailable classes in `app/Mail/`
- Use database queue for sending: `Mail::queue(new MailClass())`
- Email templates in `resources/views/emails/`
- Sales notifications go to `MAIL_SALES_ADDRESS` env variable

---

## Security Notes

> [!CAUTION]
> **No server-side role authorization** — The backend does not verify if the authenticated user is an admin before allowing access to admin routes. Any authenticated user can technically call admin-only endpoints. Implementing middleware-level role checks is recommended for production hardening.

> [!WARNING]
> **`.env.example` contains real credentials** — The `.env.example` file currently has actual database credentials. These should be replaced with placeholders. Never commit real credentials to version control.

### Current Security Measures
- ✅ Sanctum bearer token authentication
- ✅ CSRF exclusion for API routes (appropriate for token-based auth)
- ✅ Rate limiting on public form submissions (3/minute/IP)
- ✅ CORS restricted to known domains
- ✅ Password hashing with bcrypt (12 rounds)

### Recommended Improvements
- ❌ Add role-based middleware (`EnsureUserIsAdmin`)
- ❌ Sanitize `.env.example` of real credentials
- ❌ Add input sanitization beyond Laravel's default
- ❌ Add API rate limiting for authenticated routes
- ❌ Implement HTTPS-only cookies for token storage

---

## Deployment Checklist

### Frontend (cPanel/Node.js)
1. `npm install`
2. `npm run build` (uses webpack, not turbopack)
3. Start: `node server.js` (custom HTTP server wrapping Next.js, reads `PORT` env)
4. Set `NEXT_PUBLIC_BACKEND_URL` to the production API URL

### Backend (cPanel/PHP)
1. `composer install --optimize-autoloader --no-dev`
2. `php artisan key:generate`
3. `php artisan migrate --force`
4. `php artisan storage:link`
5. `php artisan config:cache`
6. `php artisan route:cache`
7. Set up cron for `php artisan schedule:run` (if needed)
8. Set up queue worker: `php artisan queue:work` (for emails)

### Environment Variables to Set
- `APP_ENV=production`, `APP_DEBUG=false`
- Database credentials
- Mail SMTP credentials
- `MAIL_SALES_ADDRESS` for admin notifications
- `SANCTUM_STATEFUL_DOMAINS` to include production domain

---

## Common Pitfalls to Avoid

1. **Don't forget FormData headers**: When uploading files, use `multipart/form-data`. The Axios instance defaults to `application/json`.
2. **SSR vs CSR confusion**: `fetchFromApi` fails silently during build (returns `[]`). Only use it for pages that are fine with empty initial data.
3. **Image optimization disabled**: Don't rely on Next.js's `<Image>` optimization. Images are served as-is.
4. **Two API utilities exist**: `lib/api.ts` (Axios, client-side) and `services/api.ts` (fetch, SSR). Use the right one for the context.
5. **localStorage in SSR**: Always check `typeof window !== 'undefined'` before accessing localStorage.
6. **CORS updates**: When adding new domains, update BOTH `config/cors.php` AND `config/sanctum.php` stateful domains.
7. **Cache busting**: The `VersionManager` component handles frontend cache busting. Don't remove it.
8. **Admin routes not role-protected**: Don't assume backend validates admin role — it only checks authentication.
