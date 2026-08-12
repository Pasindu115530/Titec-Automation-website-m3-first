# Future Improvements

> Planned features and enhancements not yet implemented. Review before starting new development sprints.

---

## 1. Product Rating System

**Priority**: Medium  
**Effort**: ~2–3 hours (full stack) | ~30 min (frontend-only demo)  
**Goal**: Allow customers to rate products on the store, improving buyer confidence and SEO signals (`aggregateRating` JSON-LD).

### Two Implementation Options

#### Option A — Frontend-Only (localStorage)
Ratings stored per-browser. Not shared between users. Quick to build; useful as a UI placeholder until the backend is ready.

- New hook: `src/hooks/use-product-rating.ts` — reads/writes `localStorage` keyed by `product_id`
- New component: `src/components/client/star-rating.tsx` — interactive + read-only modes, 5 stars, hover preview, animations
- Modify `product-card.tsx` — compact read-only stars below product name
- Modify `product-detail-page.tsx` — full interactive rating widget with `sonner` toast on submit

#### Option B — Full Stack (Recommended for Production)
Real shared ratings backed by the database, shown to all users.

**Backend (Laravel):**
- New migration: `product_ratings` table — `id`, `product_id` (FK), `session_id` (varchar), `score` (tinyint 1–5), timestamps. Unique constraint on `(product_id, session_id)`.
- New model: `app/Models/ProductRating.php` (`belongsTo → Product`)
- New controller: `app/Http/Controllers/ProductRatingController.php`
  - `POST /api/products/{id}/ratings` — upsert rating (public, throttled)
  - `GET /api/products/{id}/ratings/summary` — returns `{ average, count }`
- Modify `routes/api.php` — register both public routes
- Modify `ProductResource.php` — append `rating_average` + `rating_count` to all product responses

**Frontend:**
- New service: `src/services/ratingService.ts` (`submitRating`, `getRatingSummary`)
- Add `rating_average?: number`, `rating_count?: number` to `Product` interface in `src/types/index.ts`
- New component: `src/components/client/star-rating.tsx` (same as Option A)
- Modify `product-card.tsx` — display average from API data
- Modify `product-detail-page.tsx` — interactive widget + aggregate display
- Modify `store/[slug]/page.tsx` JSON-LD — add `aggregateRating` block to `Product` schema for SEO

### Open Questions (resolve before implementing)
- Who can rate? Anonymous visitors (session-based) or logged-in customers only?
- Rating scale? 5 stars (recommended, industry standard)?
- Should admins be able to moderate/delete ratings?

---
