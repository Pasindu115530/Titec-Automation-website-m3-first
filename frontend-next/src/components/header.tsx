"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '../assets/titec-logo.svg';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsOpen, totalItems } = useCart();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`site-header ${pathname === '/' ? 'fixed top-6 left-1/2 z-50 -translate-x-1/2' : 'sticky top-4 z-50 mx-auto my-4'}`}
      >
        <div className="bg-white rounded-full shadow-lg px-8 py-3 flex items-center justify-between w-full relative z-50">

          {/* Logo */}
          <div className="shrink-0">
            <Link href="/">
              <Image src={logo} alt="TiTEC Automation" width={200} height={80} className="object-contain h-20 w-auto" style={{ width: 'auto', height: 'auto' }} priority />
            </Link>
          </div>

          {/* Navigation - desktop */}
          <nav className="hidden md:flex flex-1 justify-center ml-8">
            <ul className="flex gap-8 items-center text-gray-600 font-medium text-sm">
              <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/' ? 'text-blue-900 font-semibold' : ''}`} href="/">Home</Link></li>
              <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/projects' ? 'text-blue-900 font-semibold' : ''}`} href="/projects">Projects</Link></li>
              <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/store' ? 'text-blue-900 font-semibold' : ''}`} href="/store">Store</Link></li>
              <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/about' ? 'text-blue-900 font-semibold' : ''}`} href="/about">About</Link></li>
              <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/contact' ? 'text-blue-900 font-semibold' : ''}`} href="/contact">Contact</Link></li>
              <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/faq' ? 'text-blue-900 font-semibold' : ''}`} href="/faq">FAQ</Link></li>
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart - visible to everyone */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              aria-label="Quotation Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              aria-label="menu"
              className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600 z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-2xl p-6 md:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex justify-end mb-8">
              </div>

              <div className="flex flex-col gap-6 mt-16">
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/projects"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/projects' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Projects
                  </Link>
                  <Link
                    href="/store"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/store' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Store
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/about' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/contact' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Contact
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/faq' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    FAQ
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}