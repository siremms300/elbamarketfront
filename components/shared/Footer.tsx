import Link from 'next/link';
import { Sprout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-elba-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <Sprout className="w-5 h-5 text-elba-secondary-light" />
              </div>
              <span className="font-bold text-lg">Elba Market</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Africa&apos;s agricultural operating system. Connecting farmers, warehouses, and buyers across the continent.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <div className="space-y-2.5">
              <Link href="/market" className="block text-sm text-gray-400 hover:text-white transition-colors">Market</Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">For Farmers</Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">For Buyers</Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">Warehouses</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <div className="space-y-2.5">
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">Careers</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-2.5">
              <p className="text-sm text-gray-400">hello@elbamarket.com</p>
              <p className="text-sm text-gray-400">+234 800 000 0000</p>
              <p className="text-sm text-gray-400">Lagos, Nigeria</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Elba Market. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}