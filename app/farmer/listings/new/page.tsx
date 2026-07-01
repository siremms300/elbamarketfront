'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ListingForm from '@/components/listings/ListingForm';

export default function FarmerNewListingPage() {
  const { user, token, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) return null;

  return (
    <ListingForm
      userRole={user?.role || 'farmer'}
      token={token || ''}
      backUrl="/farmer"
      successUrl="/farmer/listings"
    />
  );
}



































// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import ListingForm from '@/components/listings/ListingForm';

// export default function FarmerNewListingPage() {
//   const { user, token, isAuthenticated, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.push('/login');
//     }
//   }, [loading, isAuthenticated, router]);

//   if (loading || !isAuthenticated) return null;

//   return (
//     <div className="min-h-screen bg-[#f8faf9] pt-20 pb-12">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6">
//         <ListingForm
//           userRole={user?.role || 'farmer'}
//           token={token || ''}
//           backUrl="/farmer"
//           successUrl="/farmer/listings"
//         />
//       </div>
//     </div>
//   );
// }