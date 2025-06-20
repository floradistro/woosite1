"use client"

import Link from 'next/link';
import Image from 'next/image';
import { buttonStyles } from '@/styles/shared';

interface HeroSectionProps {
  timeUntilDeadline: string;
}

export default function HeroSection({ timeUntilDeadline }: HeroSectionProps) {
  return (
    <>
      {/* Hero Section with clean background */}
      <section 
        className="relative h-48 md:h-56 lg:h-64 overflow-hidden bg-[#4a4a4a] animate-fadeIn"
      >
        {/* Clean overlay */}
        <div className="absolute inset-0"></div>
        
        {/* Hero Text */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center space-y-1 md:space-y-2 animate-fadeInUp max-w-sm md:max-w-none">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-wide transform hover:scale-105 transition-transform duration-200 uppercase">
              <span 
                className="font-graffiti animate-subtle-pulse inline-flex items-center gap-2 md:gap-4 whitespace-nowrap"
                style={{
                  textShadow: `
                    0 5px 15px rgba(0,0,0,0.8),
                    0 10px 30px rgba(0,0,0,0.6),
                    0 15px 45px rgba(0,0,0,0.4)
                  `
                }}
              >
                <span>flora</span>
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  width={80} 
                  height={80} 
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain flex-shrink-0 self-center drop-shadow-2xl"
                  style={{ 
                    verticalAlign: 'middle',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))'
                  }}
                />
                <span>distro</span>
              </span>
            </h1>
            <h2 className="text-white/90 text-base md:text-lg lg:text-xl font-light tracking-wide max-w-xs md:max-w-2xl mx-auto drop-shadow-lg opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Real Cannabis Anywhere
            </h2>
            <div className="flex flex-col items-center gap-2 mt-2 md:mt-3 opacity-0 animate-fadeInUp" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-2 text-xs md:text-sm">
                <span className="text-emerald-400 font-medium drop-shadow-md hover:text-emerald-300 transition-colors duration-200">✓ Lab Tested</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-400 font-medium drop-shadow-md hover:text-emerald-300 transition-colors duration-200">✓ Farm Direct</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-400 font-medium drop-shadow-md hover:text-emerald-300 transition-colors duration-200">✓ Ships Today</span>
              </div>
              <Link href="/flower" className={`${buttonStyles.primary} mt-1 md:mt-2`}>
                <span>Shop Now</span>
                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1.2s ease-out;
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
} 