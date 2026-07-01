'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  List,
  Plus,
  Sprout,
  LogOut,
  X,
  Menu,
  Warehouse,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/warehouse', icon: LayoutDashboard },
  { label: 'Queue', href: '/warehouse/queue', icon: ClipboardList },
  { label: 'Inventory', href: '/warehouse/inventory', icon: Package },
  { label: 'My Listings', href: '/warehouse/listings', icon: List },
];

export default function WarehouseSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/warehouse') return pathname === '/warehouse';
    return pathname.startsWith(href);
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-elba-primary text-white z-50 transition-transform duration-300 flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 flex-shrink-0">
          <Link href="/warehouse" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-elba-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Warehouse className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm leading-tight block">Warehouse</span>
              <span className="text-[10px] text-white/50 leading-tight block">Operator</span>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-elba-secondary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.firstName?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-white/40 truncate">Warehouse Operator</p>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="px-3 pt-4 pb-1">
          <Link
            href="/warehouse/listings/new"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-elba-secondary text-white hover:bg-elba-secondary-light transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Listing</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                ${isActive(item.href)
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.href) ? 'text-elba-secondary-light' : 'text-white/40 group-hover:text-white/70'}`} />
              <span>{item.label}</span>
              {isActive(item.href) && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-elba-secondary-light rounded-l-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5">
          <Link
            href="/market"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <Sprout className="w-5 h-5" />
            <span>View Market</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full mt-1"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-6 left-6 z-30 lg:hidden w-12 h-12 bg-elba-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-elba-primary-light transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}




































































// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import {
//   LayoutDashboard,
//   ClipboardList,
//   Package,
//   Plus,
//   Sprout,
//   LogOut,
//   X,
//   Menu,
//   Warehouse,
// } from 'lucide-react';

// const navItems = [
//   { label: 'Dashboard', href: '/warehouse', icon: LayoutDashboard },
//   { label: 'Queue', href: '/warehouse/queue', icon: ClipboardList },
//   { label: 'Inventory', href: '/warehouse/inventory', icon: Package },
// ];

// export default function WarehouseSidebar() {
//   const pathname = usePathname();
//   const { user, logout } = useAuth();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const isActive = (href: string) => {
//     if (href === '/warehouse') return pathname === '/warehouse';
//     return pathname.startsWith(href);
//   };

//   return (
//     <>
//       {mobileOpen && (
//         <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
//       )}

//       <aside
//         className={`fixed top-0 left-0 h-full w-64 bg-elba-primary text-white z-50 transition-transform duration-300 flex flex-col
//           ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
//       >
//         {/* Logo */}
//         <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 flex-shrink-0">
//           <Link href="/warehouse" className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-elba-secondary rounded-lg flex items-center justify-center flex-shrink-0">
//               <Warehouse className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <span className="font-bold text-sm leading-tight block">Warehouse</span>
//               <span className="text-[10px] text-white/50 leading-tight block">Operator</span>
//             </div>
//           </Link>
//           <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* User */}
//         <div className="px-4 py-4 border-b border-white/5">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-full bg-elba-secondary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
//               {user?.firstName?.charAt(0)}
//             </div>
//             <div className="min-w-0">
//               <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
//               <p className="text-[10px] text-white/40 truncate">Warehouse Operator</p>
//             </div>
//           </div>
//         </div>

//         {/* Quick Action */}
//         <div className="px-3 pt-4 pb-1">
//           <Link
//             href="/warehouse/listings/new"
//             onClick={() => setMobileOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-elba-secondary text-white hover:bg-elba-secondary-light transition-all"
//           >
//             <Plus className="w-5 h-5" />
//             <span>New Listing</span>
//           </Link>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
//           {navItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               onClick={() => setMobileOpen(false)}
//               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
//                 ${isActive(item.href)
//                   ? 'bg-white/15 text-white'
//                   : 'text-white/60 hover:text-white hover:bg-white/5'
//                 }`}
//             >
//               <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.href) ? 'text-elba-secondary-light' : 'text-white/40 group-hover:text-white/70'}`} />
//               <span>{item.label}</span>
//               {isActive(item.href) && (
//                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-elba-secondary-light rounded-l-full" />
//               )}
//             </Link>
//           ))}
//         </nav>

//         {/* Bottom */}
//         <div className="px-3 py-4 border-t border-white/5">
//           <Link
//             href="/market"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
//           >
//             <Sprout className="w-5 h-5" />
//             <span>View Market</span>
//           </Link>
//           <button
//             onClick={logout}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full mt-1"
//           >
//             <LogOut className="w-5 h-5" />
//             <span>Sign Out</span>
//           </button>
//         </div>
//       </aside>

//       {/* Mobile trigger */}
//       <button
//         onClick={() => setMobileOpen(true)}
//         className="fixed bottom-6 left-6 z-30 lg:hidden w-12 h-12 bg-elba-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-elba-primary-light transition-colors"
//       >
//         <Menu className="w-6 h-6" />
//       </button>
//     </>
//   );
// }