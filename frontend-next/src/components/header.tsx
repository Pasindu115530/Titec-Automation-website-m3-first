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
        className={`site-header w-full ${pathname === '/' ? 'fixed top-0 left-0 right-0 z-50' : 'sticky top-0 z-50'}`}
      >
        <div className="w-full">
          {/* Navigation Ribbon - Full Width */}
          <div className="bg-(--background) shadow-md px-6 md:px-12 py-3 flex w-full items-center justify-between relative z-50 min-h-[80px]">
            {/* Logo */}
            <div className="shrink-0 flex items-center justify-center mr-8">
              <Link href="/" className="block">
                <Image
                  src={logo}
                  alt="TiTEC Automation"
                  width={380}
                  height={200}
                  className="object-contain h-20 md:h-24 w-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
                  priority
                />
              </Link>
            </div>


            {/* Navigation - desktop */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex gap-10 items-center text-(--neutral-gray) font-medium text-base">
                <li><Link className={`hover:text-(--blue-hover) transition-colors ${pathname === '/' ? 'text-(--primary-blue) font-bold' : ''}`} href="/">Home</Link></li>
                <li><Link className={`hover:text-(--blue-hover) transition-colors ${pathname === '/projects' ? 'text-(--primary-blue) font-bold' : ''}`} href="/projects">Projects</Link></li>
                <li><Link className={`hover:text-(--blue-hover) transition-colors ${pathname === '/store' ? 'text-(--primary-blue) font-bold' : ''}`} href="/store">Store</Link></li>
                <li><Link className={`hover:text-(--blue-hover) transition-colors ${pathname === '/about' ? 'text-(--primary-blue) font-bold' : ''}`} href="/about">About</Link></li>
                <li><Link className={`hover:text-(--blue-hover) transition-colors ${pathname === '/contact' ? 'text-(--primary-blue) font-bold' : ''}`} href="/contact">Contact</Link></li>
                <li><Link className={`hover:text-(--blue-hover) transition-colors ${pathname === '/faq' ? 'text-(--primary-blue) font-bold' : ''}`} href="/faq">FAQ</Link></li>
              </ul>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors text-(--neutral-gray)"
                aria-label="Quotation Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-(--indicator-red) text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                aria-label="menu"
                className="md:hidden p-2 rounded-md hover:bg-gray-100 text-(--neutral-gray) z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  )}
                </svg>
              </button>
            </div>
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
                    className={`p-3 rounded-lg transition-colors ${pathname === '/' ? 'bg-(--blue-hover)/10 text-(--primary-blue) font-semibold' : 'text-(--neutral-gray) hover:bg-(--neutral-gray-light)'}`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/projects"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/projects' ? 'bg-(--blue-hover)/10 text-(--primary-blue) font-semibold' : 'text-(--neutral-gray) hover:bg-(--neutral-gray-light)'}`}
                  >
                    Projects
                  </Link>
                  <Link
                    href="/store"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/store' ? 'bg-(--blue-hover)/10 text-(--primary-blue) font-semibold' : 'text-(--neutral-gray) hover:bg-(--neutral-gray-light)'}`}
                  >
                    Store
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/about' ? 'bg-(--blue-hover)/10 text-(--primary-blue) font-semibold' : 'text-(--neutral-gray) hover:bg-(--neutral-gray-light)'}`}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/contact' ? 'bg-(--blue-hover)/10 text-(--primary-blue) font-semibold' : 'text-(--neutral-gray) hover:bg-(--neutral-gray-light)'}`}
                  >
                    Contact
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors ${pathname === '/faq' ? 'bg-(--blue-hover)/10 text-(--primary-blue) font-semibold' : 'text-(--neutral-gray) hover:bg-(--neutral-gray-light)'}`}
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