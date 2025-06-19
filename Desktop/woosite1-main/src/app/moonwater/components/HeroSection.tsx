import React from 'react';
import { Check } from 'lucide-react';
import { type ProductFormat } from '../constants';

interface HeroSectionProps {
  format: ProductFormat;
}

export default function HeroSection({ format }: HeroSectionProps) {
  return (
    <>
      {/* Delivery Location - Fixed at very top of page */}
      <div className="fixed top-0 left-0 z-50 opacity-0 animate-[fadeInUp_1s_ease-out_0.1s_forwards]">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-sm">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex items-center gap-1">
            <span className="text-white/70 text-xs">Delivering to </span>
            <span className="text-white font-medium text-xs">Mooresville 28117</span>
            <button className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors duration-300 flex items-center gap-1 ml-1">
              Change
              <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <section className="relative h-48 md:h-56 lg:h-64 overflow-hidden bg-[#4a4a4a] animate-fadeIn"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(0, 150, 255, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(0, 200, 255, 0.06) 0%, transparent 35%),
            radial-gradient(circle at 60% 20%, rgba(100, 180, 255, 0.05) 0%, transparent 30%),
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px',
          animation: 'fadeIn 1.5s ease-out, gridFloat 40s linear infinite, colorShift 15s ease-in-out infinite'
        }}
      >
        {/* Subtle animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 animate-fadeInUp px-6">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-wide transform hover:scale-105 transition-transform duration-200 uppercase">
              {format === 'bottle' ? 'MOONWATER' : 'MULTI-PACKS'}
            </h1>
            <h2 className="text-white/90 text-base md:text-lg lg:text-xl font-light tracking-wide max-w-2xl mx-auto drop-shadow-lg opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              {format === 'bottle' 
                ? 'Nano-emulsion technology. Natural ingredients. Refreshing taste.'
                : 'Stock up & save. Perfect for sharing. Consistent quality.'
              }
            </h2>
            <div className="flex flex-col items-center gap-2 mt-4 opacity-0 animate-fadeInUp" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-cyan-400 font-medium drop-shadow-md hover:text-cyan-300 transition-colors duration-200">✓ 10mg THC</span>
                <span className="text-white/40">•</span>
                <span className="text-cyan-400 font-medium drop-shadow-md hover:text-cyan-300 transition-colors duration-200">✓ Fast Onset</span>
                <span className="text-white/40">•</span>
                <span className="text-cyan-400 font-medium drop-shadow-md hover:text-cyan-300 transition-colors duration-200">✓ Zero Sugar</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add matching animations */}
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
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes gridFloat {
            0% { background-position: 0px 0px; }
            100% { background-position: 40px 40px; }
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
        `}</style>
      </section>

      {/* Quality Banner */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 py-2 text-center z-40">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 px-4">
          <span className="text-white font-medium text-sm md:text-base">✓ Nano-Tech</span>
          <span className="text-white/40">•</span>
          <span className="text-white font-medium text-sm md:text-base">
            ✓ {format === 'bottle' ? 'Natural Taste' : 'Bulk Savings'}
          </span>
          <span className="text-white/40">•</span>
          <span className="text-white font-medium text-sm md:text-base">
            ✓ {format === 'bottle' ? '15min Onset' : 'Share Ready'}
          </span>
        </div>
      </div>
    </>
  );
} 