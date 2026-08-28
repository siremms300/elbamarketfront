// client/app/farmer/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import FarmerSidebar from '@/components/farmer/FarmerSidebar';
import FarmerHeader from '@/components/farmer/FarmerHeader';

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

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

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const hasAccess = ['farmer', 'admin', 'super_admin'].includes(user.role);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">You don't have access to the farmer dashboard.</p>
          <a href="/market" className="text-elba-secondary text-sm mt-2 inline-block">Go to Market</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <FarmerSidebar />
      <FarmerHeader />
      <main className="pt-16 lg:pl-64 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}





















































// // client/app/farmer/layout.tsx
// 'use client';

// import { useAuth } from '@/context/AuthContext';
// import FarmerSidebar from '@/components/farmer/FarmerSidebar';
// import FarmerHeader from '@/components/farmer/FarmerHeader';

// export default function FarmerLayout({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
//         <div className="animate-pulse text-gray-400">Loading...</div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500">Please log in to access your dashboard.</p>
//           <a href="/login" className="text-elba-secondary text-sm mt-2 inline-block">Go to Login</a>
//         </div>
//       </div>
//     );
//   }

//   const hasAccess = ['farmer', 'admin', 'super_admin'].includes(user.role);
//   if (!hasAccess) {
//     return (
//       <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500">You don't have access to the farmer dashboard.</p>
//           <a href="/market" className="text-elba-secondary text-sm mt-2 inline-block">Go to Market</a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8faf9]">
//       <FarmerSidebar />
//       <FarmerHeader />
//       <main className="pt-16 lg:pl-64 transition-all duration-300">
//         <div className="p-4 sm:p-6 lg:p-8">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }