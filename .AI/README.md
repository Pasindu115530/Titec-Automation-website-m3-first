# .AI — Project Intelligence

> Documentation for AI models and developers working on the TiTEC Automation website.  
> Read these files to understand the architecture, patterns, and conventions before making changes.

## 📋 Documentation Index

| File | Contents |
|------|----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level system overview, tech stack, entity relationships, environment setup, deployment |
| [FRONTEND.md](./FRONTEND.md) | Next.js App Router structure, components, state management, API communication, styling |
| [BACKEND.md](./BACKEND.md) | Laravel models, controllers, auth (Sanctum), mail system, file storage, database |
| [API-REFERENCE.md](./API-REFERENCE.md) | Complete REST API endpoint reference with request/response examples |
| [BEST-PRACTICES.md](./BEST-PRACTICES.md) | Coding conventions, security warnings, deployment checklist, common pitfalls |

## 🚀 Quick Start for AI Agents

1. **Start with** `ARCHITECTURE.md` to understand the system high-level
2. **For frontend changes** → Read `FRONTEND.md` then `API-REFERENCE.md`
3. **For backend changes** → Read `BACKEND.md` then `API-REFERENCE.md`
4. **Before any change** → Check `BEST-PRACTICES.md` for conventions and pitfalls

## ⚡ Key Facts

- **Frontend**: Next.js 16, React 19, TailwindCSS v4, TypeScript
- **Backend**: Laravel 12, PHP 8.2, MySQL, Sanctum Bearer Tokens
- **Two route groups**: `(admin)` for admin panel, `(client)` for public site
- **Auth**: Bearer tokens stored in localStorage, NOT cookie-based
- **Hosting**: cPanel (custom `server.js` for Next.js)
