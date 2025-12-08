import Link from 'next/link';
import { contacts } from '../assets/clients/Contacts';
import { FaFacebook, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
    const contact = contacts[0];

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
                    <ul className="mt-2 space-y-2">
                        <li>
                            <a href={contact.email} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                                <FaEnvelope className="text-blue-500" />
                                <span>{contact.email}</span>
                            </a>
                        </li>
                        <li>
                            <a href={`tel:${contact.tel}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                                <FaPhone className="text-green-500" />
                                <span>{contact.tel}</span>
                            </a>
                        </li>
                        <li>
                            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                                <FaWhatsapp className="text-green-400" />
                                <span>WhatsApp</span>
                            </a>
                        </li>
                        <li>
                            <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                                <FaFacebook className="text-blue-500" />
                                <span>Facebook</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 text-center text-gray-500 text-sm">
                &copy; 2024 Titec Automation. All rights reserved.
            </div>
        </footer>
    );
}
