// client/app/admin/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/login');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elba-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <AdminSidebar />
      <AdminHeader />
      <main className="pt-16 lg:pl-64 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}





























































// // client/app/admin/layout.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import AdminSidebar from '@/components/admin/AdminSidebar';
// import AdminHeader from '@/components/admin/AdminHeader';

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const { isAdmin, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !isAdmin) {
//       router.push('/login');
//     }
//   }, [loading, isAdmin, router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
//         <div className="animate-pulse text-gray-400">Loading...</div>
//       </div>
//     );
//   }

//   if (!isAdmin) return null;

//   return (
//     <div className="min-h-screen bg-[#f8faf9]">
//       <AdminSidebar />
//       <AdminHeader />
//       <main className="pt-16 lg:pl-64 transition-all duration-300">
//         <div className="p-4 sm:p-6 lg:p-8">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }


























































// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import AdminSidebar from '@/components/admin/AdminSidebar';
// import AdminHeader from '@/components/admin/AdminHeader';

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const { isAdmin, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !isAdmin) {
//       router.push('/login');
//     }
//   }, [loading, isAdmin, router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
//         <div className="animate-pulse text-gray-400">Loading...</div>
//       </div>
//     );
//   }

//   if (!isAdmin) return null;

//   return (
//     <div className="min-h-screen bg-[#f8faf9] flex">
//       {/* Sidebar */}
//       <AdminSidebar />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col lg:pl-64">
//         <AdminHeader />
//         <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }