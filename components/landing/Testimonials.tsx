'use client';

import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Elba Market transformed how I sell my maize. I used to wait weeks for middlemen. Now I get fair prices and my goods move within days.",
    author: "Ibrahim Musa",
    role: "Maize Farmer, Kaduna",
    rating: 5,
  },
  {
    quote: "As a processor, I need reliable supply. Elba gives me visibility into available stock across multiple warehouses. It's changed my supply chain completely.",
    author: "Folake Adeyemi",
    role: "Food Processor, Lagos",
    rating: 5,
  },
  {
    quote: "The warehouse receipt system is a game-changer. My soybeans are stored safely, and I can sell to buyers I've never met because the quality is verified.",
    author: "Okonkwo Eze",
    role: "Soybean Farmer, Benue",
    rating: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#f8faf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-elba-tertiary bg-elba-tertiary/10 px-4 py-1.5 rounded-full">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-elba-primary mt-6 tracking-tight">
            Trusted by{' '}
            <span className="text-elba-tertiary">Thousands</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Hear from farmers and buyers already using Elba Market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={`bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-elba-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-elba-primary">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-elba-primary text-sm">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}