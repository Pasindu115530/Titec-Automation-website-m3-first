'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { usePathname } from 'next/navigation';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();

  // Dark mode should never affect the login interfaces
  const isLoginPage = pathname === '/' || pathname?.startsWith('/dashboard/login') || pathname?.includes('/login');

  return (
    <NextThemesProvider
      {...props}
      forcedTheme={isLoginPage ? 'light' : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}
