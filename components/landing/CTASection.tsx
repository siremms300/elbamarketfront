import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-elba-primary relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-elba-secondary/10 rounded-full blur-[200px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Ready to Source Smarter?
        </h2>
        <p className="mt-4 text-lg lg:text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
          Join thousands of farmers and buyers already moving commodities efficiently across Nigeria.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/market"
            className="group flex items-center gap-2 bg-elba-secondary hover:bg-elba-secondary-light text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all shadow-xl shadow-elba-secondary/25 hover:shadow-elba-secondary/40 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            Browse Commodities
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all w-full sm:w-auto justify-center"
          >
            Register as Farmer
          </Link>
        </div>
      </div>
    </section>
  );
}





















































































// import Link from 'next/link';
// import { ArrowRight } from 'lucide-react';

// export default function CTASection() {
//   return (
//     <section className="py-20 sm:py-28 bg-elba-primary">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h2 className="text-3xl sm:text-4xl font-bold text-white">
//           Ready to Source Smarter?
//         </h2>
//         <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
//           Join thousands of buyers and farmers already using Elba Market to move agricultural commodities efficiently.
//         </p>
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
//           <Link
//             href="/market"
//             className="bg-elba-secondary hover:bg-elba-secondary-light text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
//           >
//             Browse Commodities
//             <ArrowRight className="w-5 h-5" />
//           </Link>
//           <button className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors w-full sm:w-auto">
//             Register as Farmer
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }