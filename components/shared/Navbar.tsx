'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Sprout, ArrowRight, Plus } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileLink = () => {
    setMobileOpen(false);
  };

  // Compute the new listing URL based on role
  const newListingUrl = useMemo(() => {
    if (isAdmin) return '/admin/listings/new';
    if (user?.role === 'warehouse_operator') return '/warehouse/listings/new';
    if (user?.role === 'farmer') return '/farmer/listings/new';
    return '/listings/new'; // fallback
  }, [isAdmin, user?.role]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={handleMobileLink}>
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-elba-primary rounded-xl flex items-center justify-center group-hover:bg-elba-primary-light transition-colors shadow-lg shadow-elba-primary/20">
              <Sprout className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <span
                className={`font-bold text-lg lg:text-xl leading-tight block transition-colors ${
                  scrolled ? 'text-elba-primary' : 'text-white'
                }`}
              >
                Elba
              </span>
              <span
                className={`text-[10px] lg:text-[11px] font-medium leading-tight block -mt-0.5 transition-colors ${
                  scrolled ? 'text-elba-secondary' : 'text-elba-secondary-light'
                }`}
              >
                Market
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/market"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-600 hover:text-elba-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              Market
            </Link>
            <Link
              href="/#how-it-works"
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-600 hover:text-elba-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              How It Works
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium text-elba-tertiary hover:text-elba-tertiary-light transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={newListingUrl}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    scrolled
                      ? 'text-elba-secondary hover:text-elba-secondary-light'
                      : 'text-elba-secondary-light hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  New Listing
                </Link>

                {user?.role === 'farmer' && (
                  <Link
                    href="/farmer"
                    className={`text-sm font-medium transition-colors ${
                      scrolled ? 'text-gray-600 hover:text-elba-primary' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    My Farm
                  </Link>
                )}

                {user?.role === 'warehouse_operator' && (
                  <Link
                    href="/warehouse"
                    className={`text-sm font-medium transition-colors ${
                      scrolled ? 'text-gray-600 hover:text-elba-primary' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    My Warehouse
                  </Link>
                )}

                <span
                  className={`text-sm font-medium ${
                    scrolled ? 'text-gray-600' : 'text-white/80'
                  }`}
                >
                  {user?.firstName}
                </span>
                <button
                  onClick={logout}
                  className={`text-sm font-medium transition-colors ${
                    scrolled
                      ? 'text-gray-500 hover:text-red-500'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors ${
                    scrolled
                      ? 'text-elba-primary hover:text-elba-secondary'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    scrolled
                      ? 'bg-elba-primary text-white hover:bg-elba-primary-light shadow-lg shadow-elba-primary/20'
                      : 'bg-white text-elba-primary hover:bg-white/90 shadow-lg shadow-black/10'
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-elba-primary hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-2xl animate-slide-down">
          <div className="px-4 py-6 space-y-1">
            <Link
              href="/market"
              onClick={handleMobileLink}
              className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
            >
              Market
            </Link>
            <Link
              href="/#how-it-works"
              onClick={handleMobileLink}
              className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
            >
              How It Works
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href={newListingUrl}
                  onClick={handleMobileLink}
                  className="flex items-center gap-2 py-3 px-4 text-sm font-medium text-elba-secondary hover:bg-elba-secondary/5 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Listing
                </Link>

                {user?.role === 'farmer' && (
                  <Link
                    href="/farmer"
                    onClick={handleMobileLink}
                    className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
                  >
                    My Farm
                  </Link>
                )}

                {user?.role === 'warehouse_operator' && (
                  <Link
                    href="/warehouse"
                    onClick={handleMobileLink}
                    className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
                  >
                    My Warehouse
                  </Link>
                )}
              </>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={handleMobileLink}
                className="block py-3 px-4 text-sm font-medium text-elba-tertiary hover:bg-elba-tertiary/5 rounded-xl transition-colors"
              >
                Admin Dashboard
              </Link>
            )}

            <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700">
                    Signed in as <span className="text-elba-primary">{user?.firstName}</span>
                    <span className="text-xs text-gray-500 ml-2 capitalize">({user?.role?.replace('_', ' ')})</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      handleMobileLink();
                    }}
                    className="w-full py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left px-4"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={handleMobileLink}
                    className="block w-full py-3 text-sm font-medium text-elba-primary border border-elba-secondary rounded-xl hover:bg-elba-secondary/5 transition-colors text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={handleMobileLink}
                    className="btn-elba-primary flex items-center justify-center gap-2 w-full py-3 text-sm"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}





































































// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { Menu, X, Sprout, ArrowRight, Plus } from 'lucide-react';

// export default function Navbar() {
//   const { isAuthenticated, isAdmin, user, logout } = useAuth();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleMobileLink = () => {
//     setMobileOpen(false);
//   };

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
//           : 'bg-transparent border-b border-transparent'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2.5 group" onClick={handleMobileLink}>
//             <div className="w-9 h-9 lg:w-10 lg:h-10 bg-elba-primary rounded-xl flex items-center justify-center group-hover:bg-elba-primary-light transition-colors shadow-lg shadow-elba-primary/20">
//               <Sprout className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//             </div>
//             <div>
//               <span
//                 className={`font-bold text-lg lg:text-xl leading-tight block transition-colors ${
//                   scrolled ? 'text-elba-primary' : 'text-white'
//                 }`}
//               >
//                 Elba
//               </span>
//               <span
//                 className={`text-[10px] lg:text-[11px] font-medium leading-tight block -mt-0.5 transition-colors ${
//                   scrolled ? 'text-elba-secondary' : 'text-elba-secondary-light'
//                 }`}
//               >
//                 Market
//               </span>
//             </div>
//           </Link>

//           {/* Desktop Nav Links */}
//           <div className="hidden md:flex items-center gap-6 lg:gap-8">
//             <Link
//               href="/market"
//               className={`text-sm font-medium transition-colors ${
//                 scrolled ? 'text-gray-600 hover:text-elba-primary' : 'text-white/80 hover:text-white'
//               }`}
//             >
//               Market
//             </Link>
//             <Link
//               href="/#how-it-works"
//               className={`text-sm font-medium transition-colors ${
//                 scrolled ? 'text-gray-600 hover:text-elba-primary' : 'text-white/80 hover:text-white'
//               }`}
//             >
//               How It Works
//             </Link>

//             {isAdmin && (
//               <Link
//                 href="/admin"
//                 className="text-sm font-medium text-elba-tertiary hover:text-elba-tertiary-light transition-colors"
//               >
//                 Admin
//               </Link>
//             )}
//           </div>

//           {/* Desktop CTAs */}
//           <div className="hidden md:flex items-center gap-3">
//             {isAuthenticated ? (
//               <>
//                 <Link
//                   href="/listings/new"
//                   className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
//                     scrolled
//                       ? 'text-elba-secondary hover:text-elba-secondary-light'
//                       : 'text-elba-secondary-light hover:text-white'
//                   }`}
//                 >
//                   <Plus className="w-4 h-4" />
//                   New Listing
//                 </Link>
//                 <span
//                   className={`text-sm font-medium ${
//                     scrolled ? 'text-gray-600' : 'text-white/80'
//                   }`}
//                 >
//                   {user?.firstName}
//                 </span>
//                 <button
//                   onClick={logout}
//                   className={`text-sm font-medium transition-colors ${
//                     scrolled
//                       ? 'text-gray-500 hover:text-red-500'
//                       : 'text-white/60 hover:text-white'
//                   }`}
//                 >
//                   Sign Out
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className={`text-sm font-medium transition-colors ${
//                     scrolled
//                       ? 'text-elba-primary hover:text-elba-secondary'
//                       : 'text-white/80 hover:text-white'
//                   }`}
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   href="/register"
//                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
//                     scrolled
//                       ? 'bg-elba-primary text-white hover:bg-elba-primary-light shadow-lg shadow-elba-primary/20'
//                       : 'bg-white text-elba-primary hover:bg-white/90 shadow-lg shadow-black/10'
//                   }`}
//                 >
//                   Get Started
//                   <ArrowRight className="w-4 h-4" />
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile Hamburger */}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className={`md:hidden p-2 rounded-lg transition-colors ${
//               scrolled ? 'text-elba-primary hover:bg-gray-100' : 'text-white hover:bg-white/10'
//             }`}
//           >
//             {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className="md:hidden bg-white border-t border-gray-100 shadow-2xl animate-slide-down">
//           <div className="px-4 py-6 space-y-1">
//             <Link
//               href="/market"
//               onClick={handleMobileLink}
//               className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
//             >
//               Market
//             </Link>
//             <Link
//               href="/#how-it-works"
//               onClick={handleMobileLink}
//               className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
//             >
//               How It Works
//             </Link>

//             {isAuthenticated && (
//               <Link
//                 href="/listings/new"
//                 onClick={handleMobileLink}
//                 className="flex items-center gap-2 py-3 px-4 text-sm font-medium text-elba-secondary hover:bg-elba-secondary/5 rounded-xl transition-colors"
//               >
//                 <Plus className="w-4 h-4" />
//                 New Listing
//               </Link>
//             )}

//             {isAdmin && (
//               <Link
//                 href="/admin"
//                 onClick={handleMobileLink}
//                 className="block py-3 px-4 text-sm font-medium text-elba-tertiary hover:bg-elba-tertiary/5 rounded-xl transition-colors"
//               >
//                 Admin Dashboard
//               </Link>
//             )}

//             <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
//               {isAuthenticated ? (
//                 <>
//                   <div className="px-4 py-2 text-sm font-medium text-gray-700">
//                     Signed in as <span className="text-elba-primary">{user?.firstName}</span>
//                   </div>
//                   <button
//                     onClick={() => {
//                       logout();
//                       handleMobileLink();
//                     }}
//                     className="w-full py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left px-4"
//                   >
//                     Sign Out
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     href="/login"
//                     onClick={handleMobileLink}
//                     className="block w-full py-3 text-sm font-medium text-elba-primary border border-elba-secondary rounded-xl hover:bg-elba-secondary/5 transition-colors text-center"
//                   >
//                     Sign In
//                   </Link>
//                   <Link
//                     href="/register"
//                     onClick={handleMobileLink}
//                     className="btn-elba-primary flex items-center justify-center gap-2 w-full py-3 text-sm"
//                   >
//                     Get Started
//                     <ArrowRight className="w-4 h-4" />
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }



















































// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { Menu, X, Sprout, ArrowRight } from 'lucide-react';

// export default function Navbar() {
//   const { isAuthenticated, isAdmin, user, logout } = useAuth();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleMobileLink = () => {
//     setMobileOpen(false);
//   };

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
//           : 'bg-transparent border-b border-transparent'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2.5 group" onClick={handleMobileLink}>
//             <div className="w-9 h-9 lg:w-10 lg:h-10 bg-elba-primary rounded-xl flex items-center justify-center group-hover:bg-elba-primary-light transition-colors shadow-lg shadow-elba-primary/20">
//               <Sprout className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//             </div>
//             <div>
//               <span
//                 className={`font-bold text-lg lg:text-xl leading-tight block transition-colors ${
//                   scrolled ? 'text-elba-primary' : 'text-white'
//                 }`}
//               >
//                 Elba
//               </span>
//               <span
//                 className={`text-[10px] lg:text-[11px] font-medium leading-tight block -mt-0.5 transition-colors ${
//                   scrolled ? 'text-elba-secondary' : 'text-elba-secondary-light'
//                 }`}
//               >
//                 Market
//               </span>
//             </div>
//           </Link>

//           {/* Desktop Nav Links */}
//           <div className="hidden md:flex items-center gap-6 lg:gap-8">
//             <Link
//               href="/market"
//               className={`text-sm font-medium transition-colors ${
//                 scrolled ? 'text-gray-600 hover:text-elba-primary' : 'text-white/80 hover:text-white'
//               }`}
//             >
//               Market
//             </Link>
//             <Link
//               href="/#how-it-works"
//               className={`text-sm font-medium transition-colors ${
//                 scrolled ? 'text-gray-600 hover:text-elba-primary' : 'text-white/80 hover:text-white'
//               }`}
//             >
//               How It Works
//             </Link>

//             {isAdmin && (
//               <Link
//                 href="/admin"
//                 className="text-sm font-medium text-elba-tertiary hover:text-elba-tertiary-light transition-colors"
//               >
//                 Admin
//               </Link>
//             )}
//           </div>

//           {/* Desktop CTAs */}
//           <div className="hidden md:flex items-center gap-3">
//             {isAuthenticated ? (
//               <>
//                 <span
//                   className={`text-sm font-medium ${
//                     scrolled ? 'text-gray-600' : 'text-white/80'
//                   }`}
//                 >
//                   {user?.firstName}
//                 </span>
//                 <button
//                   onClick={logout}
//                   className={`text-sm font-medium transition-colors ${
//                     scrolled
//                       ? 'text-gray-500 hover:text-red-500'
//                       : 'text-white/60 hover:text-white'
//                   }`}
//                 >
//                   Sign Out
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className={`text-sm font-medium transition-colors ${
//                     scrolled
//                       ? 'text-elba-primary hover:text-elba-secondary'
//                       : 'text-white/80 hover:text-white'
//                   }`}
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   href="/register"
//                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
//                     scrolled
//                       ? 'bg-elba-primary text-white hover:bg-elba-primary-light shadow-lg shadow-elba-primary/20'
//                       : 'bg-white text-elba-primary hover:bg-white/90 shadow-lg shadow-black/10'
//                   }`}
//                 >
//                   Get Started
//                   <ArrowRight className="w-4 h-4" />
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile Hamburger */}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className={`md:hidden p-2 rounded-lg transition-colors ${
//               scrolled ? 'text-elba-primary hover:bg-gray-100' : 'text-white hover:bg-white/10'
//             }`}
//           >
//             {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className="md:hidden bg-white border-t border-gray-100 shadow-2xl animate-slide-down">
//           <div className="px-4 py-6 space-y-1">
//             <Link
//               href="/market"
//               onClick={handleMobileLink}
//               className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
//             >
//               Market
//             </Link>
//             <Link
//               href="/#how-it-works"
//               onClick={handleMobileLink}
//               className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
//             >
//               How It Works
//             </Link>

//             {isAdmin && (
//               <Link
//                 href="/admin"
//                 onClick={handleMobileLink}
//                 className="block py-3 px-4 text-sm font-medium text-elba-tertiary hover:bg-elba-tertiary/5 rounded-xl transition-colors"
//               >
//                 Admin Dashboard
//               </Link>
//             )}

//             <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
//               {isAuthenticated ? (
//                 <>
//                   <div className="px-4 py-2 text-sm font-medium text-gray-700">
//                     Signed in as <span className="text-elba-primary">{user?.firstName}</span>
//                   </div>
//                   <button
//                     onClick={() => {
//                       logout();
//                       handleMobileLink();
//                     }}
//                     className="w-full py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left px-4"
//                   >
//                     Sign Out
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     href="/login"
//                     onClick={handleMobileLink}
//                     className="block w-full py-3 text-sm font-medium text-elba-primary border border-elba-secondary rounded-xl hover:bg-elba-secondary/5 transition-colors text-center"
//                   >
//                     Sign In
//                   </Link>
//                   <Link
//                     href="/register"
//                     onClick={handleMobileLink}
//                     className="btn-elba-primary flex items-center justify-center gap-2 w-full py-3 text-sm"
//                   >
//                     Get Started
//                     <ArrowRight className="w-4 h-4" />
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }






























































// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { Menu, X, Sprout, ArrowRight } from 'lucide-react';

// export default function Navbar() {
//   const { isAuthenticated, isAdmin, user, logout } = useAuth();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Close mobile menu on route change
//   const handleMobileLink = () => {
//     setMobileOpen(false);
//   };

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
//           : 'bg-transparent border-b border-transparent'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2.5 group">
//             <div className="w-9 h-9 lg:w-10 lg:h-10 bg-elba-primary rounded-xl flex items-center justify-center group-hover:bg-elba-primary-light transition-colors shadow-lg shadow-elba-primary/20">
//               <Sprout className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//             </div>
//             <div>
//               <span
//                 className={`font-bold text-lg lg:text-xl leading-tight block transition-colors ${
//                   scrolled ? 'text-elba-primary' : 'text-white'
//                 }`}
//               >
//                 Elba
//               </span>
//               <span
//                 className={`text-[10px] lg:text-[11px] font-medium leading-tight block -mt-0.5 transition-colors ${
//                   scrolled ? 'text-elba-secondary' : 'text-elba-secondary-light'
//                 }`}
//               >
//                 Market
//               </span>
//             </div>
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center gap-6 lg:gap-8">
//             <Link
//               href="/market"
//               className={`text-sm font-medium transition-colors ${
//                 scrolled ? 'text-gray-600 hover:text-elba-primary' : 'text-white/80 hover:text-white'
//               }`}
//             >
//               Market
//             </Link>
//             <Link
//               href="/#how-it-works"
//               className={`text-sm font-medium transition-colors ${
//                 scrolled ? 'text-gray-600 hover:text-elba-primary' : 'text-white/80 hover:text-white'
//               }`}
//             >
//               How It Works
//             </Link>

//             {/* Admin link */}
//             {isAdmin && (
//               <Link
//                 href="/admin"
//                 className="text-sm font-medium text-elba-tertiary hover:text-elba-tertiary-light transition-colors"
//               >
//                 Admin
//               </Link>
//             )}
//           </div>

//           {/* Desktop CTAs */}
//           <div className="hidden md:flex items-center gap-3">
//             {isAuthenticated ? (
//               <>
//                 <span
//                   className={`text-sm font-medium transition-colors ${
//                     scrolled ? 'text-gray-600' : 'text-white/80'
//                   }`}
//                 >
//                   {user?.firstName}
//                 </span>
//                 <button
//                   onClick={logout}
//                   className={`text-sm font-medium transition-colors ${
//                     scrolled
//                       ? 'text-gray-500 hover:text-red-500'
//                       : 'text-white/60 hover:text-white'
//                   }`}
//                 >
//                   Sign Out
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   className={`text-sm font-medium transition-colors ${
//                     scrolled ? 'text-elba-primary hover:text-elba-secondary' : 'text-white/80 hover:text-white'
//                   }`}
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   href="/register"
//                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
//                     scrolled
//                       ? 'bg-elba-primary text-white hover:bg-elba-primary-light shadow-lg shadow-elba-primary/20'
//                       : 'bg-white text-elba-primary hover:bg-white/90 shadow-lg shadow-black/10'
//                   }`}
//                 >
//                   Get Started
//                   <ArrowRight className="w-4 h-4" />
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile Hamburger */}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className={`md:hidden p-2 rounded-lg transition-colors ${
//               scrolled ? 'text-elba-primary hover:bg-gray-100' : 'text-white hover:bg-white/10'
//             }`}
//           >
//             {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className="md:hidden bg-white border-t border-gray-100 shadow-2xl animate-slide-down">
//           <div className="px-4 py-6 space-y-1">
//             <Link
//               href="/market"
//               onClick={handleMobileLink}
//               className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
//             >
//               Market
//             </Link>
//             <Link
//               href="/#how-it-works"
//               onClick={handleMobileLink}
//               className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
//             >
//               How It Works
//             </Link>

