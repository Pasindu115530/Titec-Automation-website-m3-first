# TiTEC Automation - AI Agent Operational Guidelines

> **MANDATORY DIRECTIVE FOR ALL AI AGENTS**:
> Read the project intelligence files in the [`.AI/`](.AI/README.md) directory before making changes or running commands.

---

## 🚨 [CRITICAL] 1. Device Runtime Environment Verification

Before executing `composer run dev`, `npm run dev`, `npm run build`, or any test commands, you **MUST** verify and fix the host device's runtime environment:

- **Node.js**: Must be **`>= 20.19.0`** (Recommended: **`v20.20.2+`**).
  - ⚠️ **DO NOT USE Node 18 (`v18.19.1`)**. Vite 7 (`backend-laravel`) will crash with `TypeError: crypto.hash is not a function`.
- **PHP**: Must be **`>= 8.2`** (Laravel 12 requirement).
- **Composer**: Must be **`>= 2.2`**.

### 🛠️ One-Command Auto-Fix for Your Host Device:
```bash
bash .AI/scripts/ensure-env.sh
```
This automatically configures NVM, sets Node 20 as default, updates subshell symlinks in `~/.local/bin/`, and clears the bash hash table.

📖 Complete details: [`.AI/ENVIRONMENT-SETUP.md`](.AI/ENVIRONMENT-SETUP.md)

---

## 📚 2. Project Documentation Index

- [`.AI/ENVIRONMENT-SETUP.md`](.AI/ENVIRONMENT-SETUP.md) — Runtime versions, device fix, subshell compatibility.
- [`.AI/README.md`](.AI/README.md) — Documentation index and quick start guide.
- [`.AI/ARCHITECTURE.md`](.AI/ARCHITECTURE.md) — System architecture, database schema, tech stack.
- [`.AI/BEST-PRACTICES.md`](.AI/BEST-PRACTICES.md) — Coding conventions, security guidelines, common pitfalls.
- [`.AI/FRONTEND.md`](.AI/FRONTEND.md) — Next.js 16 frontend guidelines (`frontend-next`).
- [`.AI/ERP-FRONTEND.md`](.AI/ERP-FRONTEND.md) — Next.js 16 ERP frontend guidelines (`frontend-erp`).
- [`.AI/BACKEND.md`](.AI/BACKEND.md) — Laravel 12 API backend guidelines (`backend-laravel`).
- [`.AI/API-REFERENCE.md`](.AI/API-REFERENCE.md) — API endpoints reference.
