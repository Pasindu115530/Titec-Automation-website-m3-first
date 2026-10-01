import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 text-gray-800 px-4 text-center py-20">
            <h1 className="text-6xl font-bold text-gray-300 select-none">404</h1>

            <div className="mt-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                    Admin Route Not Found
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    The requested admin page does not exist.
                </p>
                <Link
                    href="/dashboard/projects"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
