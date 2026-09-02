export const getImageUrl = (path?: string | null, fallback: string = '/logo.jpg'): string => {
    if (!path) return fallback;
    if (path.startsWith('http')) return path;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://127.0.0.1:8000';
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // If path starts with 'products/', 'datasheets/', 'projects/', or 'brands/' it's in public folder, not storage
    if (cleanPath.startsWith('products/') || cleanPath.startsWith('datasheets/') || cleanPath.startsWith('projects/') || cleanPath.startsWith('brands/')) {
        return `${backendUrl}/${cleanPath}`;
    }

    // Default to storage for other uploads (if any)
    if (cleanPath.startsWith('storage/')) {
        return `${backendUrl}/${cleanPath}`;
    }

    return `${backendUrl}/storage/${cleanPath}`;
};
