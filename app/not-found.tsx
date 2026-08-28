// client/app/not-found.tsx
import Link from 'next/link';
import { Sprout, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-elba-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Sprout className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-elba-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-elba-primary mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn-elba-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}