// client/app/ClientLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Routes that have their own layout
  // and therefore don't use the global Navbar/Footer.
  const isDashboard =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/warehouse') ||
    pathname?.startsWith('/farmer') ||
    pathname?.startsWith('/buyer');

  return (
    <AuthProvider>
      {isDashboard ? (
        <>{children}</>
      ) : (
        <>
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </>
      )}
    </AuthProvider>
  );
}