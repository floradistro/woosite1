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
  productType?: string;
}

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart, productType }: QuickViewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(6); // Default to 6x zoom
  const [previewPosition, setPreviewPosition] = useState({ x: 50, y: 50 }); // For small preview circle
  
  // Mobile pinch-to-zoom states
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMagnifier, setShowMobileMagnifier] = useState(false);
  const [mobileZoom, setMobileZoom] = useState(1); // 1 = no zoom, up to 10
  const [mobileMagnifierCenter, setMobileMagnifierCenter] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [isMultiTouch, setIsMultiTouch] = useState(false);
  const [magnifierSize, setMagnifierSize] = useState(280);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Refs for performance optimization
  const magnifierRef = React.useRef<HTMLDivElement>(null);
  const containerRectRef = React.useRef<DOMRect | null>(null);
  const imageContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Refs for smooth animation
  const animationFrameRef = React.useRef<number | undefined>(undefined);
  const targetPositionRef = React.useRef({ x: 0, y: 0 });
  const currentPositionRef = React.useRef({ x: 0, y: 0 });

  // Smooth animation loop
  React.useEffect(() => {
    if (!isDragging) return;

    const smoothingFactor = 0.3; // Higher = faster response, lower = smoother
    
    const animate = () => {
      // Interpolate between current and target position
      currentPositionRef.current.x += (targetPositionRef.current.x - currentPositionRef.current.x) * smoothingFactor;
      currentPositionRef.current.y += (targetPositionRef.current.y - currentPositionRef.current.y) * smoothingFactor;
      
      setMagnifierPosition({
        x: currentPositionRef.current.x,
        y: currentPositionRef.current.y
      });
      
      // Calculate image position for magnification
      const rect = imageContainerRef.current?.getBoundingClientRect();
      if (rect) {
        const imageX = (currentPositionRef.current.x / rect.width) * 100;
        const imageY = (currentPositionRef.current.y / rect.height) * 100;
        setImagePosition({ x: imageX, y: imageY });
        
        // Update preview position for small circle
        setPreviewPosition({ x: imageX, y: imageY });
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
      document.body.style.overflow = 'hidden';
      setImageLoaded(false);
      // Reset zoom level when modal opens
      setZoomLevel(6);
      setPreviewPosition({ x: 50, y: 50 });
      
      // Detect mobile and show magnifier after a delay
      const checkMobile = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    } else {
      document.body.style.overflow = 'unset';
      setShowMobileMagnifier(false);
      setMobileZoom(1);
      setIsMagnifying(false);
      setIsDragging(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, productType, imageLoaded]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key >= '5' && e.key <= '9') {
        e.preventDefault();
        selectZoom(parseInt(e.key));
      } else if (e.key === '0') {
        e.preventDefault();
        selectZoom(10);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeydown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen, onClose, zoomLevel]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Clamp position to stay within image bounds
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    
    if (isDragging) {
      // Update target position for smooth interpolation
      targetPositionRef.current = { x, y };
    } else {
      // Update preview position even when not dragging for hover effect
      const imageX = (x / rect.width) * 100;
      const imageY = (y / rect.height) * 100;
      setPreviewPosition({ x: imageX, y: imageY });
    }
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
    setPreviewPosition({ x: imageX, y: imageY });
  };

  const stopMagnifying = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDragging(false);
    setIsMagnifying(false);
  };

  // Simple touch handling functions
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length === 0) return { x: 0, y: 0 };
    
    let x = 0, y = 0;
    for (let i = 0; i < touches.length; i++) {
      x += touches[i].clientX;
      y += touches[i].clientY;
    }
    return {
      x: x / touches.length,
      y: y / touches.length
    };
  };

  // Calculate background position for magnifier
  const getBackgroundPosition = (magnifierX: number, magnifierY: number) => {
    const rect = containerRectRef.current;
    if (!rect) return '50% 50%';
    
    // Convert screen coordinates to container-relative coordinates
    const containerX = magnifierX - rect.left;
    const containerY = magnifierY - rect.top;
    
    // Calculate background position
    const bgX = Math.max(0, Math.min(100, (containerX / rect.width) * 100));
    const bgY = Math.max(0, Math.min(100, (containerY / rect.height) * 100));
    
    return `${bgX}% ${bgY}%`;
  };

  const handleMobileTouchStart = React.useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    e.preventDefault();
    const rect = containerRectRef.current || e.currentTarget.getBoundingClientRect();
    containerRectRef.current = rect;
    
    if (e.touches.length === 2) {
      setIsMultiTouch(true);
      setIsInitialLoad(false);
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
      
      const center = getTouchCenter(e.touches);
      setMobileMagnifierCenter(center);
      
      const newSize = Math.max(250, Math.min(320, 280 + (mobileZoom - 1) * 10));
      setMagnifierSize(newSize);
    } else if (e.touches.length === 1 && showMobileMagnifier) {
      const touch = e.touches[0];
      // Simple: magnifier follows finger with slight offset to avoid occlusion
      setMobileMagnifierCenter({
        x: touch.clientX,
        y: touch.clientY - 100 // Offset up to avoid finger
      });
    }
  }, [isMobile, showMobileMagnifier, mobileZoom, getTouchDistance, getTouchCenter]);

  const handleMobileTouchMove = React.useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length === 2 && isMultiTouch) {
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      
      if (lastTouchDistance > 0) {
        const scale = distance / lastTouchDistance;
        const newZoom = Math.max(1, Math.min(10, mobileZoom * scale));
        setMobileZoom(newZoom);
        
        const newSize = Math.max(250, Math.min(320, 280 + (newZoom - 1) * 10));
        setMagnifierSize(newSize);
      }
      
      setMobileMagnifierCenter(center);
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1 && showMobileMagnifier && !isMultiTouch) {
      const touch = e.touches[0];
      // Simple: magnifier follows finger with offset
      setMobileMagnifierCenter({
        x: touch.clientX,
        y: touch.clientY - 100
      });
    }
  }, [isMobile, isMultiTouch, showMobileMagnifier, lastTouchDistance, mobileZoom, getTouchDistance, getTouchCenter]);

  const handleMobileTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile) return;
    
    if (e.touches.length < 2) {
      setIsMultiTouch(false);
      setLastTouchDistance(0);
    }
  };

  if (!isOpen || !product) return null;

  // Calculate zoom configuration based on current zoom level
  const getZoomConfig = () => {
    const size = `${zoomLevel * 100}%`;
    return { size, label: `${zoomLevel}x zoom` };
  };

  const zoomConfig = getZoomConfig();

  // Available zoom levels (reversed order - 10x at top, 5x at bottom)
  const availableZoomLevels = [10, 9, 8, 7, 6, 5];
  
  // Zoom control function
  const selectZoom = (level: number) => {
    setZoomLevel(level);
  };

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
          ref={imageContainerRef}
          className="relative w-full h-full rounded-lg overflow-hidden bg-white/5 cursor-crosshair magnifier-container"
          style={{ touchAction: 'none' }}
          onClick={(e) => e.stopPropagation()}
          onMouseMove={handleMouseMove}
          onMouseDown={startMagnifying}
          onMouseUp={stopMagnifying}
          onMouseLeave={stopMagnifying}
          onTouchMove={isMobile ? handleMobileTouchMove : handleTouchMove}
          onTouchStart={isMobile ? handleMobileTouchStart : startMagnifying}
          onTouchEnd={isMobile ? handleMobileTouchEnd : stopMagnifying}
          onTouchCancel={isMobile ? handleMobileTouchEnd : stopMagnifying}
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
            onLoad={() => {
              setImageLoaded(true);
              // Show mobile magnifier when image loads on mobile
              if (window.innerWidth < 768) {
                setTimeout(() => {
                  setShowMobileMagnifier(true);
                  // Center the magnifier
                  const rect = imageContainerRef.current?.getBoundingClientRect();
                  if (rect) {
                    containerRectRef.current = rect;
                    setMobileMagnifierCenter({
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2
                    });
                  }
                }, 600);
              }
            }}
          />

          {/* Small magnified fisheye view - bottom right corner with dynamic preview */}
          {imageLoaded && (
            <div className="absolute bottom-4 right-4 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-emerald-400/60 bg-black/30 backdrop-blur-sm opacity-80 hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg">
              <div 
                className="w-full h-full rounded-full overflow-hidden"
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: zoomConfig.size,
                  backgroundPosition: `${previewPosition.x}% ${previewPosition.y}%`,
                  backgroundRepeat: 'no-repeat',
                  filter: 'saturate(1.3) contrast(1.2) brightness(1.1)',
                  transition: 'background-position 0.1s ease-out',
                }}
              >
              </div>
              {/* Subtle lens effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 via-transparent to-black/30 pointer-events-none"></div>
              {/* Crosshair indicator */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-3 h-0.5 bg-emerald-400/80 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-0.5 h-3 bg-emerald-400/80 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          )}
          
          {/* Desktop Magnifying Glass */}
          {isMagnifying && !isMobile && (
            <>
              {/* Magnifier positioned relative to viewport */}
              <div
                className="fixed pointer-events-none border-2 border-emerald-400/60 rounded-full shadow-lg z-10"
                style={{
                  width: '300px',
                  height: '300px',
                  left: `${Math.max(10, Math.min(magnifierPosition.x - 150 + (imageContainerRef.current?.getBoundingClientRect()?.left || 0), window.innerWidth - 310))}px`,
                  top: `${Math.max(10, Math.min(magnifierPosition.y - 150 + (imageContainerRef.current?.getBoundingClientRect()?.top || 0), window.innerHeight - 310))}px`,
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: `${zoomConfig.size} ${zoomConfig.size}`,
                  backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                  backgroundRepeat: 'no-repeat',
                  willChange: 'left, top, background-position',
                  transition: 'none',
                }}
              >
                {/* Magnifier crosshair */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-emerald-400/80 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-emerald-400/80 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
              
              {/* Handle directly at cursor position */}
              <div 
                className="absolute w-3 h-3 bg-emerald-400/90 rounded-full shadow-lg pointer-events-none z-20 border border-emerald-400/50"
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

          {/* Mobile Pinch-to-Zoom Magnifier */}
          {isMobile && showMobileMagnifier && (
            <div
              ref={magnifierRef}
              className="fixed pointer-events-none z-50"
              style={{
                left: `${mobileMagnifierCenter.x - magnifierSize/2}px`,
                top: `${mobileMagnifierCenter.y - magnifierSize/2}px`,
                width: `${magnifierSize}px`,
                height: `${magnifierSize}px`,
                willChange: 'transform',
                transform: 'translateZ(0)', // Hardware acceleration
                transition: 'none',
              }}
            >
              {/* Main magnifier circle */}
              <div 
                className="w-full h-full rounded-full border-2 border-emerald-400/60 shadow-xl overflow-hidden relative"
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: `${mobileZoom * 100}%`,
                  backgroundPosition: getBackgroundPosition(mobileMagnifierCenter.x, mobileMagnifierCenter.y),
                  backgroundRepeat: 'no-repeat',
                  filter: 'contrast(1.05) saturate(1.1) brightness(1.02)',
                  willChange: 'background-size, background-position',
                  transform: 'translateZ(0)', // Hardware acceleration
                }}
              >
                {/* Subtle lens effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/10 via-transparent to-black/10 pointer-events-none"></div>
                
                {/* Crosshair for mobile magnifier */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-emerald-400/80 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-emerald-400/80 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                {/* Zoom level indicator - minimal and only when zooming */}
                {isMultiTouch && mobileZoom > 1.2 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className="text-white text-xs font-medium">
                      {mobileZoom.toFixed(1)}×
                    </span>
                  </div>
                )}
                
                {/* Ultra-subtle pinch instruction - only on initial load */}
                {isInitialLoad && mobileZoom <= 1.1 && !isMultiTouch && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/30 backdrop-blur-sm rounded-md px-2 py-0.5 text-center border border-white/5">
                      <div className="text-white/60 text-xs font-light">pinch to zoom</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Instructions */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-white/90 text-sm font-medium">
                <span className="md:hidden">Pinch magnifier to zoom</span>
                <span className="hidden md:inline">Click & drag to magnify • 5-9,0 keys • Hover for preview</span>
              </p>
            </div>
          </div>

          {/* Desktop Zoom Controls - Vertical Column on left side */}
          <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col gap-2">
            {availableZoomLevels.map(level => (
              <button
                key={level}
                onClick={(e) => {
                  e.stopPropagation();
                  selectZoom(level);
                }}
                className={`w-12 h-10 rounded-xl text-sm font-semibold transition-all duration-300 backdrop-blur-md border ${
                  zoomLevel === level
                    ? 'bg-white/90 text-black border-white/50 shadow-lg scale-105'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/50 hover:scale-102 shadow-md'
                }`}
                title={`${level}x zoom`}
              >
                {level}x
              </button>
            ))}
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