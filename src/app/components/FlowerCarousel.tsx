"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFlowerProducts, type FeaturedProduct, WEIGHT_PRICING } from '../flower/constants';
import Section from './Section';
import Image from 'next/image';

interface FlowerCarouselProps {
  title?: string;
  subtitle?: string;
  initialProducts?: FeaturedProduct[];
}

export default function FlowerCarousel({ 
  title = "Premium Flower Selection",
  subtitle = "Hand-curated strains for every experience",
  initialProducts = []
}: FlowerCarouselProps) {
  const router = useRouter();
  const [products, setProducts] = useState<FeaturedProduct[]>(initialProducts);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(!initialProducts.length);

  useEffect(() => {
    // Only fetch if no initial products provided (client-side navigation)
    if (initialProducts.length === 0) {
      const loadProducts = async () => {
        try {
          const flowerProducts = await getFlowerProducts();
          // Take only first 6 products
          setProducts(flowerProducts.slice(0, 6));
        } catch (error) {
          console.error('Error loading flower products:', error);
          setProducts([]);
        } finally {
          setIsLoading(false);
        }
      };

      loadProducts();
    }
  }, [initialProducts.length]);

  const handleProductClick = (product: FeaturedProduct) => {
    router.push('/flower');
  };

  const handleOptionSelect = (productId: number, option: string) => {
    setSelectedOptions(prev => ({ ...prev, [productId]: option }));
  };

  const handleImageLoad = (productId: number) => {
    setLoadedImages(prev => new Set([...prev, productId]));
  };

  const handleExploreClick = (product: FeaturedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/flower');
  };

  if (isLoading) {
    return (
      <section className="relative bg-[#4a4a4a] py-16">
        <div className="text-center">
          <div className="text-white/60 text-lg">Loading premium flower...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="relative bg-[#4a4a4a] py-16">
        <div className="text-center">
          <div className="text-white/60 text-lg">No flower products available</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style jsx>{`
        #flower-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>
            <Section className="bg-[#4a4a4a] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {title}
            </h2>
            <p className="text-lg text-white/80 font-light max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

        {/* Horizontal Scrolling Carousel */}
        <div className="relative">
          {/* Desktop Navigation Buttons */}
          <button
            onClick={() => {
              const carousel = document.getElementById('flower-carousel');
              if (carousel) {
                carousel.scrollBy({ left: -400, behavior: 'smooth' });
              }
            }}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full items-center justify-center text-white hover:text-white transition-all duration-200 hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => {
              const carousel = document.getElementById('flower-carousel');
              if (carousel) {
                carousel.scrollBy({ left: 400, behavior: 'smooth' });
              }
            }}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full items-center justify-center text-white hover:text-white transition-all duration-200 hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div 
            id="flower-carousel"
            className="flex gap-3 md:gap-2 overflow-x-auto pb-4 pl-0 pr-4 md:px-0" 
            style={{
              scrollBehavior: 'smooth',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {products.map((product, index) => {
              const selectedOption = selectedOptions[product.id] || Object.keys(WEIGHT_PRICING)[0];
              const isImageLoaded = loadedImages.has(product.id);

              return (
                <div 
                  key={product.id}
                  className={`flex-none w-[85vw] md:w-[calc(50vw-1rem)] lg:w-[calc(33.333vw-0.67rem)] xl:w-[calc(25vw-0.5rem)] scroll-snap-align-start ${index === 0 ? 'md:pl-0' : ''}`}
                  style={{ 
                    scrollSnapAlign: 'start',
                    paddingLeft: index === 0 ? '2px' : undefined
                  }}
                >
                  <div 
                    className="group relative cursor-pointer transition-all duration-200 opacity-100 translate-y-0"
                    style={{ transitionDelay: `${Math.min(index * 50, 600)}ms` }}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="bg-gradient-to-r from-white/5 to-white/2 hover:from-white/8 hover:to-white/5 backdrop-blur-sm transition-all duration-200 p-1.5 group-hover:shadow-xl relative rounded-lg">
                      
                      <div className="flex items-start gap-1.5 mb-3 md:mb-4">
                        {/* Product Image */}
                        <div 
                          className="relative w-50 h-50 md:w-48 md:h-48 flex-shrink-0 overflow-hidden rounded-lg cursor-pointer group/image bg-black/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                        >
                          {!isImageLoaded && (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-[shimmer_2s_ease-in-out_infinite]">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                            </div>
                          )}
                          
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 200px, 192px"
                            className={`object-cover transition-all duration-500 group-hover:scale-110 group-hover/image:scale-105 ${
                              isImageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => handleImageLoad(product.id)}
                            quality={85}
                            priority={index < 2}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 relative">
                          {/* Product Title */}
                          <h3 className="text-white font-medium text-lg md:text-xl mb-2 capitalize group-hover:text-emerald-300 transition-colors duration-300">
                            {product.title}
                          </h3>

                          {/* Category and THC */}
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            {/* Category */}
                            <div className="p-2 rounded-md bg-gradient-to-r from-white/5 to-white/2 border border-white/10">
                              <span className="text-white/70 text-xs font-light tracking-wide block mb-1">Type</span>
                              <div className={`text-sm font-medium capitalize ${
                                product.category === 'indica' ? 'text-purple-400' :
                                product.category === 'sativa' ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                {product.category}
                              </div>
                            </div>
                            
                            {/* THC */}
                            <div className="p-2 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8">
                              <span className="text-white/70 text-xs font-light tracking-wide block mb-1">THC</span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-sm font-medium text-emerald-400">{product.thc}</span>
                                <span className="text-xs font-light text-emerald-400/70">%</span>
                              </div>
                            </div>
                          </div>

                          {/* Nose Profile */}
                          {product.nose && product.nose.length > 0 && (
                            <div className="mb-3 p-2 rounded-md bg-gradient-to-r from-white/3 to-white/1 border border-white/8">
                              <span className="text-white/70 text-xs font-light tracking-wide block mb-1">Profile</span>
                              <div className="flex flex-wrap gap-1">
                                {product.nose.slice(0, 2).map((noseType) => (
                                  <span 
                                    key={noseType}
                                    className="text-white/90 text-xs font-light capitalize"
                                  >
                                    {noseType}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Stock Status */}
                          {(product as any).stockQuantity !== undefined && (
                            <div className="text-xs mb-2">
                              {(product as any).inStock ? (
                                <span className="text-green-400">In Stock</span>
                              ) : (
                                <span className="text-red-400">Out of Stock</span>
                              )}
                            </div>
                          )}

                          {/* Explore Button - CTA Style */}
                          <div className="flex justify-end">
                            <button
                              onClick={(e) => handleExploreClick(product, e)}
                              className="px-4 py-2 bg-black/20 hover:bg-black/30 border border-black/30 hover:border-black/40 rounded-lg text-sm text-white/80 hover:text-white font-light transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                              Explore Strain
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

          {/* Mobile Scroll Indicators */}
          <div className="flex md:hidden justify-center mt-4 gap-2">
            {products.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white/20 transition-all duration-200"
              />
            ))}
          </div>

          {/* Desktop Preview Cards */}
          <div className="hidden md:flex justify-center mt-4 gap-1 text-xs text-white/60">
            <span>Scroll to explore</span>
            <span>•</span>
            <span>{products.length} premium strains</span>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/flower')}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            View All Flower Products
          </button>
        </div>
      </div>
    </Section>
    </>
  );
} 