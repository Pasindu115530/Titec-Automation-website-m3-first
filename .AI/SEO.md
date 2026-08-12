# SEO & AI Search Optimization Guide

> **Scope**: All client-facing pages in `(client)/` route group.  
> **Last Updated**: August 2026

---

## Overview

TiTEC Automation uses a layered SEO strategy with three reinforcing signals:

| Layer | What It Does | Where It Lives |
|-------|-------------|----------------|
| **Next.js Metadata API** | Title, description, OG, Twitter cards | `metadata` / `generateMetadata` exports |
| **JSON-LD Structured Data** | Machine-readable context for Google, Bing, AI crawlers | Inline `<script type="application/ld+json">` |
| **Sitemap + Robots** | Crawl budget allocation, AI-bot permissions | `app/sitemap.ts`, `app/robots.ts` |

---

## Page-by-Page SEO Inventory

### `/` — Homepage
- **Type**: `website`
- **JSON-LD**: `Organization` (in `components/json-ld.tsx`)
- **Metadata**: Set in `(client)/layout.tsx` as the default

### `/store` — Store Listing
- **Type**: `website`
- **JSON-LD**: `ItemList` + `BreadcrumbList`
- **Keywords**: PLC, HMI, VFD, inverters, sensors, Sri Lanka
- **OG Image**: `/og-image.jpg` (1200 × 630)
- **ISR**: 5 minutes (`revalidate = 300`)

### `/store/[slug]` — Product Detail
- **Type**: `website`
- **JSON-LD**: `Product` (with `Offer`, `ShippingDetails`) + `BreadcrumbList`
- **Keywords**: Product name, brand, model, category, Sri Lanka
- **OG Image**: First product image (1200 × 630)
- **ISR**: 60 seconds (`revalidate = 60`)
- **Static Params**: `generateStaticParams()` pre-renders known slugs at build

### `/projects` — Projects Listing
- **Type**: `website`
- **JSON-LD**: `ItemList` + `BreadcrumbList`
- **Keywords**: PLC, SCADA, HMI, portfolio, case studies
- **OG Image**: `/og-image.jpg` (1200 × 630)
- **ISR**: 5 minutes (`revalidate = 300`)

### `/projects/[id]` — Project Detail
- **Type**: `article`
- **JSON-LD**: `CreativeWork` (with client, technologies, location) + `BreadcrumbList`
- **Keywords**: Technologies used + location + client name
- **OG Image**: Project thumbnail (1200 × 630)
- **ISR**: 60 seconds (`revalidate = 60`)
- **Static Params**: `generateStaticParams()` pre-renders known IDs at build

### `/services` — Services
- **Type**: `website`
- **JSON-LD**: Custom (check page file)
- **Sitemap Priority**: `0.8`

### `/about` — About
- **Sitemap Priority**: `0.6`, `changeFrequency: 'yearly'`

### `/clients` — Clients
- **Sitemap Priority**: `0.6`, `changeFrequency: 'monthly'`

### `/contact` — Contact
- **Sitemap Priority**: `0.5`

### `/faq` — FAQ
- **Sitemap Priority**: `0.5`

---

## JSON-LD Schema Patterns

### Product Schema (`/store/[slug]`)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.titecautomation.lk/store/[slug]",
  "name": "Product Name",
  "image": ["https://api.titecautomation.lk/storage/..."],
  "description": "Plain-text description (HTML stripped)",
  "brand": { "@type": "Brand", "name": "Siemens" },
  "sku": "SKU123",
  "mpn": "MODEL-XYZ",
  "category": "PLC",
  "url": "https://www.titecautomation.lk/store/[slug]",
  "seller": { "@type": "Organization", "name": "TiTEC Automation" },
  "offers": {
    "@type": "Offer",
    "@id": "https://www.titecautomation.lk/store/[slug]#offer",
    "priceCurrency": "LKR",
    "price": 0,
    "priceValidUntil": "YYYY-MM-DD",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "shippingDetails": { ... }
  }
}
```

> [!IMPORTANT]
> `product.show_price === false` suppresses the `offers` block entirely. Never hard-code prices into the schema — always read from the API.

### CreativeWork Schema (`/projects/[id]`)

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": "https://www.titecautomation.lk/projects/[id]",
  "name": "Project Title",
  "description": "Plain-text description",
  "image": [{ "@type": "ImageObject", "url": "...", "caption": "Project Title" }],
  "creator": { "@type": "Organization", "name": "TiTEC Automation" },
  "funder": { "@type": "Organization", "name": "Client Company Name" },
  "about": { "@type": "Thing", "name": "Client Company Name" },
  "dateCreated": "YYYY-MM-DD",
  "locationCreated": { "@type": "Place", "name": "Colombo" },
  "keywords": "PLC, SCADA, Siemens",
  "genre": "Industrial Automation"
}
```

### ItemList Schema (listing pages)

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": "https://www.titecautomation.lk/store",
  "name": "TiTEC Automation Product Catalog",
  "numberOfItems": 50,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "PLC Siemens S7-1200", "url": "..." }
  ]
}
```

---

## AI Search Optimization

### How AI Search Works

AI search engines (ChatGPT, Perplexity, Google Gemini, Bing Copilot) use a combination of:
1. **Indexed web content** — Your page text, headings, structured data
2. **Real-time web browsing** — Some AIs browse pages on-demand
3. **robots.txt** — To determine what they're allowed to crawl

### Bot Permissions (robots.ts)

All major AI crawlers are **explicitly allowed** on all public pages:

| Bot | AI System | Status |
|-----|-----------|--------|
| `Google-Extended` | Gemini / Bard | ✅ Allowed |
| `GPTBot` | ChatGPT training | ✅ Allowed |
| `ChatGPT-User` | ChatGPT browsing | ✅ Allowed |
| `ClaudeBot` | Anthropic Claude | ✅ Allowed |
| `PerplexityBot` | Perplexity AI | ✅ Allowed |
| `meta-externalagent` | Meta AI / Llama | ✅ Allowed |
| `Applebot-Extended` | Apple Intelligence | ✅ Allowed |
| `CCBot` | Common Crawl | ✅ Allowed |
| `cohere-ai` | Cohere AI | ✅ Allowed |

All bots are **blocked** from: `/admin/`, `/api/`, `/customer-dashboard/`

> [!NOTE]
> If the client ever wants to block AI training on their content (not recommended for a B2B site that benefits from AI visibility), set `disallow: '/'` for `GPTBot`, `CCBot`, and `Google-Extended`.

### Content Signals for AI Answers

AI systems prioritize pages with clear, factual content. To rank well in AI answers:

1. **Use plain-language headings** that answer specific questions (e.g., "What PLCs does TiTEC Automation sell?")
2. **Include location signals** — "Sri Lanka", city names, phone numbers, addresses
3. **Use structured data** — The JSON-LD schemas above directly feed Google's AI Overview feature
4. **FAQ page** — `/faq` content is highly valued by AI answer engines; keep it up to date
5. **Service descriptions** — Clear, specific descriptions of what each service includes

---

## Metadata Conventions

### Title Format
```
[Page-Specific Title] | [Brand/Category] | TiTEC Automation
```
Examples:
- Store listing: `Industrial Automation Products Store | TiTEC Automation Sri Lanka`
- Product: `Siemens S7-1200 PLC | Siemens | TiTEC Automation`
- Project: `Factory Conveyor Automation | ABC Manufacturing | TiTEC Automation`

### Description Format
- **Length**: 130–155 characters (truncated from real content where possible)
- **Pattern**: `[What it is] — [Key specs/context] in Sri Lanka.`
- **Include price** in product descriptions when `show_price !== false`

### Canonical URLs
- Always use `https://www.titecautomation.lk` (with `www.`) — match `NEXT_PUBLIC_APP_URL`
- Dynamic pages set their own canonical via `alternates.canonical`
- The root layout sets `metadataBase` which resolves relative URLs

### OG Images
- Default: `/og-image.jpg` (must be present in `public/` folder, 1200×630 px)
- Products: First image from `product.images[]` or `product.image`
- Projects: `project.thumbnail_path` via `getImageUrl()`
- Always specify explicit `width: 1200, height: 630` in the image object

---

## ISR Strategy

| Page | `revalidate` | Rationale |
|------|-------------|-----------|
| `/store` | `300` (5 min) | Products change often, but build resilience matters |
| `/store/[slug]` | `60` (1 min) | Price/stock changes need to surface quickly |
| `/projects` | `300` (5 min) | New projects added infrequently |
| `/projects/[id]` | `60` (1 min) | Project details rarely change; short TTL for quick edits |

### generateStaticParams
Both `/store/[slug]` and `/projects/[id]` use `generateStaticParams()` to pre-render all known pages at build time. This ensures:
- Zero cold-start latency for crawlers
- Pre-rendered HTML immediately available for indexing
- Falls back gracefully if API is unreachable during build (returns `[]`)

---

## Sitemap Coverage

| URL | Priority | Change Frequency |
|-----|---------|-----------------|
| `/` | 1.0 | monthly |
| `/store` | 0.9 | **daily** |
| `/projects` | 0.8 | weekly |
| `/services` | 0.8 | monthly |
| `/about` | 0.6 | yearly |
| `/clients` | 0.6 | monthly |
| `/contact` | 0.5 | yearly |
| `/faq` | 0.5 | monthly |
| `/store/[slug]` (each) | 0.7 | weekly |
| `/projects/[id]` (each) | 0.7 | monthly |

---

## Common Pitfalls

> [!WARNING]
> **baseUrl consistency**: Always use `https://www.titecautomation.lk` (with `www.`). Using bare `titecautomation.lk` creates canonical confusion and duplicate indexing.

> [!WARNING]
> **HTML in descriptions**: Always strip HTML tags before using `product.description` or `project.description` in metadata or JSON-LD. Use the `stripHtml()` helper defined locally in each page file.

> [!NOTE]
> **`show_price` flag**: Never include price in the `Product` JSON-LD `offers` block when `product.show_price === false`. This is a business rule — some products are quote-only.

> [!NOTE]
> **`generateStaticParams` failures**: These fail silently (return `[]`) when the API is down at build time. This means those pages will be rendered on-demand (ISR fallback) instead of pre-rendered. This is intentional.

> [!CAUTION]
> **Admin pages**: The `(admin)` root layout sets `robots: { index: false, follow: false }` (noindex). Never add a public `metadata` export to admin pages that could override this.
