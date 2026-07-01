'use client';

import { useAuth } from '@/context/AuthContext';
import { Bell } from 'lucide-react';

export default function FarmerHeader() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-30 flex items-center justify-between px-4 sm:px-6">
      <h1 className="text-lg font-bold text-elba-primary">My Farm</h1>
      <div className="flex items-center gap-3">
        <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
            {user?.firstName?.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-elba-primary leading-tight">{user?.firstName}</p>
            <p className="text-[10px] text-gray-500 leading-tight">Farmer</p>
          </div>
        </div>
      </div>
    </header>
  );
}