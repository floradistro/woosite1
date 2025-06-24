import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Eye } from 'lucide-react';
import { WEIGHT_PRICING, DISPOSABLE_PRICING, WEIGHTS, DISPOSABLE_SIZES, type FeaturedProduct, type ProductFormat } from '../constants';

interface DenseViewProps {
  products: FeaturedProduct[];
  selectedWeights: Record<number, string>;
  loadedImages: Set<number>;
  format: ProductFormat;
  onProductClick: (product: FeaturedProduct) => void;
  onWeightSelect: (productId: number, weight: string) => void;
  onAddToCart: (product: FeaturedProduct, e: React.MouseEvent) => void;
  onImageLoad: (productId: number) => void;
  onClearFilters: () => void;
}

// Product Image Component
const ProductImage = ({ 
  product, 
  isLoaded, 
  format, 
  onLoad, 
  onClick,
  index 
}: {
  product: FeaturedProduct;
  isLoaded: boolean;
  format: ProductFormat;
  onLoad: () => void;
  onClick: (e: React.MouseEvent) => void;
  index: number;
}) => (
  <div 
    className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0 overflow-hidden rounded-lg cursor-pointer group/image bg-black/20"
    onClick={(e) => {
      e.stopPropagation();
      onClick(e);
    }}
  >
    {!isLoaded && (
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-[shimmer_2s_ease-in-out_infinite]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>
    )}
    
    {format === 'disposable' && (
      <div className="absolute top-1 left-0 z-10 p-0">
        <Image
          src="/PRE ROLL.png"
          alt="Disposable indicator"
          width={40}
          height={40}
          className="w-10 h-10"
        />
      </div>
    )}
    
    <Image
      src={product.image}
      alt={format === 'disposable' ? `${product.title} disposable` : product.title}
      fill
      className={`object-cover transition-all duration-300 group-hover:scale-110 group-hover/image:scale-105 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      sizes="80px"
      loading={index < 8 ? "eager" : "lazy"}
      priority={index < 8}
      onLoad={onLoad}
      quality={85}
    />
    
    {/* Simple hover overlay */}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
        <Eye className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

// Product Info Component
const ProductInfo = ({ 
  product, 
  format 
}: {
  product: FeaturedProduct;
  format: ProductFormat;
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'indica': return 'bg-purple-500/20 text-purple-300';
      case 'sativa': return 'bg-green-500/20 text-green-300';
      default: return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const getEffects = (vibe: string) => {
    switch (vibe) {
      case 'relax':
        return [
          { name: 'Relaxed', color: 'purple' },
          { name: 'Sleepy', color: 'indigo', desktop: true },
          { name: 'Calm', color: 'blue', desktop: true }
        ];
      case 'energize':
        return [
          { name: 'Energetic', color: 'green' },
          { name: 'Focused', color: 'yellow', desktop: true },
          { name: 'Creative', color: 'orange', desktop: true }
        ];
      case 'balance':
        return [
          { name: 'Balanced', color: 'emerald' },
          { name: 'Euphoric', color: 'teal', desktop: true },
          { name: 'Uplifted', color: 'cyan', desktop: true }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex-1 min-w-0 relative">
      <h3 className="text-white/95 font-extralight text-xl md:text-lg group-hover:text-white transition-colors duration-300 line-clamp-1">
        <span className="md:hidden">{product.title}</span>
        <span className="hidden md:flex md:items-center md:gap-1">
          <span>{product.title}</span>
          {format === 'disposable' && (
            <span className="text-emerald-400 text-xs font-light whitespace-nowrap">disposable</span>
          )}
        </span>
      </h3>
      
      {format === 'disposable' && (
        <p className="md:hidden text-emerald-400 text-sm font-light mb-1">disposable</p>
      )}
      
      {product.lineage && (
        <p className="text-white/60 text-sm md:text-xs italic mb-1">{product.lineage}</p>
      )}
      
      <div className="flex items-center gap-2 mb-1">
        <span className="text-white/70 text-sm md:text-xs">Type:</span>
        <span className={`px-2 py-0.5 rounded-full text-sm md:text-xs font-light tracking-wide flex-shrink-0 ${getCategoryColor(product.category)}`}>
          {product.category}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <span className="text-white/70 text-sm md:text-xs">THCa:</span>
        <span className="text-emerald-400 text-sm md:text-xs font-medium">{product.thc}%</span>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-1">
        <span className="text-white/70 text-sm md:text-xs mr-1">Nose:</span>
        {product.nose.map((note, idx) => (
          <span key={idx} className="text-white/70 text-base md:text-xs hover:text-white transition-colors duration-300 capitalize">
            {note}
          </span>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-white/70 text-sm md:text-xs mr-1">Effects:</span>
        {getEffects(product.vibe).map((effect, idx) => (
          <span 
            key={idx}
            className={`text-${effect.color}-300 text-base md:text-xs hover:text-${effect.color}-200 transition-colors duration-300 capitalize ${
              effect.desktop ? 'hidden md:inline' : ''
            }`}
          >
            {effect.name}
          </span>
        ))}
      </div>
      
      <div className="hidden md:block">
        <p className="text-white/70 text-xs leading-relaxed group-hover:text-white/80 transition-colors duration-300">
          {format === 'disposable' 
            ? `Ready-to-use ${product.title} disposable vape. ${product.description}`
            : product.description
          }
        </p>
      </div>
    </div>
  );
};

// Hooks
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

const useScrollToExpanded = (expandedProducts: Set<number>, productRefs: React.MutableRefObject<{[key: number]: HTMLDivElement | null}>, isMobile: boolean) => {
  useEffect(() => {
    if (isMobile && expandedProducts.size > 0) {
      const expandedProductId = Array.from(expandedProducts)[0];
      const expandedElement = productRefs.current[expandedProductId];
      
      if (expandedElement) {
        setTimeout(() => {
          const rect = expandedElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollToY = rect.top + scrollTop - window.innerHeight / 4;
          
          window.scrollTo({
            top: scrollToY,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [expandedProducts, isMobile, productRefs]);
};

export default function DenseView({
  products,
  selectedWeights,
  loadedImages,
  format,
  onProductClick,
  onWeightSelect,
  onAddToCart,
  onImageLoad,
  onClearFilters
}: DenseViewProps) {
  const [imageQuickView, setImageQuickView] = React.useState<FeaturedProduct | null>(null);
  const [expandedProducts, setExpandedProducts] = React.useState<Set<number>>(new Set());
  const [isMagnifying, setIsMagnifying] = React.useState(false);
  const [magnifierPosition, setMagnifierPosition] = React.useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const productRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  const isMobile = useMobileDetection();
  
  // Refs for smooth animation
  const animationFrameRef = React.useRef<number | undefined>(undefined);
  const targetPositionRef = React.useRef({ x: 0, y: 0 });
  const currentPositionRef = React.useRef({ x: 0, y: 0 });
  
  useScrollToExpanded(expandedProducts, productRefs, isMobile);
  
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

  // Prevent body scroll and hide nav when modal is open
  React.useEffect(() => {
    if (imageQuickView) {
      // Store current scroll position to restore later
      const scrollY = window.scrollY;
      
      // Lock the page completely
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Hide navigation bar completely
      const nav = document.querySelector('nav');
      const header = document.querySelector('header');
      if (nav) {
        (nav as HTMLElement).style.display = 'none';
      }
      if (header) {
        (header as HTMLElement).style.display = 'none';
      }
    } else {
      // Get the stored scroll position
      const scrollY = document.body.style.top;
      
      // Restore page
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      
      // Show navigation bar
      const nav = document.querySelector('nav');
      const header = document.querySelector('header');
      if (nav) {
        (nav as HTMLElement).style.display = '';
      }
      if (header) {
        (header as HTMLElement).style.display = '';
      }
    }
    
    // Cleanup on unmount
    return () => {
      // Ensure body styles are always reset
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      const nav = document.querySelector('nav');
      const header = document.querySelector('header');
      if (nav) {
        (nav as HTMLElement).style.display = '';
      }
      if (header) {
        (header as HTMLElement).style.display = '';
      }
    };
  }, [imageQuickView]);

  // Safety mechanism to ensure body styles are reset on component unmount
  React.useEffect(() => {
    return () => {
      // Force reset all body styles that could prevent scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update target position for smooth interpolation
    targetPositionRef.current = { x, y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
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
  
  const getFadeClass = (productId: number) => {
    if (!isMobile || expandedProducts.size === 0) return '';
    return expandedProducts.has(productId) ? '' : 'opacity-60 scale-[0.99]';
  };

  const getCardStyling = (productId: number) => {
    const isExpanded = expandedProducts.has(productId);
    if (!isMobile || expandedProducts.size === 0) {
      return 'bg-gradient-to-r from-white/5 to-white/2 hover:from-white/8 hover:to-white/5 backdrop-blur-sm transition-all duration-200';
    }
    
    if (isExpanded) {
      return 'bg-gradient-to-r from-white/12 to-white/8 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.08)] rounded-lg transition-all duration-200';
    } else {
      return 'bg-gradient-to-r from-white/3 to-white/1 backdrop-blur-sm transition-all duration-200';
    }
  };

  const getDefaultSelection = (productId: number) => {
    return format === 'cartridge' ? '0.5g' : '0.5g';
  };

  const getCurrentOptions = () => {
    return format === 'cartridge' ? WEIGHT_PRICING : DISPOSABLE_PRICING;
  };

  const getAvailableSizes = () => {
    return format === 'cartridge' ? WEIGHTS : DISPOSABLE_SIZES;
  };

  const toggleExpanded = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProducts(prev => {
      const newSet = new Set<number>();
      if (!prev.has(productId)) {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleImageClick = (product: FeaturedProduct, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setImageQuickView(product);
  };

  return (
    <section className="relative bg-[#464646] overflow-hidden -mt-px" style={{ 
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)'
    }}>
      <div className="w-full relative z-10">
        <div className="w-full md:columns-2 lg:columns-3 md:gap-1 space-y-2 md:space-y-0">
          {products.map((product, index) => {
            const selectedWeight = selectedWeights[product.id] || getDefaultSelection(product.id);
            const currentOptions = getCurrentOptions();
            const price = currentOptions[selectedWeight as keyof typeof currentOptions];
            const isImageLoaded = loadedImages.has(product.id);
            const availableSizes = getAvailableSizes();
            const isExpanded = expandedProducts.has(product.id);

            return (
              <div 
                key={product.id}
                ref={(el) => {
                  productRefs.current[product.id] = el;
                }}
                className={`group relative cursor-pointer transition-all duration-200 break-inside-avoid mb-1 ${
                  index < 12 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                } ${isExpanded ? 'z-10' : 'z-0'} ${getFadeClass(product.id)} ${
                  isMobile && isExpanded ? 'my-1' : ''
                }`}
                style={{ transitionDelay: `${Math.min(index * 50, 600)}ms` }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleExpanded(product.id, e);
                }}
              >
                <div className={`${getCardStyling(product.id)} p-1.5 group-hover:shadow-xl relative ${
                  isExpanded ? 'pb-4' : ''
                }`}>
                  
                  {isMobile && isExpanded && (
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-white/40 to-white/20 rounded-r-full"></div>
                  )}
                  
                  <div className="flex items-start gap-1.5 mb-3 md:mb-4">
                    <ProductImage
                      product={product}
                      isLoaded={isImageLoaded}
                      format={format}
                      onLoad={() => onImageLoad(product.id)}
                      onClick={(e) => handleImageClick(product, e)}
                      index={index}
                    />

                    <ProductInfo
                      product={product}
                      format={format}
                    />
                  </div>

                  <div className="md:hidden mb-3">
                    <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {format === 'disposable' 
                        ? `Ready-to-use ${product.title} disposable vape. ${product.description}`
                        : product.description
                      }
                    </p>
                    
                    <div className="text-center mt-3">
                      <p className={`text-white/60 text-xs font-light transition-all duration-200 ${
                        isExpanded ? 'opacity-100' : 'animate-subtle-glow'
                      }`}>
                        {isExpanded ? 'Hide Options' : 'Click to see options'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="text-white/95 font-light text-lg md:text-xl group-hover:text-white transition-colors duration-300">
                      ${price} <span className="text-xs text-white/60">/{selectedWeight}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-1">
                    <div 
                      className={`overflow-hidden transition-all duration-200 ease-out ${
                        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div 
                        className={`flex flex-col gap-3 pt-2 transition-all duration-150 ${
                          isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <span className="text-white/70 text-sm font-medium">Size:</span>
                          <div className="grid grid-cols-5 gap-2 w-full">
                            {getAvailableSizes().map((size) => (
                              <button
                                key={size}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onWeightSelect(product.id, size);
                                }}
                                className={`px-2 py-2 rounded-md text-xs font-light transition-all duration-150 hover:scale-105 active:scale-95 min-h-[36px] ${
                                  selectedWeight === size
                                    ? 'bg-white/20 text-white border border-white/30'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={(e) => onAddToCart(product, e)}
                            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm text-white/80 hover:text-white font-light transition-all duration-300 hover:scale-[1.02] active:scale-95 min-h-[40px]"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onProductClick(product);
                            }}
                            className="flex-1 px-4 py-2 bg-black hover:bg-gray-900 text-white border border-gray-700 hover:border-gray-600 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 min-h-[40px]"
                          >
                            <span className="hidden md:inline">Buy with </span>
                            <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/>
                              <path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                            </svg>
                            <span>Pay</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Empty state */}
      {products.length === 0 && (
        <div className="text-center py-16 px-6">
          <p className="text-white/70 text-lg mb-4">No products match your filters</p>
          <button
            onClick={onClearFilters}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Image Quick View Modal */}
      {imageQuickView && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setImageQuickView(null)}
        >
          <div className="relative max-w-2xl max-h-[80vh] w-full h-full">
            <button
              onClick={() => setImageQuickView(null)}
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
                src={imageQuickView.image}
                alt={format === 'disposable' ? `${imageQuickView.title} disposable` : imageQuickView.title}
                fill
                className="object-contain select-none"
                quality={95}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
              
              {/* Magnifying Glass */}
              {isMagnifying && (
                <>
                  {/* Magnifier positioned above finger */}
                  <div
                    className="absolute pointer-events-none border-2 border-white/60 rounded-full shadow-lg z-10"
                    style={{
                      width: '200px',
                      height: '200px',
                      transform: `translate(${magnifierPosition.x - 100}px, ${magnifierPosition.y - 250}px)`,
                      backgroundImage: `url(${imageQuickView.image})`,
                      backgroundSize: '400% 400%',
                      backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                      backgroundRepeat: 'no-repeat',
                      willChange: 'transform, background-position',
                      transition: 'none',
                    }}
                  >
                  </div>
                  
                  {/* Handle directly at finger position */}
                  <div 
                    className="absolute w-3 h-3 bg-white/90 rounded-full shadow-lg pointer-events-none z-20 border border-white/50"
                    style={{
                      transform: `translate(${magnifierPosition.x - 6}px, ${magnifierPosition.y - 6}px)`,
                      willChange: 'transform',
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
                {imageQuickView.title}
                {format === 'disposable' && <span className="text-emerald-400 ml-1 whitespace-nowrap">disposable</span>}
              </h3>
              {imageQuickView.lineage && (
                <p className="text-white/60 text-sm italic">{imageQuickView.lineage}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 