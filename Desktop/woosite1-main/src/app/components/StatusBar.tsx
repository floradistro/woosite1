"use client"

import { usePWA } from '../../hooks/usePWA';

export default function StatusBar() {
  const { isPWA } = usePWA();

  // Only show in PWA mode
  if (!isPWA) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[200]"
      style={{
        height: 'env(safe-area-inset-top)',
        backgroundColor: 'rgba(74, 74, 74, 0.01)', // Almost transparent
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        backdropFilter: 'saturate(180%) blur(20px)',
      }}
    >
      {/* Subtle gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />
      
      {/* Very subtle bottom border */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />
    </div>
  );
} 