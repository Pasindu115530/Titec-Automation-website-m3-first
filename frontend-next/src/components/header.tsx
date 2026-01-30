"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '../assets/titec-logo.svg';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
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
              <Image src={logo} alt="TiTEC Automation" width={200} height={80} className="object-contain h-14 w-auto" priority />
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
            {/* Cart - visible to guests and non-admins */}
            {!isAdmin && (
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
            )}

            {/* Admin User Menu - Hide for Admins in Client View */}
            {user && !isAdmin && (
              <>
                <div className="hidden md:flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.firstName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full hidden md:flex">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}

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
                {/* Close button is handled by the hamburger which is fixed in header, 
                    but we can add another explicit close inside implementation if needed.
                    Actually, let's keep the header accessible or add a close button here. 
                    Since the header is sticky/fixed, the hamburger toggles it. 
                    But let's add a clear header area here too for better UX if the header scrolls away (though it's sticky).
                */}
              </div>

              <div className="flex flex-col gap-6 mt-16">
                {user && (
                  <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                    <div className="bg-blue-50 p-3 rounded-full">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-2">
                  <Link
                    href="/"
                    className={`p-3 rounded-lg transition-colors ${pathname === '/' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/store"
                    className={`p-3 rounded-lg transition-colors ${pathname === '/store' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Store
                  </Link>
                  <Link
                    href="/projects"
                    className={`p-3 rounded-lg transition-colors ${pathname === '/projects' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Projects
                  </Link>
                  <Link
                    href="/about"
                    className={`p-3 rounded-lg transition-colors ${pathname === '/about' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className={`p-3 rounded-lg transition-colors ${pathname === '/contact' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Contact
                  </Link>
                  <Link
                    href="/faq"
                    className={`p-3 rounded-lg transition-colors ${pathname === '/faq' ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    FAQ
                  </Link>
                </nav>

                {user && (
                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}