'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes that have their own layout (no global navbar/footer)
  const isDashboard = 
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/warehouse') ||
    pathname?.startsWith('/farmer') ||
    pathname?.startsWith('/buyer');

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          {isDashboard ? (
            <>{children}</>
          ) : (
            <>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}






































































// // client/app/layout.tsx
// 'use client';

// import { usePathname } from 'next/navigation';
// import { AuthProvider } from '@/context/AuthContext';
// import Navbar from '@/components/shared/Navbar';
// import Footer from '@/components/shared/Footer';
// import './globals.css';

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const isAdmin = pathname?.startsWith('/admin');

//   return (
//     <html lang="en">
//       <body className="min-h-screen flex flex-col">
//         <AuthProvider>
//           {isAdmin ? (
//             <>{children}</>
//           ) : (
//             <>
//               <Navbar />
//               <main className="flex-1">{children}</main>
//               <Footer />
//             </>
//           )}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }














































































// import type { Metadata } from 'next';
// // import AuthProvider from '@/context/AuthContext'
// import { AuthProvider } from '../context/AuthContext';
// import Navbar from '@/components/shared/Navbar';
// import Footer from '@/components/shared/Footer';
// import './globals.css';

// export const metadata: Metadata = {
//   title: "Elba Market — Africa's Agricultural Operating System",
//   description: 'Connect farmers, warehouses, and buyers across Africa.',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen flex flex-col">
//         <AuthProvider>
//           <Navbar />
//           <main className="flex-1">{children}</main>
//           <Footer />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


























































// import type { Metadata } from 'next';
// import Navbar from '@/components/shared/Navbar';
// import Footer from '@/components/shared/Footer';
// import './globals.css';

// export const metadata: Metadata = {
//   title: 'Elba Market — Africa\'s Agricultural Operating System',
//   description: 'Connect farmers, warehouses, and buyers across Africa. Real-time commodity sourcing, verified supply chains, and seamless agricultural commerce.',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen flex flex-col">
//         <Navbar />
//         <main className="flex-1">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }