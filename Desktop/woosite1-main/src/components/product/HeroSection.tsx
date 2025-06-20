import React from 'react';
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

  return (
    <>

      <section className="relative h-48 md:h-56 lg:h-64 overflow-hidden bg-[#4a4a4a] animate-fadeIn">
        {/* Clean overlay */}
        <div className="absolute inset-0"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2 animate-fadeInUp px-6">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-wide transform hover:scale-105 transition-transform duration-200 uppercase">
              {displayTitle}
            </h1>
            <h2 className="text-white/90 text-base md:text-lg lg:text-xl font-light tracking-wide max-w-2xl mx-auto drop-shadow-lg opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              {displaySubtitle}
            </h2>
            <div className="flex flex-col items-center gap-1 mt-2 opacity-0 animate-fadeInUp" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 text-sm">
                {features.map((feature, index) => (
                  <React.Fragment key={index}>
                    <span className="text-emerald-400 font-medium drop-shadow-md hover:text-emerald-300 transition-colors duration-200">
                      ✓ {feature}
                    </span>
                    {index < features.length - 1 && <span className="text-white/40">•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
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
      </section>

      {/* Quality Banner */}
      <div className="bg-black py-2 text-center z-40">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 px-4">
          {qualityBadges.map((badge, index) => (
            <React.Fragment key={index}>
              <span className="text-white font-medium text-sm md:text-base">✓ {badge}</span>
              {index < qualityBadges.length - 1 && <span className="text-white/40">•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
} 