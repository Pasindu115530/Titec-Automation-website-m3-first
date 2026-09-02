import { serviceService } from '@/services/serviceService';

export async function generateStaticParams() {
    try {
        const items = await serviceService.getServices();
        if (!items || items.length === 0) return [{ slug: 'placeholder' }];
        return items.map((item: any) => ({
            slug: item.slug || String(item.id),
        }));
    } catch {
        return [{ slug: 'placeholder' }];
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
