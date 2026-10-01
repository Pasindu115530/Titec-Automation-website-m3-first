import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center bg-linear-to-b from-(--hero-gradient-start) to-(--hero-gradient-end)">
                <div className="hero-bg-overlay absolute inset-0 z-0 bg-[url('/hero-bg1.png')] bg-no-repeat bg-center opacity-60 pointer-events-none" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center flex flex-col items-center">
                    <h1 className="text-8xl md:text-9xl font-bold text-(--blue-hover) select-none mb-4 tracking-tighter drop-shadow-sm">
                        4<span className="text-(--secondary-blue)">0</span>4
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium mb-10">
                        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL was mistyped.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 uppercase tracking-wider"
                    >
                        Return Home
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
