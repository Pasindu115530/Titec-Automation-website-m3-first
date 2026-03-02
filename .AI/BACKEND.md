# Backend Architecture — `backend-laravel`

> **Framework**: Laravel 12 · **PHP**: 8.2+ · **Auth**: Sanctum 4 (Bearer Tokens) · **DB**: MySQL

---

## Project Structure

```
backend-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/        ← 10 API controllers
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── ProjectController.php
│   │   │   ├── BrandController.php
│   │   │   ├── ServiceController.php
│   │   │   ├── QuotationController.php
│   │   │   ├── QuotationRequestController.php
│   │   │   ├── ContactController.php
│   │   │   ├── DashboardController.php
│   │   │   └── Controller.php   ← Base controller
│   │   ├── Middleware/
│   │   │   ├── VerifyCsrfToken.php  ← Excludes api/* from CSRF
│   │   │   └── EncryptCookies.php
│   │   └── Resources/
│   │       ├── ProductResource.php
│   │       └── QuotationRequestResource.php
│   ├── Models/                  ← 9 Eloquent models
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Brand.php
│   │   ├── Project.php
│   │   ├── ServiceCategory.php
│   │   ├── ServiceItem.php
│   │   ├── QuotationRequest.php
│   │   ├── Quotation.php
│   │   └── ContactMessage.php
│   ├── Mail/                    ← 5 Mailable classes
│   │   ├── QuotationMail.php
│   │   ├── QuotationReplyMail.php
│   │   ├── QuotationRequestNotification.php
│   │   ├── AdminQuotationNotification.php
│   │   └── ContactFormSubmitted.php
│   └── Providers/
│       └── AppServiceProvider.php
├── config/
│   ├── cors.php                ← CORS config (crucial)
│   ├── sanctum.php             ← Sanctum auth config
│   ├── mail.php                ← Email config
│   ├── filesystems.php         ← Storage config
│   └── ...
├── database/
│   ├── migrations/             ← 25 migration files
│   └── seeders/                ← 9 seeders
├── routes/
│   └── api.php                 ← All API routes (single file)
├── resources/views/            ← Blade templates (for PDFs/emails)
├── storage/app/public/         ← Uploaded files (images, PDFs)
└── composer.json
```

---

## Authentication System

### Sanctum Bearer Token Flow

```
POST /api/login
  → Validates email + password
  → Creates personal access token via $user->createToken('auth_token')
  → Returns { access_token, token_type: 'Bearer', user }

All protected routes:
  → Header: Authorization: Bearer <token>
  → Middleware: auth:sanctum

POST /api/logout
  → $request->user()->currentAccessToken()->delete()
```

### Token Configuration
- **Expiration**: 1440 minutes (24 hours) — configured in `config/sanctum.php`
- **Guards**: `['web']`
- **CSRF**: Excluded for all `api/*` routes

### User Roles
- Defined in `User.php` model with a `role` column
- Values: `'admin'` | `'customer'`
- Role-based access is enforced **on the frontend** (no middleware-level role check on backend)

> ⚠️ **Note**: There is no server-side role authorization middleware. Any authenticated user can access admin routes. This is a known simplification.

---

## Models & Relationships

### User
```php
fillable: ['name', 'email', 'password', 'role']
// Uses HasApiTokens (Sanctum)
hasMany → QuotationRequests
```

### Product
```php
fillable: ['name', 'model_number', 'slug', 'description', 'price', 'stock',
           'unit', 'category', 'brand', 'sku', 'images', 'datasheet_path',
           'stock_status', 'on_store', 'brand_id']
casts: images → array, price → decimal:2, on_store → boolean
belongsTo → Brand
belongsToMany → QuotationRequest (pivot: quotation_request_items, with: quantity)
```

### Brand
```php
fillable: ['name', 'slug', 'logo_path']
hasMany → Products
```

### Project
```php
fillable: ['title', 'client', 'description', 'location', 'completion_date',
           'status', 'technologies', 'thumbnail_path', 'logo_path', 'project_image_urls']
casts: technologies → array, project_image_urls → array
```

### ServiceCategory
```php
fillable: ['title', 'description', 'image_path', 'slug', 'sort_order']
hasMany → ServiceItems (ordered by sort_order)
```

