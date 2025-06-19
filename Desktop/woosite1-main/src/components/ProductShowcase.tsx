"use client"

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface BaseProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface Product extends BaseProduct {
  category: string;
  route: string;
}

interface FeaturedProduct extends BaseProduct {
  category: 'indica' | 'sativa' | 'hybrid';
  vibe: 'relax' | 'energize' | 'balance';
  thc: number;
  nose: Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'>;
  lineage?: string;
  terpenes?: string[];
  spotlight: string;
  featured: boolean;
}

interface ProductShowcaseProps {
  products: Product[] | FeaturedProduct[];
  title?: string;
  subtitle?: React.ReactNode;
}

// Helper function to check if product is a FeaturedProduct
const isFeaturedProduct = (product: Product | FeaturedProduct): product is FeaturedProduct => {
  return 'thc' in product && 'category' in product && 'vibe' in product && 'nose' in product;
};

// Weight pricing
const WEIGHT_PRICING = {
  '1g': 15,
  '3.5g': 40,
  '7g': 60,
  '14g': 110,
  '28g': 200
} as const;

export default function ProductShowcase({ products, title, subtitle }: ProductShowcaseProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedWeights, setSelectedWeights] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(() => 
    new Set(products.map(product => product.id))
  );
  const [imageQuickView, setImageQuickView] = useState<FeaturedProduct | null>(null);

  // Update expandedProducts when products change
  useEffect(() => {
    setExpandedProducts(new Set(products.map(product => product.id)));
  }, [products]);

  const handleProductClick = (product: Product | FeaturedProduct) => {
    if ('route' in product && product.route) {
      router.push(product.route);
    } else {
      router.push('/flower');
    }
  };

  const handleWeightSelect = (productId: number, weight: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };

  const handleAddToCart = async (product: FeaturedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const weight = selectedWeights[product.id] || '3.5g';
    // Add to cart logic here
  };

  const handleImageLoad = (productId: number) => {
    setLoadedImages(prev => new Set([...prev, productId]));
  };

  const toggleExpanded = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // Keep all cards expanded - no toggle functionality
    return;
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const getCardStyling = (productId: number) => {
    // All cards are always expanded, so use expanded styling
    return 'bg-gradient-to-r from-white/12 to-white/8 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.08)] rounded-lg transition-all duration-500';
  };

  return (
    <section 
      className="relative bg-[#464646] overflow-hidden -mt-px"
      style={{ 
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)'
      }}
    >
      {/* Section Title */}
      {(title || subtitle) && (
        <div className="relative z-10 py-4 w-full">
          <div className="w-full text-center">
            <div className="transition-all duration-1000 opacity-100 translate-y-0">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-3"></div>
              <h2 className="text-white/95 font-sf-pro font-light tracking-[0.05em] mb-3 hover:text-white transition-colors duration-300" style={{fontSize:'clamp(1.125rem,2.5vw,1.5rem)',lineHeight:'1.3'}}>
                {title}
              </h2>
              {subtitle && (
                <div className="text-white/80 font-sf-pro font-light text-base md:text-lg mb-3">
                  {subtitle}
                </div>
              )}
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto"></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full relative z-10">
        {/* Navigation Arrows */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-full items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <svg className="w-6 h-6 text-white group-hover:text-white/90 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-full items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <svg className="w-6 h-6 text-white group-hover:text-white/90 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Product Grid - Horizontal Scroll */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory relative pl-0 pr-4 md:pr-8 pb-6" 
          style={{
            boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)',
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory'
          }}
        >
          {products.map((product, index) => {
            const featuredProduct = isFeaturedProduct(product) ? product : null;
            const selectedWeight = selectedWeights[product.id] || '3.5g';
            const price = featuredProduct ? WEIGHT_PRICING[selectedWeight as keyof typeof WEIGHT_PRICING] : product.price;
            const isImageLoaded = loadedImages.has(product.id);
            const isExpanded = expandedProducts.has(product.id);

            return (
              <div 
                key={product.id}
                className={`flex-none w-[90vw] md:w-[50vw] lg:w-[45vw] xl:w-[33vw] snap-center transition-all duration-500 z-10 ${index === 0 ? 'pl-0 pr-2' : 'pl-0 md:pl-2 pr-2'}`}
                onClick={(e) => {
                  handleProductClick(product);
                }}
              >
                <div className={`group relative cursor-pointer ${getCardStyling(product.id)} p-1.5 group-hover:shadow-xl`}>
                  
                  {/* Main Product Row */}
                  <div className="flex items-start gap-1.5 mb-3 md:mb-0">
                    {/* Product Image */}
                    <div 
                      className="relative w-50 h-50 md:w-48 md:h-48 flex-shrink-0 overflow-hidden rounded-lg cursor-pointer group/image bg-black/15"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                    >
                      {!isImageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-pulse">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                        </div>
                      )}
                      
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-cover transition-all duration-500 group-hover:scale-110 group-hover/image:scale-105 ${
                          isImageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => handleImageLoad(product.id)}
                        quality={85}
                        priority={product.id === 1}
                      />
                      
                      {/* Quick view overlay */}
                      {featuredProduct && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      
                      {/* Small magnified fisheye view - bottom right corner */}
                      {isImageLoaded && featuredProduct && (
                        <div className="absolute bottom-1 right-1 w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/40 bg-black/30 backdrop-blur-sm opacity-80 group-hover/image:opacity-100 transition-all duration-300 transform group-hover/image:scale-110 shadow-lg">
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
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 relative">
                      {/* Title Row */}
                      <div className="flex flex-col gap-1 mb-1">
                        <div className="flex flex-col">
                          <h3 className="font-extralight text-lg md:text-xl transition-colors duration-300 text-white/98">
                            {product.title}
                          </h3>
                          {featuredProduct?.lineage && (
                            <p className="text-xs italic text-white/70">{featuredProduct.lineage}</p>
                          )}
                        </div>
                        
                        {featuredProduct && (
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                              {/* Strain Type */}
                              <div className="flex items-center gap-2">
                                <span className="text-white/70 text-xs">Type:</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-light tracking-wide flex-shrink-0 ${
                                  featuredProduct.category === 'indica' ? 'bg-purple-500/25 text-purple-300' :
                                  featuredProduct.category === 'sativa' ? 'bg-green-500/25 text-green-300' :
                                  'bg-yellow-500/25 text-yellow-300'
                                }`}>
                                  {featuredProduct.category}
                                </span>
                              </div>
                              
                              {/* THCa */}
                              <div className="flex items-center gap-2">
                                <span className="text-white/70 text-xs">THCa:</span>
                                <span className="text-emerald-400 text-xs font-medium">{featuredProduct.thc}%</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Tags Row - Nose and Effects */}
                      {featuredProduct && (
                        <div className="flex flex-col gap-1 mb-2">
                          {/* Nose and Effects */}
                          <div className="flex flex-col gap-1">
                            {/* Nose Profile */}
                            <div className="flex flex-wrap gap-1">
                              <span className="text-white/70 text-xs mr-1">Nose:</span>
                              {featuredProduct.nose.map((note, idx) => (
                                <span key={idx} className="text-white/70 text-xs hover:text-white transition-colors duration-300 capitalize">
                                  {note}
                                </span>
                              ))}
                            </div>
                            
                            {/* Effects */}
                            <div className="flex flex-wrap gap-1">
                              <span className="text-white/70 text-xs mr-1">Effects:</span>
                              {featuredProduct.vibe === 'relax' && (
                                <>
                                  <span className="text-purple-300 text-xs hover:text-purple-200 transition-colors duration-300 capitalize">Relaxed</span>
                                  <span className="text-indigo-300 text-xs hover:text-indigo-200 transition-colors duration-300 capitalize">Sleepy</span>
                                </>
                              )}
                              {featuredProduct.vibe === 'energize' && (
                                <>
                                  <span className="text-green-300 text-xs hover:text-green-200 transition-colors duration-300 capitalize">Energetic</span>
                                  <span className="text-yellow-300 text-xs hover:text-yellow-200 transition-colors duration-300 capitalize">Focused</span>
                                </>
                              )}
                              {featuredProduct.vibe === 'balance' && (
                                <>
                                  <span className="text-emerald-300 text-xs hover:text-emerald-200 transition-colors duration-300 capitalize">Balanced</span>
                                  <span className="text-teal-300 text-xs hover:text-teal-200 transition-colors duration-300 capitalize">Euphoric</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Description - Desktop only, shown inline */}
                      <div className="hidden md:block">
                        <p className="text-xs leading-relaxed transition-colors duration-300 text-white/80">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description - Mobile only, full width below */}
                  <div className="md:hidden mb-3">
                    <p className="text-xs leading-relaxed transition-colors duration-300 text-white/80">
                      {product.description}
                    </p>
                  </div>

                  {/* Price positioned above divider line */}
                  <div className="flex justify-end">
                    <div className="text-white/95 font-light text-base md:text-lg group-hover:text-white transition-colors duration-300">
                      ${price} {featuredProduct && <span className="text-xs text-white/60">/{selectedWeight}</span>}
                    </div>
                  </div>

                  {/* Actions Row */}
                  {featuredProduct && (
                    <div className="flex flex-col gap-3 pt-1">
                      {/* Always Expanded Content */}
                      <div className="overflow-visible max-h-none opacity-100">
                        <div className="flex flex-col gap-3 pt-2 translate-y-0 opacity-100">
                          {/* Weight Selection - Full Width */}
                          <div className="flex flex-col gap-2 translate-y-0 opacity-100">
                            <span className="text-xs text-white/70 font-medium">Weight:</span>
                            <div className="grid grid-cols-5 gap-1 w-full">
                              {Object.keys(WEIGHT_PRICING).map((size, idx) => (
                                <button
                                  key={size}
                                  onClick={(e) => handleWeightSelect(product.id, size, e)}
                                  className={`px-1 py-1.5 rounded-md text-xs font-light transition-all duration-300 hover:scale-105 active:scale-95 min-h-[32px] ${
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

                          {/* Action Buttons */}
                          <div className="flex gap-2 translate-y-0 opacity-100 px-1 pb-2">
                            <button
                              onClick={(e) => handleAddToCart(featuredProduct, e)}
                              className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-xs text-white/80 hover:text-white font-light transition-all duration-300 hover:scale-[1.01] active:scale-95 whitespace-nowrap focus:outline-none focus:ring-0 select-none min-h-[36px]"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push('/flower');
                              }}
                              className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 hover:border-emerald-400 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-1 whitespace-nowrap focus:outline-none focus:ring-0 select-none shadow-lg hover:shadow-xl min-h-[36px]"
                            >
                              <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              Shop All
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
              className="relative w-full h-full rounded-lg overflow-hidden bg-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={imageQuickView.image}
                alt={imageQuickView.title}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain select-none"
                quality={95}
                draggable={false}
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white font-extralight text-xl mb-1">
                {imageQuickView.title}
              </h3>
              {imageQuickView.lineage && (
                <p className="text-white/70 text-sm italic">{imageQuickView.lineage}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 