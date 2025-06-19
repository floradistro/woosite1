"use client"

import React, { useState, useEffect } from 'react';

interface SectionHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string;
  className?: string;
  delay?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  className = '',
  delay = '0.3s'
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Mouse movement for subtle parallax on desktop (same as Hero)
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMousePosition({ x, y });
      }
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isMobile]);

  // Check if title is "Flora Distro" to apply hero effect
  const isFloraDistroTitle = title === "Flora Distro";

  return (
    <div className={`text-center ${className}`}>
      <div 
        className="opacity-0 animate-[fadeInUp_1s_ease-out_forwards]" 
        style={{ animationDelay: delay }}
      >
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-3"></div>
        
        {isFloraDistroTitle ? (
          // Apply hero effect for Flora Distro title
          <div
            className="relative"
            style={{
              transform: `translate3d(${mousePosition.x * -3}px, ${mousePosition.y * -3}px, 0)`,
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <h2 className="font-graffiti text-2xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6 leading-tight tracking-wider">
              <span 
                className="relative inline-block"
                style={{
                  textShadow: `
                    0 0 30px rgba(255,255,255,0.3),
                    0 5px 15px rgba(0,0,0,0.8),
                    0 10px 30px rgba(0,0,0,0.4)
                  `,
                  filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))'
                }}
              >
                Flora Distro
              </span>
            </h2>
          </div>
        ) : (
          // Regular title styling for other titles
          <h2 
            className="text-white/95 font-extralight text-luxury-2xl md:text-luxury-3xl tracking-luxury-normal mb-3 hover:text-white transition-colors duration-200 cursor-default" 
          >
            {title}
          </h2>
        )}
        
        {subtitle && (
          <p className="text-white/70 font-light text-luxury-base md:text-luxury-lg max-w-xl mx-auto leading-relaxed tracking-luxury-wide mt-3">
            {subtitle}
          </p>
        )}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-3"></div>
      </div>
    </div>
  );
};

export default SectionHeader; 