### ServiceItem
```php
fillable: ['service_category_id', 'title', 'description', 'sort_order']
belongsTo → ServiceCategory
```

### QuotationRequest
```php
fillable: ['name', 'email', 'phone', 'customer_notes', 'status', 'file_path']
// Status values: 'pending', 'quoted', 'closed'
belongsTo → User (optional)
belongsToMany → Product (pivot: quotation_request_items, with: quantity)
hasOne → Quotation
```

### Quotation
```php
fillable: ['quotation_request_id', 'admin_id', 'grand_total', 'pdf_path',
           'valid_until', 'remarks']
casts: valid_until → date
belongsTo → QuotationRequest
belongsTo → User (as admin)
```

### ContactMessage
```php
fillable: ['name', 'email', 'phone', 'message']
```

---

## API Resources (Serializers)

### ProductResource
- Maps `images` to full asset URLs: `asset('storage/' . $img)`
- Maps `datasheet_path` to full URL
- Includes `quantity_requested` when loaded via pivot

### QuotationRequestResource
- Includes customer info (handles guest users)
- Includes nested `ProductResource::collection`
- Includes admin quotation reply data if exists

---

## Email System (Mailables)

| Mailable                          | Trigger                              | Recipient     |
|-----------------------------------|--------------------------------------|---------------|
| `QuotationRequestNotification`    | Customer submits quotation request   | Admin (sales) |
| `AdminQuotationNotification`      | Admin creates quotation              | Admin (sales) |
| `QuotationMail`                   | Quotation sent to customer           | Customer      |
| `QuotationReplyMail`              | Admin replies to a request           | Customer      |
| `ContactFormSubmitted`            | Contact form submitted               | Admin (sales) |

- **Queue**: Database-backed queue (`QUEUE_CONNECTION=database`)
- **Sales email**: `MAIL_SALES_ADDRESS` env variable

---

## File Storage

- **Disk**: Local filesystem (`FILESYSTEM_DISK=local`)
- **Public files**: Stored in `storage/app/public/`
- **Access**: Via `asset('storage/...')` after `php artisan storage:link`
- **Types stored**: Product images, datasheets (PDF), project thumbnails, brand logos, service images, quotation PDFs
- **Image format**: Uploaded as-is (no server-side processing)

---

## Database

### Connection
- **Driver**: MySQL
- **Session/Cache/Queue**: All use `database` driver (no Redis)
- **Bcrypt rounds**: 12

### Migration Overview (25 migrations)
Key tables created:
- `users` — with `role` column
- `products` — with `images` JSON, `brand_id`, `on_store`
- `brands` — with `slug`, `logo_path`
- `projects` — with `technologies` JSON, `project_image_urls` JSON
- `service_categories` + `service_items` — parent/child with `sort_order`
- `quotation_requests` — customer requests
- `quotation_request_items` — pivot table (product_id, quantity)
- `quotations` — admin replies with PDF path
- `contact_messages` — contact form submissions

### Seeders (9 seeders)
- `DatabaseSeeder` — orchestrates all seeders
- Individual: ProductSeeder, ProjectSeeder, QuotationSeeder, ServiceSeeder, etc.

---

## CORS Configuration (`config/cors.php`)

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://localhost:3000',
    'https://127.0.0.1:3000',
    'https://titecautomation.lk'
],
'supports_credentials' => true,
```

> ⚠️ When adding a new frontend domain (e.g., staging), add it here AND in `sanctum.php`'s stateful domains.

---

## Key Conventions

1. **All API routes** are in a single `routes/api.php` file (no route splitting)
2. **Public routes** outside auth middleware; **admin routes** inside `auth:sanctum` group
3. **Public form submissions** (quotation requests, contact) are throttled: `throttle:3,1` (3 per minute per IP)
4. **PDF generation** uses `barryvdh/laravel-dompdf` package
5. **No Form Requests** — validation is done inline in controllers
6. **No Policies/Gates** — authorization is minimal (frontend-enforced)
7. **No API versioning** — single version at `/api/*`
8. **Controller responses** mix raw JSON and API Resources (not fully standardized)