//             {isAdmin && (
//               <Link
//                 href="/admin"
//                 onClick={handleMobileLink}
//                 className="block py-3 px-4 text-sm font-medium text-elba-tertiary hover:bg-elba-tertiary/5 rounded-xl transition-colors"
//               >
//                 Admin Dashboard
//               </Link>
//             )}

//             <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
//               {isAuthenticated ? (
//                 <>
//                   <div className="px-4 py-2 text-sm font-medium text-gray-700">
//                     Signed in as <span className="text-elba-primary">{user?.firstName}</span>
//                   </div>
//                   <button
//                     onClick={() => {
//                       logout();
//                       handleMobileLink();
//                     }}
//                     className="w-full py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
//                   >
//                     Sign Out
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     href="/login"
//                     onClick={handleMobileLink}
//                     className="block w-full py-3 text-sm font-medium text-elba-primary border border-elba-secondary rounded-xl hover:bg-elba-secondary/5 transition-colors text-center"
//                   >
//                     Sign In
//                   </Link>
//                   <Link
//                     href="/register"
//                     onClick={handleMobileLink}
//                     className="btn-elba-primary flex items-center justify-center gap-2 w-full py-3 text-sm"
//                   >
//                     Get Started
//                     <ArrowRight className="w-4 h-4" />
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

















































































// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Menu, X, Sprout, ArrowRight } from 'lucide-react';

// export default function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
//           : 'bg-transparent border-b border-transparent'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2.5 group">
//             <div className="w-9 h-9 lg:w-10 lg:h-10 bg-elba-primary rounded-xl flex items-center justify-center group-hover:bg-elba-primary-light transition-colors shadow-lg shadow-elba-primary/20">
//               <Sprout className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//             </div>
//             <div>
//               <span className={`font-bold text-lg lg:text-xl leading-tight block transition-colors ${
//                 scrolled ? 'text-elba-primary' : 'text-white'
//               }`}>
//                 Elba
//               </span>
//               <span className={`text-[10px] lg:text-[11px] font-medium leading-tight block -mt-0.5 transition-colors ${
//                 scrolled ? 'text-elba-secondary' : 'text-elba-secondary-light'
//               }`}>
//                 Market
//               </span>
//             </div>
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center gap-8">
//             {['Market', 'How It Works', 'For Farmers', 'For Buyers'].map((item) => (
//               <Link
//                 key={item}
//                 href={item === 'Market' ? '/market' : `#${item.toLowerCase().replace(/\s+/g, '-')}`}
//                 className={`text-sm font-medium transition-colors ${
//                   scrolled
//                     ? 'text-gray-600 hover:text-elba-primary'
//                     : 'text-white/80 hover:text-white'
//                 }`}
//               >
//                 {item}
//               </Link>
//             ))}
//           </div>

