"use client"

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface FlowerQuickViewProps {
  product: {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: any, weight: string) => void;
}

export default function FlowerQuickView({ product, isOpen, onClose, onAddToCart }: FlowerQuickViewProps) {
  const [magnifying, setMagnifying] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [backgroundPos, setBackgroundPos] = useState({ x: 50, y: 50 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setImageLoaded(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage position
    const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));
    
    setMagnifierPos({ x, y });
    setBackgroundPos({ x: xPercent, y: yPercent });
  };

  const handleMouseEnter = () => {
    if (imageLoaded) {
      setMagnifying(true);
    }
  };

  const handleMouseLeave = () => {
    setMagnifying(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full max-h-[90vh] bg-gray-900/95 rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white z-30 bg-black/60 backdrop-blur-sm rounded-full p-2 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Instructions */}
        <div className="absolute top-4 left-4 z-30">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-white/90 text-sm font-medium">
              Hover over image to magnify
            </p>
          </div>
        </div>

        {/* Image container */}
        <div 
          ref={imageRef}
          className="relative w-full h-[70vh] cursor-crosshair bg-black/20"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            quality={95}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Loading indicator */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/60">Loading...</div>
            </div>
          )}

          {/* Desktop Magnifier */}
          {magnifying && imageLoaded && (
            <div
              className="absolute w-64 h-64 border-2 border-emerald-400/60 rounded-full pointer-events-none overflow-hidden shadow-2xl z-20"
              style={{
                left: `${Math.max(10, Math.min(magnifierPos.x - 128, window.innerWidth - 266))}px`,
                top: `${Math.max(10, Math.min(magnifierPos.y - 128, window.innerHeight - 266))}px`,
                backgroundImage: `url(${product.image})`,
                backgroundSize: '500%',
                backgroundPosition: `${backgroundPos.x}% ${backgroundPos.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-0.5 bg-emerald-400/80"></div>
                <div className="absolute w-0.5 h-8 bg-emerald-400/80"></div>
              </div>
            </div>
          )}

          {/* Small preview circle - bottom right */}
          {imageLoaded && (
            <div 
              className="absolute bottom-4 right-4 w-20 h-20 rounded-full border-2 border-emerald-400/60 overflow-hidden bg-black/30 backdrop-blur-sm shadow-lg"
              style={{
                backgroundImage: `url(${product.image})`,
                backgroundSize: '500%',
                backgroundPosition: `${backgroundPos.x}% ${backgroundPos.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent"></div>
              {/* Small crosshair */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-0.5 bg-emerald-400/80"></div>
                <div className="absolute w-0.5 h-2 bg-emerald-400/80"></div>
              </div>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white text-2xl font-light mb-2">{product.title}</h3>
          {product.lineage && (
            <p className="text-white/60 text-sm italic mb-4">{product.lineage}</p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/80">THC: {product.thc}%</span>
            <span className="text-white/80 capitalize">Type: {product.category}</span>
            <span className="text-white/80 capitalize">Vibe: {product.vibe}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 