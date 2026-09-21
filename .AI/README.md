# .AI — Project Intelligence

> Documentation for AI models and developers working on the TiTEC Automation website.  
> Read these files to understand the architecture, patterns, and conventions before making changes.

## 📋 Documentation Index

| File | Contents |
|------|-----------|
| [ENVIRONMENT-SETUP.md](./ENVIRONMENT-SETUP.md) | **MANDATORY**: Runtime versions, device environment fix (Node 20+ requirement for Vite 7 / Next 16), subshell fix |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level system overview, tech stack, entity relationships, environment setup, deployment |
| [FRONTEND.md](./FRONTEND.md) | Next.js App Router structure, components, state management, API communication, styling |
| [BACKEND.md](./BACKEND.md) | Laravel models, controllers, auth (Sanctum), mail system, file storage, database |
| [API-REFERENCE.md](./API-REFERENCE.md) | Complete REST API endpoint reference with request/response examples |
| [BEST-PRACTICES.md](./BEST-PRACTICES.md) | Coding conventions, security warnings, deployment checklist, common pitfalls |
| [SEO.md](./SEO.md) | SEO & AI search optimization: JSON-LD schemas, metadata conventions, robots.txt bot rules, sitemap strategy, ISR |

## 🚀 Quick Start for AI Agents

1. **FIRST & MANDATORY**: Verify and fix the device runtime environment using [ENVIRONMENT-SETUP.md](./ENVIRONMENT-SETUP.md) (or run `bash .AI/scripts/ensure-env.sh`). Node.js MUST be `>= 20.19.0` (Node 18 will crash Vite 7).
2. **Start with** `ARCHITECTURE.md` to understand the system high-level
3. **For frontend changes** → Read `FRONTEND.md` then `API-REFERENCE.md`
4. **For backend changes** → Read `BACKEND.md` then `API-REFERENCE.md`
5. **Before any change** → Check `BEST-PRACTICES.md` for conventions and pitfalls
6. **For SEO / metadata / JSON-LD changes** → Read `SEO.md` first

## ⚡ Key Facts

- **Runtimes Required**: Node.js `>= 20.19.0` (e.g. `v20.20.2+`), PHP `>= 8.2`, Composer `>= 2.2`
- **Frontend**: Next.js 16, React 19, TailwindCSS v4, TypeScript
- **Backend**: Laravel 12, Vite 7, PHP 8.2+, MySQL, Sanctum Bearer Tokens
- **Two route groups**: `(admin)` for admin panel, `(client)` for public site
- **Auth**: Bearer tokens stored in localStorage, NOT cookie-based
- **Hosting**: cPanel (custom `server.js` for Next.js)
