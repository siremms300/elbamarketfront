'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, BarChart3, Search, Play } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-elba-primary">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-elba-secondary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-elba-tertiary/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-elba-primary-light/30 rounded-full blur-[200px]" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm text-white mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-elba-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-elba-secondary-light" />
            </span>
            Live in Nigeria — 5,000+ farmers connected
          </div>

          {/* Heading */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Agricultural&apos;s Trade{' '} */}
            Agricultural Trade{' '}
            <span className="text-elba-secondary-light">Made Simple</span>
          </h1>

          <p
            className={`mt-6 text-lg lg:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            From sourcing produce to warehousing, logistics, and delivery, Elba Market manages the journey so farmers sell more easily and buyers source with confidence.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link
              href="/market"
              className="group flex items-center gap-2 bg-elba-secondary hover:bg-elba-secondary-light text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all shadow-xl shadow-elba-secondary/25 hover:shadow-elba-secondary/40 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              Explore the Market
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all w-full sm:w-auto justify-center">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Trust Signals */}
          <div
            className={`flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-white/50 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-elba-secondary-light" />
              <span>Verified sellers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-elba-secondary-light" />
              <span>Real-time prices</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Search className="w-4 h-4 text-elba-secondary-light" />
              <span>Transparent sourcing</span>
            </div>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {[
              { value: '50+', label: 'Commodities' },
              { value: '36', label: 'States Covered' },
              { value: '5,000+', label: 'Farmers' },
              { value: '10+', label: 'Warehouses' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
              >
                <p className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8faf9] to-transparent" />
    </section>
  );
}






































































// import Link from 'next/link';
// import { ArrowRight, Search, BarChart3, Shield } from 'lucide-react';

// export default function Hero() {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-b from-elba-surface to-white pt-16 pb-20 sm:pt-20 sm:pb-28">
//       {/* Subtle background pattern */}
//       <div className="absolute inset-0 opacity-[0.03]">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `radial-gradient(circle at 25px 25px, #072111 2px, transparent 0)`,
//           backgroundSize: '50px 50px'
//         }} />
//       </div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto text-center">
//           {/* Badge */}
//           <div className="inline-flex items-center gap-2 bg-elba-primary/5 border border-elba-primary/10 rounded-full px-4 py-1.5 text-sm text-elba-primary mb-8">
//             <span className="w-2 h-2 rounded-full bg-elba-secondary animate-pulse" />
//             Now live in Nigeria
//           </div>

//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-elba-primary leading-[1.1]">
//             Africa&apos;s Agricultural{' '}
//             <span className="text-elba-secondary">Operating System</span>
//           </h1>

//           <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
//             Elba Market connects farmers, aggregators, warehouses, logistics providers, 
//             and buyers into one trusted digital ecosystem. Commodities, information, money, 
//             and services move efficiently from production to consumption.
//           </p>

//           {/* Trust signals */}
//           <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-gray-500">
//             <div className="flex items-center gap-1.5">
//               <Shield className="w-4 h-4 text-elba-secondary" />
//               <span>Verified sellers</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <BarChart3 className="w-4 h-4 text-elba-secondary" />
//               <span>Real-time prices</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <Search className="w-4 h-4 text-elba-secondary" />
//               <span>Transparent sourcing</span>
//             </div>
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
//             <Link
//               href="/market"
//               className="btn-elba-primary inline-flex items-center gap-2 px-8 py-3.5 text-base w-full sm:w-auto justify-center"
//             >
//               Explore the Market
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//             <Link
//               href="#how-it-works"
//               className="btn-elba-secondary inline-flex items-center gap-2 px-8 py-3.5 text-base w-full sm:w-auto justify-center"
//             >
//               How It Works
//             </Link>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
//             {[
//               { value: '50+', label: 'Commodities' },
//               { value: '36', label: 'States Covered' },
//               { value: '5,000+', label: 'Farmers' },
//               { value: '10+', label: 'Warehouses' },
//             ].map((stat) => (
//               <div key={stat.label} className="bg-white rounded-xl p-4 border border-elba-surface-dark">
//                 <p className="text-2xl sm:text-3xl font-bold text-elba-primary">{stat.value}</p>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }