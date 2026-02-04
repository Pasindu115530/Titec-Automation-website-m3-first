import Link from 'next/link';
import "./globals.css";

export default function NotFound() {
    return (
        <html lang="en">
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4 text-center">
                    {/* 404 Text */}
                    <h1 className="text-9xl font-bold text-gray-200 select-none">404</h1>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-4">
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                            Page Not Found
                        </h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL?
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Go Back Home
                        </Link>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-10 text-sm text-gray-400">
                        TiTEC Automation
                    </div>
                </div>
            </body>
        </html>
    );
}
