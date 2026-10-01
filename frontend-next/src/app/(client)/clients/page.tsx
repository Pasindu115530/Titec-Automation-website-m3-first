import { clients } from '@/assets/clients/clients';
import { slugify } from '@/utils/slugify';
import SectionHeader from '@/components/section-header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

export const metadata: Metadata = {
    title: "Our Clients | TiTEC Automation",
    description: "Discover the trusted clients who have partnered with TiTEC Automation for their industrial automation needs.",
    alternates: {
        canonical: `${baseUrl}/clients`,
    },
};

export default function ClientsPage() {
    // De-duplicate clients in case the array has duplicates (it seems it does)
    const uniqueClients = clients.reduce((acc, current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, [] as typeof clients);

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <section className="relative py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <SectionHeader
                            title="Trusted By"
                            highlightedText="INDUSTRY LEADERS"
                            subtitle="We are proud to have partnered with some of the best companies across Sri Lanka."
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {uniqueClients.map((client, index) => (
                            <Link
                                key={index}
                                href={`/clients/${slugify(client.name)}`}
                                className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="h-20 w-full relative flex items-center justify-center mb-4">
                                    <Image
                                        src={client.logo}
                                        alt={client.name}
                                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-600 group-hover:text-(--secondary-blue) transition-colors text-center">
                                    {client.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
}
