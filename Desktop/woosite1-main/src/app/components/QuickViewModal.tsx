"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface QuickViewProduct {
  id: number;
  title: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  vibe: string;
  thc: number;
  nose?: string | string[];
  lineage?: string;
  terpenes?: string[];
  spotlight?: string;
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: QuickViewProduct, weight: string) => void;
}



export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Refs for smooth animation
  const animationFrameRef = React.useRef<number | undefined>(undefined);
  const targetPositionRef = React.useRef({ x: 0, y: 0 });
  const currentPositionRef = React.useRef({ x: 0, y: 0 });

  // Smooth animation loop
  React.useEffect(() => {
    if (!isDragging) return;

    const smoothingFactor = 0.2; // Higher = faster response, lower = smoother
    
    const animate = () => {
      // Interpolate between current and target position
      currentPositionRef.current.x += (targetPositionRef.current.x - currentPositionRef.current.x) * smoothingFactor;
      currentPositionRef.current.y += (targetPositionRef.current.y - currentPositionRef.current.y) * smoothingFactor;
      
      setMagnifierPosition({
        x: currentPositionRef.current.x,
        y: currentPositionRef.current.y
      });
      
      // Calculate image position for magnification
      const rect = document.querySelector('.magnifier-container')?.getBoundingClientRect();
      if (rect) {
        const imageX = (currentPositionRef.current.x / rect.width) * 100;
        const imageY = (currentPositionRef.current.y / rect.height) * 100;
        setImagePosition({ x: imageX, y: imageY });
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging]);

  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      setScrollPosition(currentScrollY);
      
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${currentScrollY}px`;
      document.body.style.width = '100%';
      
      setImageLoaded(false);
    } else {
      // Restore scrolling and position
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollPosition);
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen, scrollPosition]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Clamp position to stay within image bounds
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    
    // Update target position for smooth interpolation
    targetPositionRef.current = { x, y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    
    // Clamp position to stay within image bounds
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    
    // Update target position for smooth interpolation
    targetPositionRef.current = { x, y };
  };

  const startMagnifying = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setIsMagnifying(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      const touch = e.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    // Clamp position to stay within image bounds
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    
    // Initialize both current and target positions
    targetPositionRef.current = { x, y };
    currentPositionRef.current = { x, y };
    setMagnifierPosition({ x, y });
    
    const imageX = (x / rect.width) * 100;
    const imageY = (y / rect.height) * 100;
    setImagePosition({ x: imageX, y: imageY });
  };

  const stopMagnifying = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDragging(false);
    setIsMagnifying(false);
  };

  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-2xl max-h-[80vh] w-full h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-300 z-20 bg-black/60 backdrop-blur-sm rounded-full p-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div 
          className="relative w-full h-full rounded-lg overflow-hidden bg-white/5 cursor-crosshair magnifier-container"
          style={{ touchAction: 'none' }}
          onClick={(e) => e.stopPropagation()}
          onMouseMove={handleMouseMove}
          onMouseDown={startMagnifying}
          onMouseUp={stopMagnifying}
          onMouseLeave={stopMagnifying}
          onTouchMove={handleTouchMove}
          onTouchStart={startMagnifying}
          onTouchEnd={stopMagnifying}
          onTouchCancel={stopMagnifying}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain select-none"
            quality={95}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Small magnified fisheye view - bottom right corner */}
          {imageLoaded && (
            <div className="absolute bottom-4 right-4 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/40 bg-black/30 backdrop-blur-sm opacity-80 hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg">
              <div 
                className="w-full h-full rounded-full overflow-hidden"
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: '400%',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  filter: 'saturate(1.3) contrast(1.2) brightness(1.1)',
                }}
              >
              </div>
              {/* Subtle lens effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-black/30 pointer-events-none"></div>
            </div>
          )}
          
          {/* Magnifying Glass */}
          {isMagnifying && (
            <>
              {/* Magnifier positioned within image bounds */}
              <div
                className="absolute pointer-events-none border-2 border-white/60 rounded-full shadow-lg z-10"
                style={{
                  width: '200px',
                  height: '200px',
                  left: `${Math.max(0, Math.min(magnifierPosition.x - 100, window.innerWidth - 200))}px`,
                  top: `${Math.max(0, Math.min(magnifierPosition.y - 100, window.innerHeight - 200))}px`,
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: '400% 400%',
                  backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                  backgroundRepeat: 'no-repeat',
                  willChange: 'left, top, background-position',
                  transition: 'none',
                }}
              >
              </div>
              
              {/* Handle directly at finger position */}
              <div 
                className="absolute w-3 h-3 bg-white/90 rounded-full shadow-lg pointer-events-none z-20 border border-white/50"
                style={{
                  left: `${magnifierPosition.x - 6}px`,
                  top: `${magnifierPosition.y - 6}px`,
                  willChange: 'left, top',
                  transition: 'none',
                }}
              >
              </div>
            </>
          )}
          
          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-white/90 text-sm font-medium">
              Drag to magnify (4x zoom)
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h3 className="text-white font-extralight text-xl mb-1">
            {product.title}
          </h3>
          {product.lineage && (
            <p className="text-white/60 text-sm italic">{product.lineage}</p>
          )}
        </div>
      </div>
    </div>
  );
} 