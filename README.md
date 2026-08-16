# Titec Automation Website

This repository contains the source code for the Titec Automation website. It is divided into two main parts:

- **[Frontend](./frontend-next/README.md):** A Next.js application.
- **[Backend](./backend-laravel/README.md):** A Laravel application.

## Getting Started

To get started with development, you will need to set up both the frontend and backend applications. Please refer to their respective README files for detailed instructions:

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
