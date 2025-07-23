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
      {/* Extended dot grid background that flows behind header nav and banner */}
      <div 
        className="fixed top-0 left-0 right-0 z-[-1] opacity-22"
        style={{
          height: 'calc(100vh * 0.4)', // Cover top 40% of viewport
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.45) 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0',
          pointerEvents: 'none'
        }}
      ></div>

      <section className="relative h-64 md:h-72 lg:h-80 overflow-hidden bg-[#4a4a4a] animate-fadeIn">
        {/* Subtle colorful gradient spots */}
        <div className="absolute inset-0 opacity-85">
          <div 
            className="absolute w-48 h-48 md:w-80 md:h-80 rounded-full blur-xl animate-pulse"
            style={{
              background: `radial-gradient(circle, rgba(34, 197, 94, 0.45), rgba(16, 185, 129, 0.25) 0%, transparent 70%)`,
              top: '10%',
              left: '5%',
              animationDuration: '4s',
              animationDelay: '0s'
            }}
          ></div>
          <div 
            className="absolute w-40 h-40 md:w-64 md:h-64 rounded-full blur-lg animate-pulse"
            style={{
              background: `radial-gradient(circle, rgba(132, 204, 22, 0.40), rgba(101, 163, 13, 0.22) 0%, transparent 70%)`,
              top: '50%',
              right: '10%',
              animationDuration: '5s',
              animationDelay: '1s'
            }}
          ></div>
          <div 
            className="absolute w-36 h-36 md:w-56 md:h-56 rounded-full blur-lg animate-pulse"
            style={{
              background: `radial-gradient(circle, rgba(22, 163, 74, 0.38), rgba(21, 128, 61, 0.20) 0%, transparent 70%)`,
              top: '0%',
              right: '15%',
              animationDuration: '6s',
              animationDelay: '2s'
            }}
          ></div>
          <div 
            className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full blur-md animate-pulse"
            style={{
              background: `radial-gradient(circle, rgba(74, 222, 128, 0.35), rgba(34, 197, 94, 0.18) 0%, transparent 70%)`,
              bottom: '15%',
              left: '15%',
              animationDuration: '7s',
              animationDelay: '3s'
            }}
          ></div>
          <div 
            className="absolute w-44 h-44 md:w-72 md:h-72 rounded-full blur-xl animate-pulse"
            style={{
              background: `radial-gradient(circle, rgba(20, 184, 166, 0.32), rgba(13, 148, 136, 0.16) 0%, transparent 70%)`,
              top: '35%',
              left: '50%',
              animationDuration: '8s',
              animationDelay: '4s'
            }}
          ></div>
          <div 
            className="absolute w-28 h-28 md:w-44 md:h-44 rounded-full blur-md animate-pulse"
            style={{
              background: `radial-gradient(circle, rgba(5, 150, 105, 0.34), rgba(4, 120, 87, 0.17) 0%, transparent 70%)`,
              top: '20%',
              right: '40%',
              animationDuration: '5.5s',
              animationDelay: '1.5s'
            }}
          ></div>
        </div>

        {/* Local dot grid background for fallback */}
        <div className="absolute inset-0 opacity-22" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.45) 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0'
        }}></div>
        {/* Clean overlay */}
        <div className="absolute inset-0"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center pb-16 md:pb-12">
          <div className="text-center space-y-2 animate-fadeInUp px-6">
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
            <h2 className="text-white/90 text-base md:text-lg lg:text-xl font-light tracking-wide mt-2 drop-shadow-lg opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Real Cannabis Anywhere
            </h2>
            <div className="flex justify-center mt-4 opacity-0 animate-fadeInUp" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              <Link href="/flower" className={`${buttonStyles.primary}`}>
                <span>Shop Now</span>
                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Fresh Quality Banner Overlay */}
        <div 
          className="absolute bottom-0 left-0 right-0 px-4 py-3 md:bottom-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:px-6 md:rounded-full z-50 w-full md:w-auto"
          style={{
            background: 'transparent',
            backdropFilter: 'blur(12px) saturate(200%)',
            WebkitBackdropFilter: 'blur(12px) saturate(200%)',
            backgroundColor: 'rgba(74, 74, 74, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex items-center justify-center gap-2 md:gap-4 text-center">
            <span className="text-white/90 font-medium text-xs md:text-sm lg:text-base">✓ Lab Tested</span>
            <span className="text-white/40">•</span>
            <span className="text-white/90 font-medium text-xs md:text-sm lg:text-base">✓ Farm Direct</span>
            <span className="text-white/40">•</span>
            <span className="text-white/90 font-medium text-xs md:text-sm lg:text-base">✓ Ships Today</span>
          </div>
        </div>
      </section>

        {/* Clean animations */}
        <style>{`
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