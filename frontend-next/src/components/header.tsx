"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '../assets/titec-logo.svg';

export default function Header() {
  const pathname = usePathname();

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
          <Link href="/store" className="button-1">Visit Store</Link>

          {/* Mobile hamburger (visual only) */}
          <button aria-label="menu" className="md:hidden p-2 rounded-md bg-gray-100">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </header>
  )
}