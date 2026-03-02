# Security Audit Report — TiTEC Automation

> **Audit Date**: March 2, 2026  
> **Scope**: Full-stack review of `frontend-next` and `backend-laravel`  
> **Severity Levels**: 🔴 Critical · 🟠 High · 🟡 Medium · 🔵 Low · ⚪ Info

---

## Summary

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 3 | Direct security exploits possible |
| 🟠 High | 4 | Significant security weaknesses |
| 🟡 Medium | 4 | Issues that should be fixed |
| 🔵 Low | 3 | Minor concerns / best practice improvements |

---

## 🔴 Critical Vulnerabilities

### 1. No Role-Based Authorization on Admin Routes
**Files**: `routes/api.php`, all admin controllers  
**Impact**: Any authenticated user (including `customer` role) can perform admin actions  

All admin routes are protected only by `auth:sanctum`, which checks if the user is authenticated — **not** if they are an admin. A customer who registers via the public `/register` endpoint can:
- Create, edit, and delete products, projects, brands, and services
- View and reply to all quotation requests
- Access dashboard statistics
- Send quotation emails to any email address

```php
// routes/api.php — Current (VULNERABLE)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);  // Any authenticated user!
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    // ... all admin routes equally exposed
});
```

**Fix**: Create an `EnsureUserIsAdmin` middleware:
```php
// app/Http/Middleware/EnsureUserIsAdmin.php
public function handle($request, Closure $next) {
    if (!$request->user() || $request->user()->role !== 'admin') {
        return response()->json(['message' => 'Forbidden'], 403);
    }
    return $next($request);
}
```

---

### 2. Open Registration Endpoint — Anyone Can Create Accounts
**File**: `routes/api.php`, `AuthController.php`  
**Impact**: Unlimited account creation, combined with #1 allows full admin access  

The `POST /api/register` endpoint is public with no restrictions:
- No email verification required
- The `role` field is accepted from user input (`$request->role ?? 'customer'`)
- No CAPTCHA or additional rate limiting
- Combined with vulnerability #1, an attacker could register → log in → fully control the admin panel

```php
// AuthController.php line 24 — Role from user input!
'role' => $request->role ?? 'customer',
```

**Fix**:
1. **Remove role from user input** — always default to `'customer'`
2. **Add email verification** (`MustVerifyEmail`)
3. **Consider disabling public registration** if only admin accounts are needed
4. **Add rate limiting** on the register endpoint

---

### 3. Path Traversal via `deleted_images` Parameter
**Files**: `ProductController.php` (line 180-192), `ProjectController.php` (line 144-156)  
**Impact**: An authenticated user can delete **any file** on the server  

The `deleted_images` array is taken directly from user input and passed to `File::delete(public_path($delImg))` with no path validation:

```php
// ProductController.php — VULNERABLE
if ($request->has('deleted_images')) {
    $deletedImages = $request->deleted_images;
    foreach ($deletedImages as $delImg) {
        if (file_exists(public_path($delImg))) {
            File::delete(public_path($delImg));  // Can delete ANY file under public/
        }
    }
}
```

An attacker could send `deleted_images: ["../storage/logs/laravel.log"]` or `["../../.env"]` to delete critical files.

**Fix**: Validate that paths are within expected directories and match known image patterns:
```php
foreach ($deletedImages as $delImg) {
    // Only allow deletion of files in expected directory
    $realPath = realpath(public_path($delImg));
    $allowedDir = realpath(public_path('products'));
    if ($realPath && str_starts_with($realPath, $allowedDir)) {
        File::delete($realPath);
    }
}
```

---

## 🟠 High Severity Issues

### 4. SVG/XML File Upload Allows Stored XSS
**File**: `BrandController.php` (line 27, 64)  
**Impact**: Persistent cross-site scripting  

Brand logo uploads accept `svg` and `xml` file types, which are stored directly in `public/brands/` and served to all users. SVG files can contain embedded JavaScript:

```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <script>alert(document.cookie)</script>
</svg>
```

This SVG would execute JavaScript when any visitor's browser loads the brand logo.

**Fix**: Either disallow SVG uploads or sanitize SVG files before storing. At minimum, serve SVGs with `Content-Type: image/svg+xml` and `Content-Disposition: inline` headers, and use CSP headers.

---

### 5. Files Stored in `public/` with Original Filenames
**Files**: All controllers that handle file uploads  
**Impact**: Filename injection, potential overwrite of existing files, information disclosure  

All file uploads use `$file->move(public_path('...'), $filename)` with the original client filename included:

```php
$filename = time() . '_' . $file->getClientOriginalName();  // Includes original name!
```

Issues:
- Original filenames may contain special characters (spaces, unicode, `.htaccess`)
- Files are publicly accessible without authentication
- Filenames reveal internal information
- A crafted filename like `../../../.htaccess` could potentially overwrite server configs

**Fix**: Generate random filenames and store originals in the database if needed:
```php
$filename = time() . '_' . Str::random(16) . '.' . $file->getClientOriginalExtension();
```

---

### 6. Admin Product Listing Bypass via `?admin=true`
**File**: `ProductController.php` (line 19)  
**Impact**: Any unauthenticated user can see all products including hidden ones  

```php
// Public endpoint, no auth required
if (!$request->input('admin', false)) {
    $query->where('on_store', true);
}
```

Anyone can append `?admin=true` to the public products endpoint to see all products, including those intentionally hidden from the store (`on_store=false`).

**Fix**: Check authentication + admin role before showing hidden products:
```php
if (!($request->user() && $request->user()->role === 'admin')) {
    $query->where('on_store', true);
}
```

---

### 7. Internal Error Messages Leaked to API Responses
**Files**: All controllers  
**Impact**: Information disclosure, aids attackers in understanding system internals  

Exception messages (including SQL errors, file system paths, class names) are returned directly in API responses:

```php
// ProductController.php, ServiceController.php, etc.
return response()->json([
    'message' => 'Failed to create product.',
    'error' => $e->getMessage()  // Leaks internal error details!
], 500);
```

```php
// QuotationRequestController.php line 235
return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
```

**Fix**: Return generic error messages in production. Log details internally:
```php
Log::error('Product creation failed', ['error' => $e->getMessage()]);
return response()->json(['message' => 'An error occurred. Please try again.'], 500);
```

---

## 🟡 Medium Severity Issues

### 8. `.env.example` Contains Real Database Credentials
**File**: `backend-laravel/.env.example`  
**Impact**: Credential exposure if repository is public or shared  

```
DB_HOST=198.37.102.12
DB_DATABASE=titecaut_titec_automation_new
DB_USERNAME=titecaut_titec_new_admin
DB_PASSWORD="&S$G_c[}C;^H]zju"
```

These are real credentials committed to version control.

**Fix**: Replace with placeholder values immediately and rotate these credentials:
```
DB_HOST=127.0.0.1
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

---

### 9. No Rate Limiting on Authentication Endpoints
**File**: `routes/api.php`  
**Impact**: Brute-force login attacks  

The `/api/login` and `/api/register` endpoints have no rate limiting. An attacker can attempt unlimited login combinations.

**Fix**: Add throttle middleware:
```php
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});
```

---

### 10. Debug Files in Production Repository
**Files**: `backend-laravel/debug_migration.php`, `debug_output.txt`, `debug_quotations.php`, `migrate_error.txt`, `migrate_error_2.txt`, `migrate_output.txt`, `test-db-connection.php`  
**Impact**: Information disclosure, potential code execution  

Several debug/test scripts are present in the backend root. If the web server serves these files, they could:
- Reveal database connection details
- Expose migration/error information
- Allow test scripts to be executed

**Fix**: Delete all debug files from the repository. Add them to `.gitignore`.

---

### 11. Debug Logging to File in Controller
**File**: `QuotationRequestController.php` (line 234)  
**Impact**: Information disclosure, unmanaged log growth  

```php
file_put_contents(storage_path('logs/reply_debug.log'), $e->getMessage() . "\n" . $e->getTraceAsString());
```

Full stack traces are written to a custom log file. This bypasses Laravel's log management and could grow unbounded.

**Fix**: Use Laravel's built-in logger instead:
```php
Log::error('Reply Error', ['exception' => $e]);
```

---

## 🔵 Low Severity Issues

### 12. Frontend Token Storage in localStorage
**File**: `context/AuthContext.tsx`, `lib/api.ts`  
**Impact**: Token theft via XSS  

Bearer tokens are stored in `localStorage`, which is accessible to any JavaScript running on the page. If an XSS vulnerability exists (e.g., from SVG uploads), tokens can be stolen.

**Consideration**: For this architecture (SPA + API), localStorage is a common pattern. The risk is mitigated by:
- Not having user-generated content rendered as HTML
- Using React (auto-escapes output)

However, the SVG upload issue (#4) makes this more concerning.

---

### 13. No Email Verification on Registration
**File**: `AuthController.php`  
**Impact**: Spam accounts, no identity verification  

Users can register with any email address without verification. The `User` model has `MustVerifyEmail` commented out.

**Fix**: Implement email verification or disable public registration.

---

### 14. Contact Form Returns Full Model Data
**File**: `ContactController.php` (line 37-38)  
**Impact**: Minor information disclosure  

```php
return response()->json([
    'message' => 'Message sent successfully!',
    'data' => $contactMessage  // Returns full model including ID, timestamps
], 201);
```

**Fix**: Return only the success message without model data.

---

## Improvement Recommendations (Non-Security)

### Performance
1. **Product listing is not paginated** — `ProductController::index()` returns all products via `->get()` instead of `->paginate()`
2. **Projects listing is not paginated** — `ProjectController::index()` returns `Project::all()`
3. **No caching** on public API responses (products, services, brands)

### Code Quality
1. **Inconsistent API response format** — Some controllers return raw models, others wrap in `{ data, message }`
2. **No Form Request classes** — All validation is inline in controllers
3. **Mix of `public_path()` and Storage facade** — Products/brands use `public_path()` directly while quotations use the Storage facade

### Frontend
1. **Dual API utilities** (`lib/api.ts` Axios vs `services/api.ts` fetch) could be consolidated
2. **No error boundary** components for graceful failure handling
3. **Admin routes** should have a loading state while auth is being verified (currently briefly shows content before redirect)

---

## Priority Action Items

| Priority | Action | Effort |
|----------|--------|--------|
| 🔴 1 | Add admin role middleware to protect admin routes | 30 min |
| 🔴 2 | Remove role from registration input / disable registration | 10 min |
| 🔴 3 | Validate `deleted_images` paths against allowed directories | 30 min |
| 🟠 4 | Remove SVG from allowed upload types or sanitize | 15 min |
| 🟠 5 | Generate random filenames for uploads | 30 min |
| 🟠 6 | Fix admin product bypass (`?admin=true`) | 10 min |
| 🟠 7 | Remove internal errors from API responses | 30 min |
| 🟡 8 | Sanitize `.env.example` + rotate credentials | 15 min |
| 🟡 9 | Add rate limiting to auth endpoints | 10 min |
| 🟡 10 | Delete debug files from repository | 5 min |
