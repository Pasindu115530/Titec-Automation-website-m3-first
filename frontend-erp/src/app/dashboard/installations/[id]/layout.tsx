import React from 'react';

// For Next.js static export with dynamic routes, we need a generateStaticParams
// Since this is a dashboard route and likely CSR fetched on demand, we return 
// a dummy array to satisfy the build, or if we don't have this, the build fails.
export async function generateStaticParams() {
    return [{ id: '1' }, { id: 'new' }]; 
}

export default function InstallationDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
