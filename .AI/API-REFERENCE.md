# API Reference — REST Endpoints

> **Base URL**: `https://api.titecautomation.lk/api`  
> **Auth**: Bearer Token (Laravel Sanctum)  
> **Content-Type**: `application/json` (except file uploads: `multipart/form-data`)

---

## Authentication

| Method | Endpoint       | Auth     | Description             |
|--------|----------------|----------|-------------------------|
| POST   | `/register`    | Public   | Register new user       |
| POST   | `/login`       | Public   | Login, returns bearer token |
| POST   | `/logout`      | Bearer   | Revoke current token    |
| GET    | `/user`        | Bearer   | Get authenticated user  |

### POST `/login`
**Request:**
```json
{ "email": "admin@example.com", "password": "secret" }
```
**Response (200):**
```json
{
  "access_token": "1|abc123...",
  "token_type": "Bearer",
  "user": { "id": 1, "name": "Admin", "email": "...", "role": "admin" }
}
```

### POST `/register`
**Request:**
```json
{ "name": "John", "email": "john@email.com", "password": "pass123", "password_confirmation": "pass123", "role": "customer" }
```

---

## Products

| Method | Endpoint            | Auth     | Description              |
|--------|---------------------|----------|--------------------------|
| GET    | `/products`         | Public   | List products (paginated)|
| GET    | `/products/{id}`    | Public   | Get single product       |
| POST   | `/products`         | Bearer   | Create product           |
| PUT    | `/products/{id}`    | Bearer   | Update product           |
| DELETE | `/products/{id}`    | Bearer   | Delete product           |

**Query Params for GET `/products`:**
- `search` — Filter by name/description
- `admin=true` — Include all products (including `on_store=false`)

**Note**: Returns paginated data wrapped in Laravel's pagination format: `{ data: [...], current_page, last_page, total, ... }`

---

## Brands

| Method | Endpoint            | Auth     | Description      |
|--------|---------------------|----------|------------------|
| GET    | `/brands`           | Public   | List all brands  |
| GET    | `/brands/{brand}`   | Public   | Get single brand |
| POST   | `/brands`           | Bearer   | Create brand     |
| PUT    | `/brands/{brand}`   | Bearer   | Update brand     |
| DELETE | `/brands/{brand}`   | Bearer   | Delete brand     |

---

## Projects

| Method | Endpoint              | Auth     | Description        |
|--------|-----------------------|----------|--------------------|
| GET    | `/projects`           | Public   | List all projects  |
| GET    | `/projects/{project}` | Public   | Get single project |
| POST   | `/projects`           | Bearer   | Create project     |
| PUT    | `/projects/{project}` | Bearer   | Update project     |
| DELETE | `/projects/{project}` | Bearer   | Delete project     |

---

## Services

| Method | Endpoint              | Auth     | Description             |
|--------|-----------------------|----------|-------------------------|
| GET    | `/services`           | Public   | List service categories |
| GET    | `/services/{slug}`    | Public   | Get by slug             |
| POST   | `/services`           | Bearer   | Create service category |
| PUT    | `/services/{service}` | Bearer   | Update service          |
| DELETE | `/services/{service}` | Bearer   | Delete service          |

---

## Quotation Requests

| Method | Endpoint                            | Auth        | Description                      |
|--------|-------------------------------------|-------------|----------------------------------|
| POST   | `/quotation-requests`               | Public*     | Submit quotation request         |
| GET    | `/quotation-requests`               | Bearer      | List all requests (paginated)    |
| POST   | `/quotation-requests/{id}/reply`    | Bearer      | Reply to a request               |
| POST   | `/quotation-requests/direct`        | Bearer      | Send direct quote (no request)   |
| GET    | `/quotation-requests/{id}/download` | Bearer      | Download quotation PDF           |

*Throttled: 3 requests per minute per IP

### POST `/quotation-requests` (Public)
**Request:**
```json
{
  "name": "Customer Name",
  "email": "customer@email.com",
  "phone": "+94771234567",
  "message": "Need these products ASAP",
  "items": [
    { "product_id": 1, "quantity": 5 },
    { "product_id": 3, "quantity": 2 }
  ]
}
```

### POST `/quotation-requests/{id}/reply` (Admin)
**Mode: create** — Admin builds quotation from items:
```json
{
  "mode": "create",
  "message": "Here is your quotation",
  "items": [{ "name": "Product A", "quantity": 2, "price": 100 }],
  "vat": 15,
  "terms": ["Valid for 30 days"],
  "include_pdf": true
}
```

**Mode: upload** — Admin uploads custom PDF:
```
Content-Type: multipart/form-data
Fields: message, mode="upload", file (PDF), include_pdf
```

### GET `/quotation-requests`
**Query Params:** `page`, `status`  
**Response**: Paginated with `{ data: [...], current_page, last_page, total }`

---

## Quotations (Admin Replies)

| Method | Endpoint                  | Auth     | Description              |
|--------|---------------------------|----------|--------------------------|
| GET    | `/quotations`             | Bearer   | List all quotations      |
| POST   | `/quotations/preview`     | Bearer   | Preview quotation PDF    |
| GET    | `/quotations/{quotation}` | Bearer   | Get single quotation     |
| PUT    | `/quotations/{quotation}` | Bearer   | Update quotation         |

---

## Contact Form

| Method | Endpoint    | Auth     | Description              |
|--------|-------------|----------|--------------------------|
| POST   | `/contact`  | Public*  | Submit contact form      |

*Throttled: 3 requests per minute per IP

**Request:**
```json
{ "name": "John", "email": "john@email.com", "phone": "+94...", "message": "Hello..." }
```

---

## Dashboard

| Method | Endpoint           | Auth     | Description              |
|--------|--------------------|----------|--------------------------|
| GET    | `/dashboard/stats` | Bearer   | Get admin dashboard stats|

---

## Error Responses

**422 — Validation Error:**
```json
{ "message": "The given data was invalid.", "errors": { "email": ["The email field is required."] } }
```

**401 — Unauthorized:**
```json
{ "message": "Unauthenticated." }
```

**429 — Rate Limited (Throttled):**
```json
{ "message": "Too Many Attempts." }
```

---

## File Upload Notes

- **Products**: Images uploaded as array, stored in `storage/app/public/products/`
- **Projects**: Thumbnails + gallery images stored in `storage/app/public/projects/`
- **Brands**: Logo uploaded to `storage/app/public/brands/`
- **Quotation PDFs**: Generated/uploaded to `storage/app/public/quotations/`
- **Datasheets**: PDF files stored in `storage/app/public/datasheets/`
- All file URLs returned by API use `asset('storage/...')` format
