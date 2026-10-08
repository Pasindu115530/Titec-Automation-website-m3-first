export async function generateStaticParams() {
    return [{ slug: 'placeholder' }];
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
