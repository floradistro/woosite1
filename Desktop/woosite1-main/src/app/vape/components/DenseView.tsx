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
  const [expandedProducts, setExpandedProducts] = React.useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Create refs for product cards
  const productRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Scroll to expanded product
  useEffect(() => {
    if (isMobile && expandedProducts.size > 0) {
      const expandedProductId = Array.from(expandedProducts)[0];
      const expandedElement = productRefs.current[expandedProductId];
      
      if (expandedElement) {
        // Wait for expansion animation to start
        setTimeout(() => {
          // Get element position
          const rect = expandedElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          // Calculate position with padding
          const scrollToY = rect.top + scrollTop - window.innerHeight / 4;
          
          // Smooth scroll
          window.scrollTo({
            top: scrollToY,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [expandedProducts, isMobile]);
  
  // Add fade effect to non-expanded cards on mobile
  const getFadeClass = (productId: number) => {
    if (!isMobile || expandedProducts.size === 0) return '';
    return expandedProducts.has(productId) ? '' : 'opacity-60 scale-[0.99]';
  };

  // Get Apple-style card styling
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
      // If the clicked product is already expanded, close it
      // Otherwise, close all others and expand only this one
      if (!prev.has(productId)) {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <section className="relative bg-[#464646] overflow-hidden -mt-px" style={{ 
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)'
    }}>
      {/* Removed gradient effect */}
      
      <div className="w-full relative z-10">
        <div className="w-full md:columns-2 lg:columns-3 md:gap-1 space-y-2 md:space-y-0">
          {products.map((product, index) => {
            const selectedWeight = selectedWeights[product.id] || getDefaultSelection(product.id);
            const currentOptions = getCurrentOptions();
            const price = currentOptions[selectedWeight as keyof typeof currentOptions];
            const isImageLoaded = loadedImages.has(product.id);
            const availableSizes = getAvailableSizes();

            return (
              <div 
                key={product.id}
                ref={(el) => {
                  productRefs.current[product.id] = el;
                }}
                className={`group relative cursor-pointer transition-all duration-200 break-inside-avoid mb-1 ${
                  index < 12 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                } ${expandedProducts.has(product.id) ? 'z-10' : 'z-0'} ${getFadeClass(product.id)} ${
                  isMobile && expandedProducts.has(product.id) ? 'my-1' : ''
                }`}
                style={{ transitionDelay: `${Math.min(index * 50, 600)}ms` }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleExpanded(product.id, e);
                }}
              >
                <div className={`${getCardStyling(product.id)} p-1.5 group-hover:shadow-xl relative ${
                  expandedProducts.has(product.id) ? 'pb-4' : ''
                }`}>
                  
                  {/* Mobile expanded indicator */}
                  {isMobile && expandedProducts.has(product.id) && (
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-white/40 to-white/20 rounded-r-full"></div>
                  )}
                  
                  {/* Main Product Row */}
                  <div className="flex items-start gap-1.5 mb-3 md:mb-4">
                    {/* Product Image */}
                    <div 
                      className={`relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0 overflow-hidden rounded-lg cursor-pointer group/image ${
                        expandedProducts.has(product.id) ? 'bg-black/15' : 'bg-black/20'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductClick(product);
                      }}
                    >
                      {!isImageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-[shimmer_2s_ease-in-out_infinite]">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                        </div>
                      )}
                      
                      {/* Disposable indicator in top left of image */}
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
                          isImageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        sizes="80px"
                        loading={index < 8 ? "eager" : "lazy"}
                        priority={index < 8}
                        onLoad={() => onImageLoad(product.id)}
                        quality={85}
                      />
                    </div>

                    {/* Product Info - Now extends to right edge */}
                    <div className="flex-1 min-w-0 relative">
                      {/* Title - without disposable indicator on mobile, with it on desktop */}
                      <h3 className="text-white/95 font-extralight text-xl md:text-lg group-hover:text-white transition-colors duration-300 line-clamp-1">
                        <span className="md:hidden">{product.title}</span>
                        <span className="hidden md:flex md:items-center md:gap-1">
                          <span>{product.title}</span>
                          {format === 'disposable' && (
                            <span className="text-emerald-400 text-xs font-light whitespace-nowrap">disposable</span>
                          )}
                        </span>
                      </h3>
                      
                      {/* Disposable indicator - Mobile only, below title */}
                      {format === 'disposable' && (
                        <p className="md:hidden text-emerald-400 text-sm font-light mb-1">disposable</p>
                      )}
                      
                      {/* Lineage/Cross */}
                      {product.lineage && (
                        <p className="text-white/60 text-sm md:text-xs italic mb-1">{product.lineage}</p>
                      )}
                      
                      {/* Type */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white/70 text-sm md:text-xs">Type:</span>
                        <span className={`px-2 py-0.5 md:px-2 md:py-0.5 rounded-full text-sm md:text-xs font-light tracking-wide flex-shrink-0 ${
                          product.category === 'indica' ? 'bg-purple-500/20 text-purple-300' :
                          product.category === 'sativa' ? 'bg-green-500/20 text-green-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {product.category}
                        </span>
                      </div>
                      
                      {/* THCa */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white/70 text-sm md:text-xs">THCa:</span>
                        <span className="text-emerald-400 text-sm md:text-xs font-medium">{product.thc}%</span>
                      </div>
                      
                      {/* Nose Profile */}
                      <div className="flex flex-wrap gap-1 mb-1">
                        <span className="text-white/70 text-sm md:text-xs mr-1">Nose:</span>
                        {product.nose.map((note, idx) => (
                          <span key={idx} className="text-white/70 text-base md:text-xs hover:text-white transition-colors duration-300 capitalize">
                            {note}
                          </span>
                        ))}
                      </div>
                      
                      {/* Effects */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-white/70 text-sm md:text-xs mr-1">Effects:</span>
                        {product.vibe === 'relax' && (
                          <>
                            <span className="text-purple-300 text-base md:text-xs hover:text-purple-200 transition-colors duration-300 capitalize">Relaxed</span>
                            <span className="text-indigo-300 text-base md:text-xs hover:text-indigo-200 transition-colors duration-300 hidden md:inline capitalize">Sleepy</span>
                            <span className="text-blue-300 text-base md:text-xs hover:text-blue-200 transition-colors duration-300 hidden md:inline capitalize">Calm</span>
                          </>
                        )}
                        {product.vibe === 'energize' && (
                          <>
                            <span className="text-green-300 text-base md:text-xs hover:text-green-200 transition-colors duration-300 capitalize">Energetic</span>
                            <span className="text-yellow-300 text-base md:text-xs hover:text-yellow-200 transition-colors duration-300 hidden md:inline capitalize">Focused</span>
                            <span className="text-orange-300 text-base md:text-xs hover:text-orange-200 transition-colors duration-300 hidden md:inline capitalize">Creative</span>
                          </>
                        )}
                        {product.vibe === 'balance' && (
                          <>
                            <span className="text-emerald-300 text-base md:text-xs hover:text-emerald-200 transition-colors duration-300 capitalize">Balanced</span>
                            <span className="text-teal-300 text-base md:text-xs hover:text-teal-200 transition-colors duration-300 hidden md:inline capitalize">Euphoric</span>
                            <span className="text-cyan-300 text-base md:text-xs hover:text-cyan-200 transition-colors duration-300 hidden md:inline capitalize">Uplifted</span>
                          </>
                        )}
                      </div>
                      
                      {/* Description - Desktop only, shown inline */}
                      <div className="hidden md:block">
                        <p className="text-white/70 text-xs leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                          {format === 'disposable' 
                            ? `Ready-to-use ${product.title} disposable vape. ${product.description}`
                            : product.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description - Mobile only, full width below */}
                  <div className="md:hidden mb-3">
                    <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {format === 'disposable' 
                        ? `Ready-to-use ${product.title} disposable vape. ${product.description}`
                        : product.description
                      }
                    </p>
                    
                    {/* Text indicator for expanding options - replaces button */}
                    <div className="text-center mt-3">
                      <p className={`text-white/60 text-xs font-light transition-all duration-200 ${
                        expandedProducts.has(product.id) 
                          ? 'opacity-100' 
                          : 'animate-subtle-glow'
                      }`}>
                        {expandedProducts.has(product.id) ? 'Hide Options' : 'Click to see options'}
                      </p>
                    </div>
                  </div>

                  {/* Price positioned above divider line */}
                  <div className="flex justify-end">
                    <div className="text-white/95 font-light text-lg md:text-xl group-hover:text-white transition-colors duration-300">
                      ${price} <span className="text-xs text-white/60">/{selectedWeight}</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-col gap-3 pt-1">
                    {/* Expandable Content */}
                    <div 
                      className={`overflow-hidden transition-all duration-200 ease-out ${
                        expandedProducts.has(product.id) 
                          ? 'max-h-[500px] opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div 
                        className={`flex flex-col gap-3 pt-2 transition-all duration-150 ${
                          expandedProducts.has(product.id)
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-8 opacity-0'
                        }`}
                      >
                        {/* Size Selection - Full Width */}
                        <div 
                          className={`flex flex-col gap-2 transition-all duration-150 delay-50 ${
                            expandedProducts.has(product.id)
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-4 opacity-0'
                          }`}
                        >
                          <span className="text-white/70 text-sm font-medium">Size:</span>
                          <div className="grid grid-cols-5 gap-2 w-full">
                            {getAvailableSizes().map((size, idx) => (
                              <button
                                key={size}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onWeightSelect(product.id, size);
                                }}
                                className={`px-2 py-2 md:px-3 md:py-2.5 rounded-md text-xs md:text-sm font-light transition-all duration-150 hover:scale-105 active:scale-95 min-h-[36px] md:min-h-[40px] ${
                                  selectedWeight === size
                                    ? 'bg-white/20 text-white border border-white/30'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                                } ${expandedProducts.has(product.id) ? 'animate-fadeIn' : ''}`}
                                style={{ 
                                  animationDelay: `${50 + idx * 20}ms`,
                                  animationFillMode: 'both'
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div 
                          className={`flex gap-2 md:gap-3 transition-all duration-150 delay-100 ${
                            expandedProducts.has(product.id)
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-4 opacity-0'
                          }`}
                        >
                          <button
                            onClick={(e) => onAddToCart(product, e)}
                            className="flex-1 px-4 md:px-5 py-2 md:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm text-white/80 hover:text-white font-light transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap focus:outline-none focus:ring-0 select-none min-h-[40px] md:min-h-[44px]"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onProductClick(product);
                            }}
                            className="flex-1 px-4 md:px-5 py-2 md:py-2.5 bg-black hover:bg-gray-900 text-white border border-gray-700 hover:border-gray-600 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 md:gap-2 whitespace-nowrap focus:outline-none focus:ring-0 select-none shadow-lg hover:shadow-xl min-h-[40px] md:min-h-[44px]"
                          >
                            <span className="hidden md:inline">Buy with </span>
                            <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/>
                              <path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                            </svg>
                            <span className="md:hidden">Pay</span>
                            <span className="hidden md:inline">Pay</span>
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
    </section>
  );
} 