//           {/* Desktop CTAs */}
//           <div className="hidden md:flex items-center gap-3">
//             <button
//               className={`text-sm font-medium transition-colors ${
//                 scrolled ? 'text-elba-primary hover:text-elba-secondary' : 'text-white/80 hover:text-white'
//               }`}
//             >
//               Sign In
//             </button>
//             <Link
//               href="/market"
//               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
//                 scrolled
//                   ? 'bg-elba-primary text-white hover:bg-elba-primary-light shadow-lg shadow-elba-primary/20'
//                   : 'bg-white text-elba-primary hover:bg-white/90 shadow-lg shadow-black/10'
//               }`}
//             >
//               Get Started
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>

//           {/* Mobile Hamburger */}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className={`md:hidden p-2 rounded-lg transition-colors ${
//               scrolled ? 'text-elba-primary hover:bg-gray-100' : 'text-white hover:bg-white/10'
//             }`}
//           >
//             {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className="md:hidden bg-white border-t border-gray-100 shadow-2xl animate-slide-down">
//           <div className="px-4 py-6 space-y-1">
//             {[
//               { label: 'Market', href: '/market' },
//               { label: 'How It Works', href: '#how-it-works' },
//               { label: 'For Farmers', href: '#for-farmers' },
//               { label: 'For Buyers', href: '#for-buyers' },
//             ].map((item) => (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 onClick={() => setMobileOpen(false)}
//                 className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-elba-primary hover:bg-elba-surface rounded-xl transition-colors"
//               >
//                 {item.label}
//               </Link>
//             ))}
//             <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
//               <button className="w-full py-3 text-sm font-medium text-elba-primary border border-elba-secondary rounded-xl hover:bg-elba-secondary/5 transition-colors">
//                 Sign In
//               </button>
//               <Link
//                 href="/market"
//                 onClick={() => setMobileOpen(false)}
//                 className="btn-elba-primary flex items-center justify-center gap-2 w-full py-3 text-sm"
//               >
//                 Get Started
//                 <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }
























































// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { Menu, X, Sprout } from 'lucide-react';

// export default function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-elba-surface-dark">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2.5 group">
//             <div className="w-9 h-9 bg-elba-primary rounded-xl flex items-center justify-center group-hover:bg-elba-primary-light transition-colors">
//               <Sprout className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <span className="font-bold text-lg text-elba-primary leading-tight block">Elba</span>
//               <span className="text-[10px] text-elba-secondary font-medium leading-tight block -mt-0.5">Market</span>
//             </div>
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center gap-8">
//             <Link href="/market" className="text-sm font-medium text-gray-600 hover:text-elba-primary transition-colors">
//               Market
//             </Link>
//             <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-elba-primary transition-colors">
//               How It Works
//             </Link>
//             <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-elba-primary transition-colors">
//               About
//             </Link>
//           </div>

//           {/* Desktop CTAs */}
//           <div className="hidden md:flex items-center gap-3">
//             <button className="text-sm font-medium text-elba-primary hover:text-elba-secondary transition-colors">
//               Sign In
//             </button>
//             <button className="btn-elba-primary text-sm">
//               Get Started
//             </button>
//           </div>

//           {/* Mobile Hamburger */}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className="md:hidden p-2 text-elba-primary"
//           >
//             {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className="md:hidden border-t border-elba-surface-dark bg-white">
//           <div className="px-4 py-4 space-y-3">
//             <Link
//               href="/market"
//               onClick={() => setMobileOpen(false)}
//               className="block py-2 text-sm font-medium text-gray-700 hover:text-elba-primary"
//             >
//               Market
//             </Link>
//             <Link
//               href="#how-it-works"
//               onClick={() => setMobileOpen(false)}
//               className="block py-2 text-sm font-medium text-gray-700 hover:text-elba-primary"
//             >
//               How It Works
//             </Link>
//             <Link
//               href="#about"
//               onClick={() => setMobileOpen(false)}
//               className="block py-2 text-sm font-medium text-gray-700 hover:text-elba-primary"
//             >
//               About
//             </Link>
//             <div className="pt-3 border-t border-elba-surface-dark flex flex-col gap-2">
//               <button className="btn-elba-secondary text-sm w-full">Sign In</button>
//               <button className="btn-elba-primary text-sm w-full">Get Started</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }