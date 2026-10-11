# Titec Automation Website

This repository contains the source code for the Titec Automation website. It is divided into two main parts:

- **[Frontend](./frontend-next/README.md):** A Next.js application.
- **[Backend](./backend-laravel/README.md):** A Laravel application.

## Quick Start (Start All Services)

### Windows (PowerShell / CMD)
```powershell
.\start-dev.ps1
# or
.\start-dev.bat
```

### Linux / macOS / Git Bash
```bash
./start-dev.sh
```

This launches all 4 services:
1. **Laravel API** (`http://127.0.0.1:8000`)
2. **Queue Worker** (`php artisan queue:work`)
3. **Frontend Store** (`http://localhost:3000`)
4. **Frontend ERP** (`http://localhost:3001`)

## Getting Started Manually

### Frontend (Next.js)

Navigate to the `frontend-next` directory to run the Next.js development server:

```bash
cd frontend-next
npm run dev
# or yarn dev, pnpm dev, bun dev
```

See the [Frontend README](./frontend-next/README.md) for more details.

### Backend (Laravel)

Navigate to the `backend-laravel` directory to set up and run the Laravel development server.

```bash
cd backend-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

See the [Backend README](./backend-laravel/README.md) for more details.
