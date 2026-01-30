export const getImageUrl = (path?: string | null, fallback: string = '/placeholder-project.jpg'): string => {
    if (!path) return fallback;
    if (path.startsWith('http')) return path;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // If path starts with 'products/' or 'datasheets/', it's in public folder, not storage
    if (cleanPath.startsWith('products/') || cleanPath.startsWith('datasheets/')) {
        return `${backendUrl}/${cleanPath}`;
    }

    // Default to storage for other uploads (if any)
    if (cleanPath.startsWith('storage/')) {
        return `${backendUrl}/${cleanPath}`;
    }

    return `${backendUrl}/storage/${cleanPath}`;
};
