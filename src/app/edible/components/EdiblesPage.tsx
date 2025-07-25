"use client"

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { FeaturedProduct, SINGLE_PRICING, PACK_PRICING, SINGLE_SIZES, PACK_SIZES } from '../constants';
import EdiblesGrid from './EdiblesGrid';

import ReviewsSection from '@/components/product/ReviewsSection';
import Section from '../../components/Section';

interface EdiblesPageProps {
  products: FeaturedProduct[];
}

function EdiblesPageContent({ products }: EdiblesPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  // State management
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [format, setFormat] = useState<string>('single');
  const [isLoading, setIsLoading] = useState(true);

  // Handle URL parameters for format
  useEffect(() => {
    const formatParam = searchParams.get('format');
    if (formatParam && ['single', 'bulk'].includes(formatParam)) {
      setFormat(formatParam);
    }
  }, [searchParams]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Use products directly without filtering
  const displayedProducts = useMemo(() => {
    return products as FeaturedProduct[];
  }, [products]);

  // Get pricing and sizes based on format
  const pricing = format === 'single' ? SINGLE_PRICING : PACK_PRICING;
  const sizes = format === 'single' ? [...SINGLE_SIZES] : [...PACK_SIZES];

  // Handle product click
  const handleProductClick = (product: FeaturedProduct) => {
    // Navigate to product detail or open modal
    console.log('Product clicked:', product.title);
  };

  // Handle option selection (quantity/size)
  const handleOptionSelect = (productId: number, option: string) => {
    setSelectedOptions(prev => ({ ...prev, [productId]: option }));
  };

  // Handle add to cart
  const handleAddToCart = async (product: FeaturedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const selectedOption = selectedOptions[product.id] || sizes[0];
    const price = pricing[selectedOption as keyof typeof pricing] || product.price;
    
    const cartItem = {
      id: product.id,
      title: product.title,
      price: price,
      image: product.image,
      weight: selectedOption,
      quantity: 1,
      variation: null as any
    };

    try {
      await addToCart(cartItem);
      console.log('Added to cart:', cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Handle image load
  const handleImageLoad = (productId: number) => {
    setLoadedImages(prev => new Set([...prev, productId]));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#4a4a4a] flex items-center justify-center">
        <div className="text-white/60 text-lg">Loading edible collection...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white">
      {/* Extended dot grid background that flows behind header nav and banner */}
      <div 
        className="fixed top-0 left-0 right-0 z-[-1] opacity-22"
        style={{
          height: 'calc(100vh * 0.4)', // Cover top 40% of viewport
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.45) 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0',
          pointerEvents: 'none'
        }}
      ></div>

      <section className="relative h-48 md:h-56 lg:h-64 overflow-hidden bg-[#4a4a4a] animate-fadeIn">
        {/* Gradient spots */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-32 h-32 md:w-52 md:h-52 rounded-full blur-xl animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
              top: '10%',
              left: '10%',
              animationDuration: '4s'
            }}
          ></div>
          
          <div 
            className="absolute w-24 h-24 md:w-36 md:h-36 rounded-full blur-lg animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, transparent 70%)',
              bottom: '15%',
              right: '15%',
              animationDuration: '6s',
              animationDelay: '2s'
            }}
          ></div>
          
          <div 
            className="absolute w-28 h-28 md:w-44 md:h-44 rounded-full blur-md animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.34) 0%, transparent 70%)',
              top: '20%',
              right: '40%',
              animationDuration: '5.5s',
              animationDelay: '1.5s'
            }}
          ></div>
        </div>

        {/* Local dot grid background for fallback */}
        <div className="absolute inset-0 opacity-22" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.45) 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0'
        }}></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-3 animate-fadeInUp px-6">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-wide transform hover:scale-105 transition-transform duration-200 uppercase">
              Sweet. Then serious.
            </h1>
            <h2 className="text-white/90 text-base md:text-lg lg:text-xl font-light tracking-wide max-w-2xl mx-auto drop-shadow-lg opacity-0 animate-fadeInUp" 
                style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Flavor first. Effect guaranteed.
            </h2>
          </div>
        </div>

        {/* Quality Banner - matches other collection pages */}
        <div 
          className="absolute bottom-0 left-0 right-0 px-4 py-3 md:bottom-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:px-6 md:rounded-full z-50 w-full md:w-auto"
          style={{
            background: 'transparent',
            backdropFilter: 'blur(12px) saturate(200%)',
            WebkitBackdropFilter: 'blur(12px) saturate(200%)',
            backgroundColor: 'rgba(74, 74, 74, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex items-center justify-center gap-2 md:gap-4 text-center">
            <span className="text-white/90 font-medium text-xs md:text-sm lg:text-base">✓ Precisely Dosed</span>
            <span className="text-white/40">•</span>
            <span className="text-white/90 font-medium text-xs md:text-sm lg:text-base">✓ Artisan Quality</span>
            <span className="text-white/40">•</span>
            <span className="text-white/90 font-medium text-xs md:text-sm lg:text-base">✓ Delicious</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <EdiblesGrid
        products={displayedProducts}
        selectedOptions={selectedOptions}
        loadedImages={loadedImages}
        format={format}
        pricing={pricing}
        sizes={sizes}
        onProductClick={handleProductClick}
        onOptionSelect={handleOptionSelect}
        onAddToCart={handleAddToCart}
        onImageLoad={handleImageLoad}
        onClearFilters={() => {}} // Empty function since no filters
      />

      {/* Reviews Section */}
      <ReviewsSection productType="edible" />

      {/* Quality Section */}
      <Section className="bg-gradient-to-br from-[#4a4a4a] to-[#464646] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
              {format === 'single' ? 'Precision Dosed. Deliciously Crafted.' : 'Stock Up. Save More.'}
            </h2>
            <p className="text-xl text-white/80 font-light opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
              {format === 'single' 
                ? 'Every edible is precisely dosed for consistent, reliable effects.'
                : 'Bulk packs for those who know what works and want to save.'
              }
            </p>
          </div>

          {/* Quality Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {format === 'single' ? (
              <>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-pink-400 to-pink-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Artisan Quality</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Small-batch production with premium ingredients. Real fruit, real chocolate, real flavor—no artificial nonsense.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-orange-400 to-orange-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Lab-Tested Consistency</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Every batch tested for potency and purity. Consistent dosing in every piece, guaranteed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-purple-400 to-purple-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Onset You Can Trust</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Feel it in 30-60 minutes. Effects last 4-6 hours. Predictable, reliable, enjoyable.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-pink-400 to-pink-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Value Pricing</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          The more you buy, the more you save. Stock up on your favorites without breaking the bank.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-orange-400 to-orange-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Freshness Guaranteed</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Individually wrapped for freshness. Long shelf life means you can stock up worry-free.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-purple-400 to-purple-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Perfect for Sharing</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Great for parties, events, or just having plenty on hand. Share the experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Statement */}
          <div className="text-center mt-16 opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
            <p className="text-lg text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              {format === 'single' 
                ? 'You won\'t find chalky, bitter edibles here. You get delicious, precisely-dosed treats that actually taste good.'
                : 'You won\'t find overpriced single servings here. You get bulk value without compromising on quality.'
              }
            </p>
          </div>
        </div>
      </Section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function EdiblesPage({ products }: EdiblesPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#4a4a4a] flex items-center justify-center">
        <div className="text-white/60 text-lg">Loading edible collection...</div>
      </div>
    }>
      <EdiblesPageContent products={products} />
    </Suspense>
  );
} 