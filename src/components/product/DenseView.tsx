import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { ProductType } from '@/app/components/ProductCollectionConfig';
import QuickViewModal from '@/app/components/QuickViewModal';

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

export interface BaseFeaturedProduct {
  id: number;
  title: string;
  thc: number;
  cbd?: number;
  effects?: string[];
  image: string;
  price: number;
  category: string;
  vibe: string;
  nose?: string | string[];
  type?: string | string[];
  texture?: string | string[];
  flavor?: string | string[];
  description?: string;
  spotlight?: string;
  featured?: boolean;
  lineage?: string;
  terpenes?: string[];
  [key: string]: any;
}

interface DenseViewProps<T extends BaseFeaturedProduct> {
  products: T[];
  selectedOptions: Record<number, string>;
  loadedImages: Set<number>;
  format: string;
  productType: ProductType;
  pricing: Record<string, number>;
  sizes: string[];
  onProductClick: (product: T) => void;
  onOptionSelect: (productId: number, option: string) => void;
  onAddToCart: (product: T, e: React.MouseEvent) => void;
  onImageLoad: (productId: number) => void;
  onClearFilters: () => void;
}

// Product Image Component
const ProductImage = ({ 
  product, 
  isLoaded, 
  productType, 
  format, 
  onLoad, 
  onClick,
  onGummyClick,
  index 
}: {
  product: BaseFeaturedProduct;
  isLoaded: boolean;
  productType: ProductType;
  format: string;
  onLoad: () => void;
  onClick: (e: React.MouseEvent) => void;
  onGummyClick?: (e: React.MouseEvent) => void;
  index: number;
}) => {
  const getIndicator = () => {
    if (productType === 'flower' && format === 'preroll') {
      return { type: 'image', src: '/icons/PRE ROLL.png', alt: 'Pre-roll indicator' };
    }
    if (productType === 'edible' && format === 'bulk') {
      return { type: 'badge', text: 'BULK', color: 'orange' };
    }
    return null;
  };

  const indicator = getIndicator();

  return (
    <div 
      className="relative w-50 h-50 md:w-48 md:h-48 flex-shrink-0 overflow-hidden rounded-lg cursor-pointer group/image bg-black/20"
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
      
      {indicator && (
        <div className="absolute top-1 left-0 z-10 p-0">
          {indicator.type === 'image' ? (
            <Image src={indicator.src || ''} alt={indicator.alt || ''} width={40} height={40} className="w-10 h-10" unoptimized={true} />
          ) : (
            <div className={`bg-${indicator.color || 'orange'}-500 text-white text-xs px-2 py-1 rounded-br-lg font-medium`}>
              {indicator.text || ''}
            </div>
          )}
        </div>
      )}
      
      <Image
        src={product.image}
        alt={product.title}
        fill
        className={`object-cover transition-all duration-200 group-hover:scale-110 group-hover/image:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={onLoad}
        quality={85}
      />
      
      {/* Bottom right corner indicator */}
      {isLoaded && (
        <>
          {(productType === 'wax' || productType === 'concentrate') ? (
            /* Concentrate icon for wax/concentrate products */
            <div className="absolute bottom-1 right-1 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/40 bg-black/30 backdrop-blur-sm opacity-80 group-hover/image:opacity-100 transition-all duration-300 transform group-hover/image:scale-110 shadow-lg flex items-center justify-center p-1">
              <Image
                src="/icons/concentrate.png"
                alt="Concentrate indicator"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                unoptimized={true}
              />
            </div>
          ) : product.title.toLowerCase().includes('gummy') ? (
            /* Gummy icon for products containing "gummy" */
            <div 
              className="absolute bottom-1 right-1 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/40 bg-black/30 backdrop-blur-sm opacity-80 group-hover/image:opacity-100 transition-all duration-300 transform group-hover/image:scale-110 shadow-lg flex items-center justify-center p-0.5 cursor-pointer"
              onClick={onGummyClick}
            >
              <Image
                src="/icons/newGummy.webp"
                alt="Gummy indicator"
                width={56}
                height={56}
                className="w-full h-full object-contain"
                unoptimized={true}
              />
            </div>
          ) : productType === 'vape' ? (
            /* Vape icon for vape products */
            <div className="absolute bottom-1 right-1 w-20 h-20 md:w-24 md:h-24 opacity-100 transition-all duration-300 transform group-hover/image:scale-110 shadow-lg flex items-center justify-center">
              <Image
                src="/icons/vapeicon2.png"
                alt="Vape indicator"
                width={80}
                height={80}
                className="w-full h-full object-contain"
                unoptimized={true}
              />
            </div>
          ) : productType !== 'edible' && productType !== 'moonwater' ? (
            /* Small magnified fisheye view for non-edible products (excluding moonwater and vape) */
            <div className="absolute bottom-1 right-1 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/40 bg-black/30 backdrop-blur-sm opacity-80 group-hover/image:opacity-100 transition-all duration-300 transform group-hover/image:scale-110 shadow-lg">
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
          ) : null}
        </>
      )}
    </div>
  );
};

// Product Info Component
const ProductInfo = ({ 
  product, 
  productType, 
  format, 
  isExpanded 
}: {
  product: BaseFeaturedProduct;
  productType: ProductType;
  format: string;
  isExpanded: boolean;
}) => {
  const getCategoryColor = (category: string) => {
    const baseClass = isExpanded ? 'bg-opacity-25' : 'bg-opacity-20';
    switch (category) {
      case 'indica': return `bg-purple-500/${baseClass} text-purple-300`;
      case 'sativa': return `bg-green-500/${baseClass} text-green-300`;
      default: return `bg-yellow-500/${baseClass} text-yellow-300`;
    }
  };

  const getThcLabel = () => {
    return productType === 'flower' || productType === 'vape' || productType === 'wax' || productType === 'concentrate' ? 'THCa:' : 'THC:';
  };

  const getThcValue = () => {
    return productType === 'edible' || productType === 'moonwater' ? `${product.thc}mg` : `${product.thc}%`;
  };

  return (
    <div className="flex-1 min-w-0 relative">
      <h3 className={`font-extralight text-2xl md:text-xl transition-colors duration-300 ${
        isExpanded ? 'text-white/98' : 'text-white/95'
      }`}>
        <span className="md:hidden">{product.title}</span>
        <span className="hidden md:flex md:items-center md:gap-1">
          <span>{product.title}</span>
          {format === 'preroll' && (
            <span className="text-emerald-400 text-xs font-light whitespace-nowrap">pre-rolls</span>
          )}
          {format === 'bulk' && (
            <span className="text-orange-400 text-xs font-light whitespace-nowrap">bulk pack</span>
          )}
        </span>
      </h3>
      
      {(format === 'preroll' || format === 'bulk') && (
        <p className={`md:hidden text-${format === 'preroll' ? 'emerald' : 'orange'}-400 text-sm font-light mb-1`}>
          {format === 'preroll' ? 'pre-rolls' : 'bulk pack'}
        </p>
      )}
      
      {product.lineage && (
        <p className={`text-sm md:text-xs italic mb-1 ${
          isExpanded ? 'text-white/70' : 'text-white/60'
        }`}>{product.lineage}</p>
      )}
      
      <div className="flex items-center gap-2 mb-1">
        <span className="text-white/70 text-sm md:text-xs">Type:</span>
        <span className={`px-2 py-0.5 rounded-full text-sm md:text-xs font-light tracking-wide flex-shrink-0 ${getCategoryColor(product.category)}`}>
          {product.category}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <span className="text-white/70 text-sm md:text-xs">{getThcLabel()}</span>
        <span className="text-emerald-400 text-sm md:text-xs font-medium">{getThcValue()}</span>
      </div>
      
      {productType === 'flower' && product.nose && Array.isArray(product.nose) && (
        <div className="flex flex-wrap gap-1 mb-1">
          <span className="text-white/70 text-sm md:text-xs mr-1">Nose:</span>
          {product.nose.map((note, idx) => (
            <span key={idx} className="text-white/70 text-base md:text-xs hover:text-white transition-colors duration-300 capitalize">
              {note}
            </span>
          ))}
        </div>
      )}
      
      {productType === 'edible' && product.type && Array.isArray(product.type) && (
        <div className="flex flex-wrap gap-1 mb-1">
          <span className="text-white/70 text-sm md:text-xs mr-1">Type:</span>
          {product.type.map((edibleType, idx) => (
            <span key={idx} className="text-white/70 text-base md:text-xs hover:text-white transition-colors duration-300 capitalize">
              {edibleType}
            </span>
          ))}
        </div>
      )}
      
      {productType === 'vape' && product.nose && (
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/70 text-sm md:text-xs">Nose:</span>
          <span className="text-white/70 text-base md:text-xs hover:text-white transition-colors duration-300 capitalize">
            {Array.isArray(product.nose) ? product.nose.join(', ') : product.nose}
          </span>
        </div>
      )}
      
                      {(productType === 'wax' || productType === 'concentrate') && product.texture && Array.isArray(product.texture) && (
        <div className="flex flex-wrap gap-1 mb-1">
          <span className="text-white/70 text-sm md:text-xs mr-1">Texture:</span>
          {product.texture.map((tex, idx) => (
            <span key={idx} className="text-white/70 text-base md:text-xs hover:text-white transition-colors duration-300 capitalize">
              {tex}
            </span>
          ))}
        </div>
      )}
      
      {productType === 'moonwater' && product.flavor && Array.isArray(product.flavor) && (
        <div className="flex flex-wrap gap-1 mb-1">
          <span className="text-white/70 text-sm md:text-xs mr-1">Flavor:</span>
          {product.flavor.map((flav, idx) => (
            <span key={idx} className="text-white/70 text-base md:text-xs hover:text-white transition-colors duration-300 capitalize">
              {flav}
            </span>
          ))}
        </div>
      )}
      
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
      
      {/* Description - Desktop only */}
      <div className="hidden md:block">
        <p className={`text-xs leading-relaxed transition-colors duration-300 ${
          isExpanded ? 'text-white/80' : 'text-white/70'
        }`}>
          {product.description}
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

export default function DenseView<T extends BaseFeaturedProduct>({
  products,
  selectedOptions,
  loadedImages,
  format,
  productType,
  pricing,
  sizes,
  onProductClick,
  onOptionSelect,
  onAddToCart,
  onImageLoad,
  onClearFilters
}: DenseViewProps<T>) {
  const [expandedProducts, setExpandedProducts] = React.useState<Set<number>>(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState<T | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState<number>(0);
  const productRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  const isMobile = useMobileDetection();
  
  useScrollToExpanded(expandedProducts, productRefs, isMobile);
  
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
    if (productType === 'flower') return format === 'flower' ? '3.5g' : '1-pack';
    if (productType === 'edible') return format === 'single' ? '1-piece' : '10-pack';
    if (productType === 'vape') return '0.5g';
    if (productType === 'wax' || productType === 'concentrate') return '1g';
    if (productType === 'moonwater') return '1-bottle';
    return sizes[0];
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

  const handleImageClick = (product: T, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    // Save current scroll position before opening modal - use more robust method
    const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    setSavedScrollPosition(currentScrollY);
    
    // Open quick view instead of navigating
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleGummyClick = (product: T, e: React.MouseEvent) => {
    e.stopPropagation();
    // Save current scroll position before opening modal
    const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    setSavedScrollPosition(currentScrollY);
    
    // Open quick view with gummy image instead of product image
    setQuickViewProduct({
      ...product,
      image: '/icons/newGummy.png',
      title: 'Gummy Details',
      description: 'Premium gummy with no artificial dyes'
    } as T);
    setIsQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
    
    // Use requestAnimationFrame to ensure the modal is fully closed before restoring scroll
    requestAnimationFrame(() => {
      // Additional delay to ensure DOM has updated and body overflow is reset
      setTimeout(() => {
        // Only restore scroll if we have a valid saved position
        if (savedScrollPosition >= 0) {
          window.scrollTo({
            top: savedScrollPosition,
            behavior: 'instant'
          });
        }
      }, 10);
    });
  };

  const handleQuickViewAddToCart = (product: QuickViewProduct, weight: string) => {
    // Find the original product by ID and create a mock event
    const originalProduct = products.find(p => p.id === product.id);
    if (originalProduct) {
      const mockEvent = { stopPropagation: () => {} } as React.MouseEvent;
      onAddToCart(originalProduct, mockEvent);
    }
  };

  return (
    <section className="relative bg-[#464646] overflow-hidden -mt-px" style={{ 
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)'
    }}>
      <div className="w-full relative z-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2">
          {products.map((product, index) => {
            const selectedOption = selectedOptions[product.id] || getDefaultSelection(product.id);
            const price = pricing[selectedOption as keyof typeof pricing];
            const isImageLoaded = loadedImages.has(product.id);
            const isExpanded = expandedProducts.has(product.id);

            return (
              <div 
                key={product.id}
                ref={(el) => {
                  productRefs.current[product.id] = el;
                }}
                className={`group relative cursor-pointer transition-all duration-200 opacity-100 translate-y-0 ${
                  isExpanded ? 'z-10' : 'z-0'
                } ${getFadeClass(product.id)} ${
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
                    <div className="flex flex-col">
                      <ProductImage
                        product={product}
                        isLoaded={isImageLoaded}
                        productType={productType}
                        format={format}
                        onLoad={() => onImageLoad(product.id)}
                        onClick={(e) => handleImageClick(product, e)}
                        onGummyClick={product.title.toLowerCase().includes('gummy') ? (e) => handleGummyClick(product, e) : undefined}
                        index={index}
                      />
                      {/* No Artificial Dyes text for gummy products */}
                      {product.title.toLowerCase().includes('gummy') && (
                        <div className="text-center mt-1">
                          <p className="text-red-400 text-xs font-medium">
                            **No Artificial Dyes**
                          </p>
                        </div>
                      )}
                    </div>

                    <ProductInfo
                      product={product}
                      productType={productType}
                      format={format}
                      isExpanded={isExpanded}
                    />
                  </div>

                  {/* Description - Mobile only */}
                  <div className="md:hidden mb-3">
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isExpanded ? 'text-white/80' : 'text-white/70'
                    }`}>
                      {product.description}
                    </p>
                    
                    {/* Text indicator for expanding options */}
                    <div className="text-center mt-3">
                      <p className={`text-xs font-light transition-all duration-200 ${
                        isExpanded ? 'text-emerald-300 opacity-100' : 'text-white/60 animate-subtle-glow'
                      }`}>
                        {isExpanded ? 'Hide Options' : 'Click to see options'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="text-white/95 font-light text-lg md:text-xl group-hover:text-white transition-colors duration-300">
                      ${price} <span className="text-xs text-white/60">
                        /{productType === 'edible' ? selectedOption.replace('-piece', '') : selectedOption}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-1">
                    <div 
                      className={`overflow-hidden transition-all duration-200 ease-out ${
                        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className={`flex flex-col gap-3 pt-2 transition-all duration-150 ${
                        isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}>
                        <div className="flex flex-col gap-2">
                          <span className="text-white/70 text-sm font-medium">
                            {productType === 'edible' ? 'Qty:' : 'Size:'}
                          </span>
                          <div className="grid grid-cols-5 gap-2 w-full">
                            {sizes.map((size, idx) => (
                              <button
                                key={size}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOptionSelect(product.id, size);
                                }}
                                className={`px-2 py-2 rounded-md text-xs font-light transition-all duration-150 hover:scale-105 active:scale-95 min-h-[36px] ${
                                  selectedOption === size
                                    ? 'bg-white/20 text-white border border-white/30'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                                }`}
                              >
                                {productType === 'edible' ? size.replace('-piece', '') : size}
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

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct ? {
          id: quickViewProduct.id,
          title: quickViewProduct.title,
          description: quickViewProduct.description,
          price: quickViewProduct.price,
          image: quickViewProduct.image,
          category: quickViewProduct.category,
          vibe: quickViewProduct.vibe,
          thc: quickViewProduct.thc,
          nose: quickViewProduct.nose,
          lineage: quickViewProduct.lineage,
          terpenes: quickViewProduct.terpenes,
          spotlight: quickViewProduct.spotlight,
        } : null}
        isOpen={isQuickViewOpen}
        onClose={handleQuickViewClose}
        onAddToCart={handleQuickViewAddToCart}
      />
    </section>
  );
} 