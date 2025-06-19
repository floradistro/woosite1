import React from 'react';
import Link from 'next/link';

export default function SubscriptionSection() {
  return (
    <section className="relative py-20 bg-[#3a3a3a] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Main Content */}
        <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-wide mb-4">
            Never Run Out.
          </h2>
          <p className="text-xl text-white/80 font-light mb-8 max-w-2xl mx-auto">
            Monthly flower drops. Curated, fresh, and member-priced.
          </p>
          
          {/* CTA Button */}
          <Link 
            href="/subscriptions"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-0 select-none shadow-xl hover:shadow-2xl mb-4"
          >
            Join the Club
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          {/* Secondary Link */}
          <div>
            <Link 
              href="/subscriptions"
              className="text-white/60 hover:text-white text-sm font-light transition-colors duration-200 underline underline-offset-4"
            >
              Explore all subscription plans
            </Link>
          </div>
        </div>
        
        {/* Subtle visual elements */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
      </div>
    </section>
  );
} 