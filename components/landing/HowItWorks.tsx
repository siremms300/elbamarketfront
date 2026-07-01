'use client';

import { useEffect, useRef, useState } from 'react';
import { Tractor, Warehouse, Truck, Store, ArrowRight, Shield } from 'lucide-react';

const steps = [
  {
    icon: Tractor,
    title: 'Farmers List Produce',
    description: 'Farmers and cooperatives list their harvest with grade, quantity, location, and asking price. Verified profiles build instant trust with buyers.',
    color: 'bg-elba-primary',
    highlight: 'text-elba-primary',
    bg: 'bg-elba-primary/5',
  },
  {
    icon: Warehouse,
    title: 'Secure Warehouse Storage',
    description: 'Commodities are stored in our network of verified, insured warehouses. Quality inspected, receipted, and ready for immediate release.',
    color: 'bg-elba-secondary',
    highlight: 'text-elba-secondary',
    bg: 'bg-elba-secondary/5',
  },
  {
    icon: Truck,
    title: 'Logistics & Movement',
    description: 'Connect with vetted logistics partners to move commodities from farm gate or warehouse to any destination across the country.',
    color: 'bg-elba-tertiary',
    highlight: 'text-elba-tertiary',
    bg: 'bg-elba-tertiary/5',
  },
  {
    icon: Store,
    title: 'Buyers Source & Purchase',
    description: 'Processors, exporters, and wholesalers browse live supply data, compare landed costs, and source directly from verified suppliers.',
    color: 'bg-elba-primary-light',
    highlight: 'text-elba-primary-light',
    bg: 'bg-elba-primary-light/5',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-32 bg-[#f8faf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-elba-secondary bg-elba-secondary/10 px-4 py-1.5 rounded-full">
            How Elba Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-elba-primary mt-6 tracking-tight">
            From Farm to Market,{' '}
            <span className="text-elba-secondary">Simplified</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            Four steps connecting Africa&apos;s agricultural value chain end-to-end.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`group relative transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 h-full hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                {/* Icon */}
                <div className={`${step.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${step.color.replace('bg-', 'shadow-')}/20`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                {/* Step Number */}
                <span className="text-xs font-bold text-gray-300 mb-2 block">
                  Step {index + 1}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-elba-primary mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>

                {/* Learn more */}
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-elba-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}











































// import { Tractor, Warehouse, Truck, Store, ArrowRight } from 'lucide-react';

// const steps = [
//   {
//     icon: Tractor,
//     title: 'Farmers List Produce',
//     description: 'Farmers and cooperatives list their harvest with grade, quantity, location, and price. Verified profiles build trust.',
//     color: 'bg-elba-primary',
//   },
//   {
//     icon: Warehouse,
//     title: 'Secure Warehouse Storage',
//     description: 'Commodities are stored in our network of verified warehouses. Quality inspected, insured, and receipted.',
//     color: 'bg-elba-secondary',
//   },
//   {
//     icon: Truck,
//     title: 'Logistics & Movement',
//     description: 'Connect with logistics partners to move commodities from farm or warehouse to any destination across the country.',
//     color: 'bg-elba-tertiary',
//   },
//   {
//     icon: Store,
//     title: 'Buyers Source & Purchase',
//     description: 'Processors, exporters, and wholesalers browse live supply data, compare prices, and source directly.',
//     color: 'bg-elba-primary-light',
//   },
// ];

// export default function HowItWorks() {
//   return (
//     <section id="how-it-works" className="py-20 sm:py-28 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center max-w-2xl mx-auto mb-16">
//           <span className="text-sm font-semibold text-elba-secondary uppercase tracking-wider">How Elba Works</span>
//           <h2 className="text-3xl sm:text-4xl font-bold text-elba-primary mt-3">
//             From Farm to Market,{' '}
//             <span className="text-elba-secondary">Simplified</span>
//           </h2>
//           <p className="mt-4 text-gray-600">
//             Four steps connecting Africa&apos;s agricultural value chain end-to-end.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {steps.map((step, index) => (
//             <div key={step.title} className="relative group">
//               <div className="bg-white border border-elba-surface-dark rounded-2xl p-6 sm:p-8 h-full hover:border-elba-secondary/30 hover:shadow-lg transition-all duration-300">
//                 <div className={`${step.color} w-12 h-12 rounded-xl flex items-center justify-center mb-5`}>
//                   <step.icon className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="flex items-center gap-2 mb-3">
//                   <span className="text-xs font-bold text-elba-surface-dark bg-elba-primary px-2 py-0.5 rounded-full">
//                     {index + 1}
//                   </span>
//                 </div>
//                 <h3 className="text-lg font-semibold text-elba-primary mb-2">{step.title}</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
//               </div>

//               {/* Connector arrow between steps (desktop only) */}
//               {index < steps.length - 1 && (
//                 <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
//                   <ArrowRight className="w-6 h-6 text-elba-surface-dark" />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }