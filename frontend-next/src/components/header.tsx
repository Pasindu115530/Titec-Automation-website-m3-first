"use client";

import Link from 'next/link';
import Image from 'next/image';
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
      className={`site-header ${pathname === '/' ? 'absolute top-6 left-1/2 z-50 -translate-x-1/2' : 'relative my-4 mx-auto'}`}
    >
      <div className={`${pathname === '/faq' ? 'bg-transparent shadow-none' : 'bg-white shadow-lg'} rounded-full px-8 py-3 flex items-center justify-between w-full`}>

        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image src={logo} alt="TiTEC Automation" width={200} height={80} className="object-contain h-14 w-auto" priority />
          </Link>
        </div>

        {/* Navigation - desktop */}
        <nav className="hidden md:flex flex-1 justify-center ml-8">
          <ul className="flex gap-8 items-center text-gray-600 font-medium text-sm">
            <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/' ? 'text-blue-900 font-semibold' : ''}`} href="/">Home</Link></li>
            <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/store' ? 'text-blue-900 font-semibold' : ''}`} href="/store">Store</Link></li>
            <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/about' ? 'text-blue-900 font-semibold' : ''}`} href="/about">About</Link></li>
            <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/contact' ? 'text-blue-900 font-semibold' : ''}`} href="/contact">Contact</Link></li>
            <li><Link className={`hover:text-blue-900 transition-colors ${pathname === '/faq' ? 'text-blue-900 font-semibold' : ''}`} href="/faq">FAQ</Link></li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
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
              <div className="hidden md:flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.firstName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/register">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full w-28">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-28">
                  Login
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button aria-label="menu" className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </header >
  )
}