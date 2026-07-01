'use client';

import { useAuth } from '@/context/AuthContext';
import WarehouseSidebar from '@/components/warehouse/WarehouseSidebar';
import WarehouseHeader from '@/components/warehouse/WarehouseHeader';

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  // If not logged in, show message (redirect is handled by the child pages)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Please log in to access the warehouse dashboard.</p>
          <a href="/login" className="text-elba-secondary text-sm mt-2 inline-block">Go to Login</a>
        </div>
      </div>
    );
  }

  // Check if user has warehouse access
  const hasAccess = ['warehouse_operator', 'admin', 'super_admin'].includes(user.role);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">You don't have access to the warehouse dashboard.</p>
          <a href="/market" className="text-elba-secondary text-sm mt-2 inline-block">Go to Market</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <WarehouseSidebar />
      <WarehouseHeader />
      <main className="pt-16 lg:pl-64 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}


































































// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import WarehouseSidebar from '@/components/warehouse/WarehouseSidebar';
// import WarehouseHeader from '@/components/warehouse/WarehouseHeader';

// export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
//   const { isWarehouse, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !isWarehouse) {
//       router.push('/login');
//     }
//   }, [loading, isWarehouse, router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
//         <div className="animate-pulse text-gray-400">Loading...</div>
//       </div>
//     );
//   }

//   if (!isWarehouse) return null;

//   return (
//     <div className="min-h-screen bg-[#f8faf9]">
//       <WarehouseSidebar />
//       <WarehouseHeader />
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
// import WarehouseSidebar from '@/components/warehouse/WarehouseSidebar';
// import WarehouseHeader from '@/components/warehouse/WarehouseHeader';

// export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     // Only redirect when loading is complete and user is definitely wrong
//     if (loading) return;
    
//     if (!user) {
//       router.push('/login');
//       return;
//     }
    
//     const allowedRoles = ['warehouse_operator', 'admin', 'super_admin'];
//     if (!allowedRoles.includes(user.role)) {
//       router.push('/login');
//     }
//   }, [loading, user, router]);

//   // Show nothing while loading to prevent flash
//   if (loading || !user) {
//     return (
//       <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
//         <div className="animate-pulse text-gray-400">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8faf9]">
//       <WarehouseSidebar />
//       <WarehouseHeader />
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
// import WarehouseSidebar from '@/components/warehouse/WarehouseSidebar';
// import WarehouseHeader from '@/components/warehouse/WarehouseHeader';

// export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && user?.role !== 'warehouse_operator' && user?.role !== 'admin' && user?.role !== 'super_admin') {
//       router.push('/login');
//     }
//   }, [loading, user, router]);


// // useEffect(() => {
// //   if (!loading && !user) {
// //     router.push('/login');
// //   }
// //   // Temporarily allow all authenticated users for debugging
// // }, [loading, user, router]);




//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
//         <div className="animate-pulse text-gray-400">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8faf9]">
//       <WarehouseSidebar />
//       <WarehouseHeader />
//       <main className="pt-16 lg:pl-64 transition-all duration-300">
//         <div className="p-4 sm:p-6 lg:p-8">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }