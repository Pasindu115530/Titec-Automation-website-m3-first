import { serviceService } from '@/services/serviceService';

export async function generateStaticParams() {
    try {
        const items = await serviceService.getServices();
        return items.map((item: any) => ({
            slug: item.slug || String(item.id),
        }));
    } catch {
        return [];
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
