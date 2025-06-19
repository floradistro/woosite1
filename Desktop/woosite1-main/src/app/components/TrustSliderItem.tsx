import React from 'react';

interface TrustSliderItemProps {
  title: string;
  description: string;
  accent: string;
  topLineClass: string;
  bottomLineClass: string;
  gradientClass: string;
  hoverClass: string;
  index: number;
}

const TrustSliderItem: React.FC<TrustSliderItemProps> = ({
  title,
  description,
  accent,
  topLineClass,
  bottomLineClass,
  gradientClass,
  hoverClass,
  index
}) => {
  return (
    <div 
      className="flex-none w-screen md:w-1/3 lg:w-1/4 snap-center opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]" 
      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
    >
      <div className="bg-gradient-to-br from-white/5 to-white/3 hover:from-white/8 hover:to-white/5 transition-all duration-200 border-r border-white/10 flex flex-col items-center justify-between p-8 group relative overflow-hidden h-[280px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
        {/* Luxury shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 pointer-events-none"></div>
        
        {/* Colored accent line at top */}
        <div className={`w-16 h-1 ${topLineClass} group-hover:w-20 transition-all duration-300 rounded-full flex-shrink-0`}></div>
        
        {/* Content - Fixed height container for consistent alignment */}
        <div className="text-center flex-1 flex flex-col justify-center w-full py-4 relative z-10">
          <h3 className="text-luxury-xl md:text-luxury-2xl font-extralight text-white/95 group-hover:text-white transition-colors duration-300 leading-tight min-h-[60px] flex items-center justify-center tracking-luxury-normal">{title}</h3>
          <div className={`w-20 h-px bg-gradient-to-r from-transparent ${gradientClass} to-transparent mx-auto my-4`}></div>
          <p className="text-white/80 text-luxury-base md:text-luxury-lg leading-relaxed max-w-sm mx-auto group-hover:text-white/90 transition-colors duration-300 font-light tracking-luxury-normal">{description}</p>
        </div>
        
        {/* Colored accent line at bottom */}
        <div className={`w-12 h-0.5 ${bottomLineClass} group-hover:w-16 transition-all duration-300 rounded-full flex-shrink-0`}></div>
        
        {/* Subtle hover effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${hoverClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200`}></div>
      </div>
    </div>
  );
};

export default TrustSliderItem; 