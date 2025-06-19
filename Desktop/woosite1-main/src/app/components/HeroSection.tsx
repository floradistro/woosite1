"use client"

import Link from 'next/link';
import { buttonStyles } from '@/styles/shared';

interface HeroSectionProps {
  timeUntilDeadline: string;
}

export default function HeroSection({ timeUntilDeadline }: HeroSectionProps) {
  return (
    <>
      {/* Hero Section with animated grid background and color spots */}
      <section 
        className="relative h-48 md:h-56 lg:h-64 overflow-hidden bg-[#4a4a4a] animate-fadeIn"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 0, 0, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(0, 100, 255, 0.06) 0%, transparent 35%),
            radial-gradient(circle at 60% 20%, rgba(255, 255, 0, 0.05) 0%, transparent 30%),
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px',
          animation: 'fadeIn 1.5s ease-out, gridFloat 40s linear infinite, colorShift 15s ease-in-out infinite'
        }}
      >
        {/* Subtle animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        
        {/* Hero Text */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center space-y-3 md:space-y-4 animate-fadeInUp max-w-sm md:max-w-none">
            <h1 className="text-white text-3xl md:text-3xl lg:text-4xl font-light tracking-wide transform hover:scale-105 transition-transform duration-200">
              <span className="font-graffiti animate-subtle-pulse">flora distro</span>
            </h1>
            <h2 className="text-white/90 text-sm md:text-lg lg:text-xl font-light tracking-wide max-w-xs md:max-w-2xl mx-auto drop-shadow-lg opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Real Cannabis Anywhere
            </h2>
            <div className="flex flex-col items-center gap-3 mt-3 md:mt-4 opacity-0 animate-fadeInUp" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-2 text-xs md:text-sm">
                <span className="text-emerald-400 font-medium drop-shadow-md hover:text-emerald-300 transition-colors duration-200">✓ Lab Tested</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-400 font-medium drop-shadow-md hover:text-emerald-300 transition-colors duration-200">✓ Farm Direct</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-400 font-medium drop-shadow-md hover:text-emerald-300 transition-colors duration-200">✓ Ships Today</span>
              </div>
              <Link href="/flower" className={`${buttonStyles.primary} mt-2 md:mt-4`}>
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
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gridFloat {
          0% { background-position: 0px 0px; }
          100% { background-position: 40px 40px; }
        }
        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        @keyframes colorShift {
          0%, 100% { 
            background-position: 0% 0%, 100% 100%, 50% 0%, 0px 0px, 0px 0px; 
          }
          33% { 
            background-position: 10% 20%, 90% 80%, 70% 10%, 0px 0px, 0px 0px; 
          }
          66% { 
            background-position: 30% 10%, 70% 90%, 40% 30%, 0px 0px, 0px 0px; 
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1.2s ease-out;
        }
        .animate-shimmer {
          animation: shimmer 6s ease-in-out infinite;
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
} 