import React from 'react';
import Image from 'next/image';
import { ProductType } from '@/app/components/ProductCollectionConfig';

interface HeroSectionProps {
  productType: ProductType;
  format?: string;
  title: {
    primary: string;
    secondary?: string;
  };
  subtitle: {
    primary: string;
    secondary?: string;
  };
  features: string[];
  qualityBadges: string[];
}

export default function HeroSection({ 
  productType, 
  format, 
  title, 
  subtitle, 
  features, 
  qualityBadges 
}: HeroSectionProps) {
  // Get the display title based on format
  const displayTitle = format === 'flower' || format === 'single' || !format 
    ? title.primary 
    : title.secondary || title.primary;
    
  const displaySubtitle = format === 'flower' || format === 'single' || !format
    ? subtitle.primary
    : subtitle.secondary || subtitle.primary;

  // Product-specific color schemes
  const getColorScheme = () => {
    switch (productType) {
      case 'flower':
        return {
          primary: 'rgba(34, 197, 94, 0.45), rgba(16, 185, 129, 0.25)', // Green
          secondary: 'rgba(132, 204, 22, 0.40), rgba(101, 163, 13, 0.22)', // Lime
          tertiary: 'rgba(22, 163, 74, 0.38), rgba(21, 128, 61, 0.20)', // Emerald
          quaternary: 'rgba(74, 222, 128, 0.35), rgba(34, 197, 94, 0.18)', // Light green
          quinary: 'rgba(20, 184, 166, 0.32), rgba(13, 148, 136, 0.16)', // Teal
          senary: 'rgba(5, 150, 105, 0.34), rgba(4, 120, 87, 0.17)' // Dark teal
        };
      case 'edible':
        return {
          primary: 'rgba(236, 72, 153, 0.45), rgba(219, 39, 119, 0.25)', // Pink
          secondary: 'rgba(168, 85, 247, 0.40), rgba(147, 51, 234, 0.22)', // Purple
          tertiary: 'rgba(244, 114, 182, 0.38), rgba(236, 72, 153, 0.20)', // Light pink
          quaternary: 'rgba(196, 181, 253, 0.35), rgba(168, 85, 247, 0.18)', // Light purple
          quinary: 'rgba(251, 113, 133, 0.32), rgba(244, 63, 94, 0.16)', // Rose
          senary: 'rgba(192, 132, 252, 0.34), rgba(147, 51, 234, 0.17)' // Violet
        };
      case 'vape':
        return {
          primary: 'rgba(59, 130, 246, 0.45), rgba(37, 99, 235, 0.25)', // Blue
          secondary: 'rgba(14, 165, 233, 0.40), rgba(2, 132, 199, 0.22)', // Sky blue
          tertiary: 'rgba(99, 102, 241, 0.38), rgba(79, 70, 229, 0.20)', // Indigo
          quaternary: 'rgba(147, 197, 253, 0.35), rgba(59, 130, 246, 0.18)', // Light blue
          quinary: 'rgba(6, 182, 212, 0.32), rgba(8, 145, 178, 0.16)', // Cyan
          senary: 'rgba(129, 140, 248, 0.34), rgba(99, 102, 241, 0.17)' // Light indigo
        };
      case 'concentrate':
        return {
          primary: 'rgba(245, 158, 11, 0.45), rgba(217, 119, 6, 0.25)', // Amber
          secondary: 'rgba(251, 191, 36, 0.40), rgba(245, 158, 11, 0.22)', // Yellow
          tertiary: 'rgba(239, 68, 68, 0.38), rgba(220, 38, 38, 0.20)', // Red
          quaternary: 'rgba(252, 211, 77, 0.35), rgba(251, 191, 36, 0.18)', // Light yellow
          quinary: 'rgba(249, 115, 22, 0.32), rgba(234, 88, 12, 0.16)', // Orange
          senary: 'rgba(248, 113, 113, 0.34), rgba(239, 68, 68, 0.17)' // Light red
        };
      case 'moonwater':
        return {
          primary: 'rgba(14, 165, 233, 0.45), rgba(2, 132, 199, 0.25)', // Sky blue
          secondary: 'rgba(6, 182, 212, 0.40), rgba(8, 145, 178, 0.22)', // Cyan
          tertiary: 'rgba(59, 130, 246, 0.38), rgba(37, 99, 235, 0.20)', // Blue
          quaternary: 'rgba(125, 211, 252, 0.35), rgba(56, 189, 248, 0.18)', // Light sky
          quinary: 'rgba(34, 211, 238, 0.32), rgba(6, 182, 212, 0.16)', // Light cyan
          senary: 'rgba(147, 197, 253, 0.34), rgba(59, 130, 246, 0.17)' // Very light blue
        };
      default:
        return {
          primary: 'rgba(156, 163, 175, 0.45), rgba(107, 114, 128, 0.25)', // Gray
          secondary: 'rgba(209, 213, 219, 0.40), rgba(156, 163, 175, 0.22)', // Light gray
          tertiary: 'rgba(75, 85, 99, 0.38), rgba(55, 65, 81, 0.20)', // Dark gray
          quaternary: 'rgba(229, 231, 235, 0.35), rgba(209, 213, 219, 0.18)', // Very light gray
          quinary: 'rgba(107, 114, 128, 0.32), rgba(75, 85, 99, 0.16)', // Medium gray
          senary: 'rgba(156, 163, 175, 0.34), rgba(107, 114, 128, 0.17)' // Gray variant
        };
    }
  };

  const colors = getColorScheme();

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

      <section className="relative h-48 md:h-56 lg:h-64 overflow-hidden bg-[#4a4a4a] animate-fadeIn">
        {/* Subtle colorful gradient spots */}
        <div className="absolute inset-0 opacity-85">
          <div 
            className="absolute w-48 h-48 md:w-80 md:h-80 rounded-full blur-xl animate-pulse"
            style={{
              background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
              top: '10%',
              left: '5%',
              animationDuration: '4s',
              animationDelay: '0s'
            }}
          ></div>
          <div 
            className="absolute w-40 h-40 md:w-64 md:h-64 rounded-full blur-lg animate-pulse"
            style={{
              background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
              top: '50%',
              right: '10%',
              animationDuration: '5s',
              animationDelay: '1s'
            }}
          ></div>
          <div 
            className="absolute w-36 h-36 md:w-56 md:h-56 rounded-full blur-lg animate-pulse"
            style={{
              background: `radial-gradient(circle, ${colors.tertiary} 0%, transparent 70%)`,
              top: '0%',
              right: '15%',
              animationDuration: '6s',
              animationDelay: '2s'
            }}
          ></div>
          <div 
            className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full blur-md animate-pulse"
            style={{
              background: `radial-gradient(circle, ${colors.quaternary} 0%, transparent 70%)`,
              bottom: '15%',
              left: '15%',
              animationDuration: '7s',
              animationDelay: '3s'
            }}
          ></div>
          <div 
            className="absolute w-44 h-44 md:w-72 md:h-72 rounded-full blur-xl animate-pulse"
            style={{
              background: `radial-gradient(circle, ${colors.quinary} 0%, transparent 70%)`,
              top: '35%',
              left: '50%',
              animationDuration: '8s',
              animationDelay: '4s'
            }}
          ></div>
          <div 
            className="absolute w-28 h-28 md:w-44 md:h-44 rounded-full blur-md animate-pulse"
            style={{
              background: `radial-gradient(circle, ${colors.senary} 0%, transparent 70%)`,
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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2 animate-fadeInUp px-6">
            {productType === 'moonwater' ? (
              <div className="flex flex-col items-center justify-center">
                <Image 
                  src="/icons/wave_reversed.webp" 
                  alt="Moonwater" 
                  width={400} 
                  height={120} 
                  className="object-contain transform hover:scale-105 transition-transform duration-200"
                  style={{ 
                    filter: 'brightness(0) invert(1)',
                    maxWidth: '80vw',
                    height: 'auto'
                  }}
                />
                <h2 className="text-white/90 text-base md:text-lg lg:text-xl font-light tracking-wide mt-2 drop-shadow-lg opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                  Pop, sip, float.
                </h2>
              </div>
            ) : (
              <>
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-wide transform hover:scale-105 transition-transform duration-200 uppercase">
                  {displayTitle}
                </h1>
                <h2 className="text-white/90 text-base md:text-lg lg:text-xl font-light tracking-wide max-w-2xl mx-auto drop-shadow-lg opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                  {displaySubtitle}
                </h2>
              </>
            )}
          </div>
        </div>
        
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
          .animate-fadeIn {
            animation: fadeIn 1.5s ease-out;
          }
          .animate-fadeInUp {
            animation: fadeInUp 1.2s ease-out;
          }
        `}</style>

        {/* Fresh Quality Banner Overlay */}
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full z-50"
          style={{
            background: 'transparent',
            backdropFilter: 'blur(12px) saturate(200%)',
            WebkitBackdropFilter: 'blur(12px) saturate(200%)',
            backgroundColor: 'rgba(74, 74, 74, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex items-center justify-center gap-4 md:gap-6">
            {qualityBadges.map((badge, index) => (
              <React.Fragment key={index}>
                <span className="text-white/90 font-medium text-sm md:text-base">✓ {badge}</span>
                {index < qualityBadges.length - 1 && <span className="text-white/40">•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 