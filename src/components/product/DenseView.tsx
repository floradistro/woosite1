'use client';

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
      return { type: 'image', src: '/icons/pre-roll.png', alt: 'Pre-roll indicator' };
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
      case 'sativa': return `bg-yellow-500/${baseClass} text-yellow-300`;
      case 'hybrid': return `bg-green-500/${baseClass} text-green-300`;
      default: return `bg-green-500/${baseClass} text-green-300`;
    }
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="flex-1 min-w-0 relative">
      <h3 className={`font-extralight text-2xl md:text-xl transition-colors duration-300 mb-2 ${
        isExpanded ? 'text-white/98' : 'text-white/95'
      }`}>
        <span className="md:hidden">
          {product.title}
          {product.lineage && (
            <span className="block text-sm text-white/60 italic font-light mt-1">
              {product.lineage}
            </span>
          )}
        </span>
        <span className="hidden md:flex md:flex-col">
          <div className="flex items-center gap-1">
            <span>{product.title}</span>
            {format === 'preroll' && (
              <span className="text-emerald-400 text-xs font-light whitespace-nowrap">pre-rolls</span>
            )}
            {format === 'bulk' && (
              <span className="text-orange-400 text-xs font-light whitespace-nowrap">bulk pack</span>
            )}
          </div>
          {product.lineage && (productType === 'flower' || productType === 'concentrate' || productType === 'vape') && (
            <span className="text-white/60 text-xs italic font-light mt-0.5">
              {product.lineage}
            </span>
          )}
        </span>
      </h3>
      
      {/* No Artificial Dyes text for gummy products */}
      {product.title.toLowerCase().includes('gummy') && (
        <p className="text-red-400 text-xs font-medium mb-2">
          **No Artificial Dyes**
        </p>
      )}
      
      {(format === 'preroll' || format === 'bulk') && (
        <p className={`md:hidden text-${format === 'preroll' ? 'emerald' : 'orange'}-400 text-sm font-light mb-2`}>
          {format === 'preroll' ? 'pre-rolls' : 'bulk pack'}
        </p>
      )}

      {/* Compact field grid - all fields in a more condensed layout */}
      {productType !== 'edible' && productType !== 'moonwater' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 mb-2 auto-rows-fr">
          {/* THC/Strength Container */}
          <div className="p-1.5 rounded-md bg-gradient-to-r from-white/5 to-white/2 border border-white/10 flex flex-col justify-between min-h-[3.5rem]">
            <span className="text-white/70 text-xs font-light tracking-wide block mb-0.5">
              {productType === 'flower' || productType === 'vape' || productType === 'wax' || productType === 'concentrate' ? 'THCa' : 'THC'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-light text-emerald-400">{product.thc}</span>
              <span className="text-xs font-light text-emerald-400/70">
                {(productType as string) === 'edible' || (productType as string) === 'moonwater' ? 'mg' : '%'}
              </span>
            </div>
          </div>
          
          {/* Type/Category Container */}
          <div className="p-1.5 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8 flex flex-col justify-between min-h-[3.5rem]">
            <div className="flex-1">
              <span className="text-white/70 text-xs font-light tracking-wide block mb-0.5">
                {(productType === 'flower' || productType === 'vape' || productType === 'concentrate' || productType === 'wax') && 
                 product.spotlight ? (
                  <>
                    <span className="md:hidden">Type/Effects</span>
                    <span className="hidden md:inline">Type</span>
                  </>
                ) : 'Type'}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-light tracking-wide ${getCategoryColor(product.category)}`}>
                {formatCategory(product.category)}
              </span>
            </div>
            {/* Effects on mobile only for flower, vape, concentrate, wax */}
            {(productType === 'flower' || productType === 'vape' || productType === 'concentrate' || productType === 'wax') && 
             product.spotlight && (
              <span className={`md:hidden block text-xs hover:opacity-80 transition-colors duration-300 capitalize mt-1 ${
                product.vibe === 'relax' ? 'text-purple-300' :
                product.vibe === 'energize' ? 'text-green-300' :
                'text-emerald-300'
              }`}>
                {product.spotlight}
              </span>
            )}
          </div>

          {/* Terpene Container */}
          {(productType === 'flower' || productType === 'vape' || productType === 'concentrate' || productType === 'wax') && product.terpenes && product.terpenes.length > 0 && (
            <div className="p-1.5 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8 flex flex-col justify-between min-h-[3.5rem]">
              <span className="text-white/70 text-xs font-light tracking-wide block mb-0.5">Terpene</span>
              <span className="text-amber-400 text-xs hover:text-amber-300 transition-colors duration-300 capitalize">
                {product.terpenes[0]}
              </span>
            </div>
          )}

          {/* Nose Container */}
          {(productType === 'flower' || productType === 'vape' || productType === 'concentrate' || productType === 'wax') && product.nose && Array.isArray(product.nose) && product.nose.length > 0 && (
            <div className="p-1.5 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8 flex flex-col justify-between min-h-[3.5rem]">
              <span className="text-white/70 text-xs font-light tracking-wide block mb-0.5">Nose</span>
              <div className="flex flex-wrap gap-1">
                {product.nose.slice(0, 2).map((note, idx) => (
                  <span key={idx} className="text-white/90 text-xs hover:text-white transition-colors duration-300 capitalize">
                    {note}{idx < Math.min((product.nose as string[]).length, 2) - 1 && ', '}
                  </span>
                ))}
                {(product.nose as string[]).length > 2 && <span className="text-white/60 text-xs">+{(product.nose as string[]).length - 2}</span>}
              </div>
            </div>
          )}



          {/* Nose for Vape/Concentrate/Wax (single value) */}
          {(productType === 'vape' || productType === 'concentrate' || productType === 'wax') && product.nose && !Array.isArray(product.nose) && (
            <div className="p-1.5 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8 flex flex-col justify-between min-h-[3.5rem]">
              <span className="text-white/70 text-xs font-light tracking-wide block mb-0.5">Nose</span>
              <span className="text-white/90 text-xs hover:text-white transition-colors duration-300 capitalize">
                {product.nose}
              </span>
            </div>
          )}
          
          {/* Texture Container */}
          {(productType === 'wax' || productType === 'concentrate') && product.texture && Array.isArray(product.texture) && product.texture.length > 0 && (
            <div className="p-1.5 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8 flex flex-col justify-between min-h-[3.5rem]">
              <span className="text-white/70 text-xs font-light tracking-wide block mb-0.5">Texture</span>
              <div className="flex flex-wrap gap-1">
                {product.texture.slice(0, 2).map((tex, idx) => (
                  <span key={idx} className="text-white/90 text-xs hover:text-white transition-colors duration-300 capitalize">
                    {tex}{idx < Math.min((product.texture as string[]).length, 2) - 1 && ', '}
                  </span>
                ))}
                {(product.texture as string[]).length > 2 && <span className="text-white/60 text-xs">+{(product.texture as string[]).length - 2}</span>}
              </div>
            </div>
          )}

          {/* Effects Container */}
          {(productType as string) !== 'edible' && (productType as string) !== 'moonwater' && product.spotlight && (
            <div className={`p-1.5 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8 flex flex-col justify-between min-h-[3.5rem] ${
              (productType === 'flower' || productType === 'vape' || productType === 'concentrate' || productType === 'wax') ? 'hidden md:block' : ''
            }`}>
              <span className="text-white/70 text-xs font-light tracking-wide block mb-0.5">Effects</span>
              <span className={`text-xs hover:opacity-80 transition-colors duration-300 capitalize ${
                product.vibe === 'relax' ? 'text-purple-300' :
                product.vibe === 'energize' ? 'text-green-300' :
                'text-emerald-300'
              }`}>
                {product.spotlight}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Description Container - Full width at bottom */}
      {product.description && (
        <div className="hidden md:block mb-3 p-2 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8">
          <span className="text-white/70 text-xs font-light tracking-wide block mb-1">Description</span>
          <p className={`text-xs leading-relaxed transition-colors duration-300 ${
            isExpanded ? 'text-white/80' : 'text-white/70'
          }`}>
            {product.description}
          </p>
        </div>
      )}
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
    if (productType === 'vape') return '1';
    if (productType === 'wax' || productType === 'concentrate') return '1g';
    if (productType === 'moonwater') {
      // For variable moonwater products, set default flavor and pack size
      const product = products.find(p => p.id === productId);
      if (product && (product as any).isVariable && (product as any).variations?.length > 0) {
        const firstVariation = (product as any).variations[0];
        return `flavor-${firstVariation.flavor} pack-${firstVariation.packSize}`;
      }
      return '1-bottle';
    }
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
        <div className={`w-full grid grid-cols-1 gap-1 md:gap-2 md:grid-cols-2 ${['vape', 'edible', 'concentrate', 'wax', 'flower'].includes(productType) ? '' : 'lg:grid-cols-3'}`}>
          {products.map((product, index) => {

            const selectedOption = selectedOptions[product.id] || getDefaultSelection(product.id);
            
            // Determine pricing based on product type and available data
            let price: number;
            
            // For concentrates/wax/vapes, always prioritize variation pricing from WooCommerce
            if (productType === 'concentrate' || productType === 'wax' || productType === 'vape') {
              const productWithVariations = product as any;
              const variationPricing = productWithVariations.variationPricing;
              
              // Check if we have valid variation pricing
              if (variationPricing && 
                  typeof variationPricing === 'object' && 
                  Object.keys(variationPricing).length > 0) {
                // Use the variation price for the selected option, fallback to '1' for vapes
                const priceKey = variationPricing[selectedOption] ? selectedOption : '1';
                price = variationPricing[priceKey] || (productType === 'vape' ? 49.99 : 35);
              } else {
                // Fallback to product base price or default pricing
                price = product.price || (productType === 'vape' ? 49.99 : 35);
              }
            } else {
              // Use config pricing for all other product types (flower, edibles, etc.)
              price = pricing[selectedOption as keyof typeof pricing] || product.price || 15;
            }
            
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

                    <ProductInfo
                      product={product}
                      productType={productType}
                      format={format}
                      isExpanded={isExpanded}
                    />
                  </div>

                  {/* Description - Full width under everything for mobile */}
                  <div className="md:hidden mb-3">
                    <div className="p-2 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8">
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isExpanded ? 'text-white/80' : 'text-white/70'
                      }`}>
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Text indicator for expanding options - Mobile only */}
                  <div className="md:hidden mb-3">
                    <div className="text-center mt-3">
                      <p className={`text-xs font-light transition-all duration-200 ${
                        isExpanded ? 'text-emerald-300 opacity-100' : 'text-white/60 animate-subtle-glow'
                      }`}>
                        {isExpanded ? 'Hide Options' : 'Click to see options'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      {/* Stock Status */}
                      {(product as any).stockQuantity !== undefined && (
                        <div className="text-xs mb-1">
                          {(product as any).inStock ? (
                            <span className="text-green-400">
                              {(product as any).stockQuantity === null ? 'In Stock' : 
                               (product as any).stockQuantity > 10 ? 'In Stock' :
                               (product as any).stockQuantity > 0 ? `${(product as any).stockQuantity} left` : 'Out of Stock'}
                            </span>
                          ) : (
                            <span className="text-red-400">Out of Stock</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-white/95 font-light text-lg md:text-xl group-hover:text-white transition-colors duration-300">

                                              <span className="text-green-400">$</span>
                        <span key={`${product.id}-${selectedOption}-${price}`}>{price.toFixed(2)}</span> 
                      {productType === 'moonwater' && (product as any).isVariable ? (
                        <span className="text-xs text-white/60">
                          {selectedOption?.includes('pack-') ? 
                            `/${selectedOption.split('pack-')[1]}` : 
                            '/each'
                          }
                        </span>
                      ) : (
                        <span className="text-xs text-white/60">
                          /{productType === 'edible' ? selectedOption.replace('-piece', '') : 
                            productType === 'vape' ? (selectedOption === '1' ? 'vape' : 'vapes') :
                            selectedOption}
                        </span>
                      )}
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
                        {/* Default Size Selector for non-edible products */}
                        {productType !== 'edible' && (
                          <div className="flex flex-col gap-2">
                            <span className="text-white/70 text-sm font-medium">
                              {productType === 'vape' ? 'Quantity:' : 'Weight:'}
                            </span>
                            <div className="grid grid-cols-5 gap-1.5 w-full">
                              {sizes.map((size, idx) => {
                                return (
                                  <button
                                    key={size}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOptionSelect(product.id, size);
                                    }}
                                    className={`px-1.5 py-2 rounded-md text-xs font-light transition-all duration-150 hover:scale-105 active:scale-95 min-h-[40px] flex flex-col items-center justify-center ${
                                      selectedOption === size
                                        ? 'bg-white/20 text-white border border-white/30'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                                    }`}
                                  >
                                    <span className="text-xs font-medium">
                                      {size}
                                    </span>
                                    <span className="text-[10px] opacity-70">
                                      {productType === 'vape' ? (size === '1' ? 'Vape' : 'Vapes') : 'Grams'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={(e) => onAddToCart(product, e)}
                            disabled={!(product as any).inStock}
                            className={`flex-1 px-4 py-2 border rounded-lg text-sm font-light transition-all duration-300 min-h-[40px] ${
                              (product as any).inStock === false 
                                ? 'bg-gray-600 border-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/80 hover:text-white hover:scale-[1.02] active:scale-95'
                            }`}
                          >
                            {(product as any).inStock === false ? 'Out of Stock' : 'Add to Cart'}
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
        productType={productType}
      />
    </section>
  );
} 