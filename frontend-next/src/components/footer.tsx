import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h4 className="font-semibold">Titec Automation</h4>
                    <p className="text-gray-400 mt-2 text-sm">Industrial automation solutions and services.</p>
                </div>

                <div>
                    <h4 className="font-semibold">Quick Links</h4>
                    <ul className="mt-2 text-gray-400 text-sm space-y-1">
                        <li>
                            <Link href="/store" className="hover:text-white">
                                Store
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-white">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-white">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold">Contact</h4>
                    <p className="text-gray-400 text-sm mt-2">Email: info@titec-automation.example</p>
                    <p className="text-gray-400 text-sm">Phone: +1 234 567 890</p>
                </div>
            </div>

            <div className="mt-6 text-center text-gray-500 text-sm">
                &copy; 2024 Titec Automation. All rights reserved.
            </div>
        </footer>
    );
}
