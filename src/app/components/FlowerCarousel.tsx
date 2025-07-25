"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CarouselContainer from './CarouselContainer';
import { getFlowerProducts, type FeaturedProduct, WEIGHT_PRICING } from '../flower/constants';
import { carouselStyles } from '@/styles/shared';

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
  const [selectedWeights, setSelectedWeights] = useState<Record<number, string>>({});
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

  const handleWeightSelect = (productId: number, weight: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };

  const handleImageLoad = (productId: number) => {
    setLoadedImages(prev => new Set([...prev, productId]));
  };

  const handleAddToCart = (product: FeaturedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log('Adding to cart:', product.title);
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
    return null;
  }

  return (
    <section className="relative bg-[#4a4a4a] overflow-hidden -mt-px" style={{ 
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)'
    }}>
      {/* Section Header */}
      <div className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-thin text-white mb-4 tracking-wide">
              {title}
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-light max-w-2xl mx-auto mb-8">
              {subtitle}
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="w-full relative z-10 pb-16">
        <CarouselContainer 
          style={carouselStyles.enhanced}
          arrowIdPrefix="flower-carousel"
        >
          {products.map((product, index) => {
            const selectedWeight = selectedWeights[product.id] || '3.5g';
            const price = WEIGHT_PRICING[selectedWeight as keyof typeof WEIGHT_PRICING];
            const isImageLoaded = loadedImages.has(product.id);

            return (
              <div 
                key={product.id}
                className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw] xl:w-[25vw] snap-center px-3 first:pl-6 last:pr-6"
                onClick={() => handleProductClick(product)}
              >
                <div className="group relative cursor-pointer bg-gradient-to-br from-white/8 to-white/3 hover:from-white/12 hover:to-white/6 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                  
                  {/* Product Image */}
                  <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-xl bg-black/20">
                    {!isImageLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={product.title}
                      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                        isImageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => handleImageLoad(product.id)}
                      loading="lazy"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        product.category === 'indica' ? 'bg-purple-600/80 border-purple-500 text-white' :
                        product.category === 'sativa' ? 'bg-yellow-600/80 border-yellow-500 text-black' :
                        'bg-green-600/80 border-green-500 text-white'
                      } backdrop-blur-sm`}>
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </div>

                    {/* THC Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 border border-white/30 text-white backdrop-blur-sm">
                        {product.thc}% THC
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2 capitalize group-hover:text-emerald-300 transition-colors duration-300">
                        {product.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Nose Profile */}
                    <div className="flex flex-wrap gap-2">
                      {product.nose.map((noseType) => (
                        <span 
                          key={noseType}
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${
                            noseType === 'candy' ? 'bg-pink-500/20 border-pink-400/30 text-pink-200' :
                            noseType === 'gas' ? 'bg-gray-500/20 border-gray-400/30 text-gray-200' :
                            noseType === 'cake' ? 'bg-amber-400/20 border-amber-300/30 text-amber-200' :
                            noseType === 'funk' ? 'bg-violet-500/20 border-violet-400/30 text-violet-200' :
                            'bg-emerald-500/20 border-emerald-400/30 text-emerald-200'
                          }`}
                        >
                          {noseType}
                        </span>
                      ))}
                    </div>

                    {/* Weight Selection */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(WEIGHT_PRICING).map((weight) => (
                          <button
                            key={weight}
                            onClick={(e) => handleWeightSelect(product.id, weight, e)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedWeight === weight
                                ? 'bg-emerald-500 text-white border-emerald-400'
                                : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:border-white/30'
                            } border`}
                          >
                            {weight}
                          </button>
                        ))}
                      </div>

                      {/* Stock Status */}
                      {(product as any).stockQuantity !== undefined && (
                        <div className="text-xs mb-2">
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

                      {/* Price and Add to Cart */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-2xl font-light text-white">
                          <span className="text-green-400">$</span>{price}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={!(product as any).inStock}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                            (product as any).inStock === false 
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          }`}
                        >
                          {(product as any).inStock === false ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CarouselContainer>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/flower')}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            View All Flower Products
          </button>
        </div>
      </div>
    </section>
  );
} 