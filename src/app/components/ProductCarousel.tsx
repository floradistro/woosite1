'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FeaturedProduct } from '../flower/constants';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: FeaturedProduct[];
  productType: 'vape' | 'concentrate' | 'flower' | 'edible' | 'moonwater';
  itemsPerView?: number;
  showProductTypeIcon?: boolean;
}

export default function ProductCarousel({ 
  title,
  subtitle,
  products,
  productType,
  itemsPerView = 3,
  showProductTypeIcon = true
}: ProductCarouselProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-advance carousel
  useEffect(() => {
    if (products.length <= itemsPerView) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [products.length, itemsPerView, maxIndex]);

  const formatPrice = (price: number) => {
    return price.toFixed(0);
  };

  const getProductIcon = () => {
    switch (productType) {
      case 'vape':
        return '/icons/vapeicon2.png';
      case 'concentrate':
        return '/icons/concentrate.png';
      case 'flower':
        return '/icons/FLOWER.png';
      case 'edible':
        return '/icons/newGummy.webp';
      case 'moonwater':
        return '/icons/Moonwater.png';
      default:
        return '/icons/FLOWER.png';
    }
  };

  const getPriceUnit = () => {
    switch (productType) {
      case 'vape':
        return '/cart';
      case 'concentrate':
        return '/g';
      case 'flower':
        return '/g';
      case 'edible':
        return '/pack';
      case 'moonwater':
        return '/bottle';
      default:
        return '/each';
    }
  };

  const getIconStyling = () => {
    if (productType === 'vape') {
      // Vape icons - no backdrop, larger size, positioned further right
      return {
        container: "absolute bottom-2 -right-4 w-32 h-32 opacity-100 transition-all duration-300 transform group-hover/image:scale-110 shadow-lg flex items-center justify-center",
        image: "w-full h-full object-contain"
      };
    } else {
      // All other product types - with backdrop and border
      return {
        container: "absolute bottom-2 right-2 w-32 h-32 rounded-full overflow-hidden border-2 border-white/40 bg-black/30 backdrop-blur-sm opacity-80 group-hover/image:opacity-100 transition-all duration-300 transform group-hover/image:scale-110 shadow-lg flex items-center justify-center p-1",
        image: "w-full h-full object-contain"
      };
    }
  };

  const handleQuickView = (product: FeaturedProduct) => {
    // Navigate to the relevant collection page with the product highlighted
    const collectionPath = `/${productType}`;
    const productSlug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    // Navigate to collection page with product ID as a query parameter
    router.push(`${collectionPath}?highlight=${product.id}`);
  };

  if (products.length === 0) {
    return (
      <section className="py-16 bg-[#4a4a4a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
            <p className="text-white/70">Products coming soon...</p>
          </div>
        </div>
      </section>
    );
  }

  const iconStyling = getIconStyling();

  return (
    <>
      <section className="py-16 bg-[#4a4a4a]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            {title === "[shop moonwater]" ? (
              // Moonwater hero styling
              <h2 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 transform transition-all duration-700" 
                  style={{ 
                    fontFamily: 'Nunito Sans, Varela Round, sans-serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    animation: 'fadeInUp 0.8s ease-out'
                  }}>
                {title}
              </h2>
            ) : title === "Sweet. Then serious." ? (
              // Edible hero styling
              <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-wide transform hover:scale-105 transition-transform duration-200 uppercase mb-6">
                {title}
              </h2>
            ) : (
              // Default hero styling for flower, vape, concentrate
              <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-wide transform hover:scale-105 transition-transform duration-200 mb-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-white/70 mb-8">{subtitle}</p>
            )}
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Navigation Arrows */}
            {products.length > itemsPerView && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                  aria-label="Previous products"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                  aria-label="Next products"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Products Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="w-1/3 flex-shrink-0 px-4"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <div className="bg-black/30 rounded-xl p-6 h-full backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
                      {/* Product Image */}
                      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-black/20 relative group/image">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Moonwater Product Name Overlay */}
                        {productType === 'moonwater' && (
                          <div className="absolute top-0 left-0 right-0 flex flex-col justify-start items-center text-center px-3 pt-8 pointer-events-none transform -rotate-3 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2">
                            <h3 className="text-white font-bold text-4xl md:text-5xl mb-1 leading-none transform transition-all duration-700 animate-pulse group-hover:scale-110" 
                                style={{ 
                                  fontFamily: 'Nunito Sans, Varela Round, sans-serif',
                                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                                  animation: 'fadeInUp 0.8s ease-out'
                                }}>
                              {product.title.toLowerCase()}
                            </h3>
                            
                            <div className="text-white font-bold text-lg md:text-xl tracking-wider transform transition-all duration-500 group-hover:tracking-widest group-hover:scale-105" 
                                 style={{ 
                                   fontFamily: 'Space Mono, Roboto Mono, monospace',
                                   textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                                   animation: 'fadeInUp 1s ease-out 0.2s both'
                                 }}>
                              [{product.thc}mg]
                            </div>
                          </div>
                        )}
                        
                        {/* Product Type Icon Overlay */}
                        {showProductTypeIcon && (
                          <div className={iconStyling.container}>
                            <img
                              src={getProductIcon()}
                              alt={`${productType} indicator`}
                              className={iconStyling.image}
                            />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors">
                          {product.title}
                        </h3>
                        
                        <p className="text-white/70 text-sm line-clamp-2">
                          {product.description}
                        </p>

                        {/* Modern Product Details Grid */}
                        <div className="grid grid-cols-2 gap-0.5 mb-1.5 auto-rows-fr">
                          {/* THCa/THC Container */}
                          <div className="p-0.5 rounded-md bg-gradient-to-r from-white/5 to-white/2 border border-white/10 flex flex-col justify-between min-h-[2rem]">
                            <span className="text-white/70 text-xs font-light tracking-wide block mb-0">
                              {productType === 'edible' || productType === 'moonwater' ? 'THC' : 'THCa'}
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-light text-emerald-400">{product.thc}</span>
                              <span className="text-xs font-light text-emerald-400/70">
                                {productType === 'edible' || productType === 'moonwater' ? 'mg' : '%'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Type Container */}
                          <div className="p-0.5 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8 flex flex-col justify-between min-h-[2rem]">
                            <span className="text-white/70 text-xs font-light tracking-wide block mb-0">
                              Type
                            </span>
                            <span className={`px-1.5 py-0.5 rounded-full text-xs font-light tracking-wide ${
                              product.category === 'indica' ? 'bg-purple-500/25 text-purple-300' :
                              product.category === 'sativa' ? 'bg-yellow-500/25 text-yellow-300' :
                              'bg-green-500/25 text-green-300'
                            }`}>
                              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                            </span>
                          </div>

                          {/* Terpene Container (if available) */}
                          {product.terpenes && product.terpenes.length > 0 && (
                            <div className="p-0.5 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8 flex flex-col justify-between min-h-[2rem]">
                              <span className="text-white/70 text-xs font-light tracking-wide block mb-0">Terpene</span>
                              <span className="text-amber-400 text-xs hover:text-amber-300 transition-colors duration-300 capitalize">
                                {product.terpenes[0]}
                              </span>
                            </div>
                          )}

                          {/* Nose Container (if available) */}
                          {product.nose && Array.isArray(product.nose) && product.nose.length > 0 && (
                            <div className="p-0.5 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8 flex flex-col justify-between min-h-[2rem]">
                              <span className="text-white/70 text-xs font-light tracking-wide block mb-0">Nose</span>
                              <div className="flex flex-wrap gap-1">
                                {product.nose.slice(0, 2).map((note, idx) => (
                                  <span key={idx} className="text-white/90 text-xs hover:text-white transition-colors duration-300 capitalize">
                                    {note}{idx < Math.min(product.nose!.length, 2) - 1 && ', '}
                                  </span>
                                ))}
                                {product.nose.length > 2 && <span className="text-white/60 text-xs">+{product.nose.length - 2}</span>}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Price and Stock */}
                        <div className="flex justify-between items-center pt-2">
                          <div>
                            <span className="text-2xl font-bold text-white">
                              ${formatPrice(product.price)}
                            </span>
                            <span className="text-white/50 text-sm ml-1">
                              {getPriceUnit()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {product.inStock ? (
                              <span className="text-green-400 text-xs">In Stock</span>
                            ) : (
                              <span className="text-red-400 text-xs">Out of Stock</span>
                            )}
                          </div>
                        </div>

                        {/* Quick View Button */}
                        <button
                          onClick={() => handleQuickView(product)}
                          className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            {products.length > itemsPerView && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


    </>
  );
} 