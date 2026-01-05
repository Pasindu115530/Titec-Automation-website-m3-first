"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '../assets/titec-logo.svg';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const { setIsOpen, totalItems } = useCart();

  return (
    <header
      className={`site-header glass-effect ${pathname === '/' ? 'absolute top-0 left-1/2 z-50 m-4 -translate-x-1/2' : 'shadow-sm relative'}`}
      style={{ fontFamily: 'Poppins, sans-serif', maxWidth: 'calc(100% - 2rem)' }}
    >
      <div className="mx-auto px-45 py-4 flex items-center w-full gap-25">
        <img src={logo.src} className="logo-img" alt="TiTEC-Automation-Solutions-logo" width="64" height="64" style={{ transform: 'scale(2.8)' }} />
        <div className="flex items-center gap-12">
        </div>

        {/* Navigation - desktop */}
        <nav className="hidden md:flex ml-14 flex-1">
          <ul className="flex gap-10 items-center text-gray-600 font-medium">
            <li><Link className="nav-link" style={pathname === '/' ? { color: '#0C2340' } : {}} href="/">Home</Link></li>
            <li><Link className="nav-link" style={pathname === '/store' ? { color: '#0C2340' } : {}} href="/store">Store</Link></li>
            <li><Link className="nav-link" style={pathname === '/about' ? { color: '#0C2340' } : {}} href="/about">About</Link></li>
            <li><Link className="nav-link" style={pathname === '/contact' ? { color: '#0C2340' } : {}} href="/contact">Contact</Link></li>
            <li><Link className="nav-link" style={pathname === '/faq' ? { color: '#0C2340' } : {}} href="/faq">FAQ</Link></li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              {!isAdmin && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Quotation Cart"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              )}
              <div className="hidden md:flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.firstName}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="button-1">Login</Link>
              <Link href="/register" className="hidden md:block px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Register</Link>
            </>
          )}

          {/* Mobile hamburger (visual only) */}
          <button aria-label="menu" className="md:hidden p-2 rounded-md bg-gray-100">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </header>
  )
}