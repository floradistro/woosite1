'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FeaturedProduct } from '../flower/constants';
import QuickViewModal from './QuickViewModal';

interface VapeConcentrateCarouselProps {
  initialVapeProducts: FeaturedProduct[];
  initialConcentrateProducts: FeaturedProduct[];
}

export default function VapeConcentrateCarousel({ 
  initialVapeProducts, 
  initialConcentrateProducts 
}: VapeConcentrateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<FeaturedProduct | null>(null);

  // Get 3 of each product type
  const vapeProducts = initialVapeProducts.slice(0, 3);
  const concentrateProducts = initialConcentrateProducts.slice(0, 3);
  
  // Create combined array alternating vapes and concentrates
  const combinedProducts: (FeaturedProduct & { productType: 'vape' | 'concentrate' })[] = [];
  for (let i = 0; i < Math.max(vapeProducts.length, concentrateProducts.length); i++) {
    if (vapeProducts[i]) {
      combinedProducts.push({ ...vapeProducts[i], productType: 'vape' });
    }
    if (concentrateProducts[i]) {
      combinedProducts.push({ ...concentrateProducts[i], productType: 'concentrate' });
    }
  }

  const itemsPerView = 3;
  const maxIndex = Math.max(0, combinedProducts.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-advance carousel
  useEffect(() => {
    if (combinedProducts.length <= itemsPerView) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [combinedProducts.length, itemsPerView, maxIndex]);

  const formatPrice = (price: number) => {
    return price.toFixed(0);
  };

  if (combinedProducts.length === 0) {
    return (
      <section className="py-16 bg-[#4a4a4a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Premium Vapes & Concentrates
            </h2>
            <p className="text-white/70">Products coming soon...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-[#4a4a4a]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Premium Vapes & Concentrates</h2>
            <p className="text-white/70 mb-8">
              {vapeProducts.length} Vapes • {concentrateProducts.length} Concentrates
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Navigation Arrows */}
            {combinedProducts.length > itemsPerView && (
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
                {combinedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-1/3 flex-shrink-0 px-4"
                  >
                <div className="bg-black/30 rounded-xl p-6 h-full backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
                  {/* Product Image */}
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-black/20 relative group/image">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Category Icon Overlay */}
                    {product.productType === 'vape' ? (
                      /* Vape icon - no backdrop, 2x larger size */
                      <div className="absolute bottom-2 -right-4 w-32 h-32 opacity-100 transition-all duration-300 transform group-hover/image:scale-110 shadow-lg flex items-center justify-center">
                        <img
                          src="/icons/vapeicon2.png"
                          alt="Vape indicator"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      /* Concentrate icon - with backdrop and border, same size as vape */
                      <div className="absolute bottom-2 right-2 w-32 h-32 rounded-full overflow-hidden border-2 border-white/40 bg-black/30 backdrop-blur-sm opacity-80 group-hover/image:opacity-100 transition-all duration-300 transform group-hover/image:scale-110 shadow-lg flex items-center justify-center p-1">
                        <img
                          src="/icons/concentrate.png"
                          alt="Concentrate indicator"
                          className="w-full h-full object-contain"
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
                      {/* THCa Container */}
                      <div className="p-0.5 rounded-md bg-gradient-to-r from-white/5 to-white/2 border border-white/10 flex flex-col justify-between min-h-[2rem]">
                        <span className="text-white/70 text-xs font-light tracking-wide block mb-0">
                          THCa
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-light text-emerald-400">{product.thc}</span>
                          <span className="text-xs font-light text-emerald-400/70">%</span>
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
                          {product.productType === 'vape' ? '/cart' : '/g'}
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
                      onClick={() => setSelectedProduct(product)}
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
        {combinedProducts.length > itemsPerView && (
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

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, weight) => {
            // Handle add to cart logic here
            console.log('Adding to cart:', product, weight);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
} 