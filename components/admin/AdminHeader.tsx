'use client';

import { useAuth } from '@/context/AuthContext';
import { Bell, Search } from 'lucide-react';

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-30 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-elba-primary">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all"
          />
        </div>

        <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-elba-primary text-white flex items-center justify-center text-sm font-bold">
            {user?.firstName?.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-elba-primary leading-tight">{user?.firstName}</p>
            <p className="text-[10px] text-gray-500 capitalize leading-tight">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
}





























































// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { Bell, Search, Menu } from 'lucide-react';

// export default function AdminHeader() {
//   const { user } = useAuth();
//   const [notifications] = useState(3);

//   return (
//     <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-30 flex items-center justify-between px-4 sm:px-6">
//       <div className="flex items-center gap-4">
//         <h1 className="text-lg font-bold text-elba-primary hidden sm:block">Dashboard</h1>
//       </div>

//       <div className="flex items-center gap-3">
//         {/* Search */}
//         <div className="hidden sm:flex items-center relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-56 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 focus:border-elba-secondary focus:bg-white transition-all"
//           />
//         </div>

//         {/* Notifications */}
//         <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
//           <Bell className="w-5 h-5 text-gray-500" />
//           {notifications > 0 && (
//             <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
//               {notifications}
//             </span>
//           )}
//         </button>

//         {/* User */}
//         <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
//           <div className="w-8 h-8 rounded-full bg-elba-primary text-white flex items-center justify-center text-sm font-bold">
//             {user?.firstName?.charAt(0)}
//           </div>
//           <div className="hidden sm:block">
//             <p className="text-sm font-medium text-elba-primary leading-tight">
//               {user?.firstName} {user?.lastName}
//             </p>
//             <p className="text-[10px] text-gray-500 capitalize leading-tight">
//               {user?.role?.replace('_', ' ')}
//             </p>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }