"use client"

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { MoonwaterProductWithVariations } from '../constants';
import MoonwaterGrid from './MoonwaterGrid';

import ReviewsSection from '@/components/product/ReviewsSection';
import Section from '../../components/Section';



interface MoonwaterPageProps {
  products: MoonwaterProductWithVariations[];
}

function MoonwaterPageContent({ products }: MoonwaterPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  // State management - simplified without filters
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [format, setFormat] = useState<string>('bottle');
  const [isLoading, setIsLoading] = useState(true);

  // Handle URL parameters for format
  useEffect(() => {
    const formatParam = searchParams.get('format');
    if (formatParam && ['bottle', 'pack'].includes(formatParam)) {
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
    return products as MoonwaterProductWithVariations[];
  }, [products]);

  // Handle product click
  const handleProductClick = (product: MoonwaterProductWithVariations) => {
    // Navigate to product detail or open modal
    console.log('Product clicked:', product.title);
  };

  // Handle option selection (flavor, pack size)
  const handleOptionSelect = (productId: number, option: string) => {
    setSelectedOptions(prev => ({ ...prev, [productId]: option }));
  };

  // Handle add to cart
  const handleAddToCart = async (product: MoonwaterProductWithVariations, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get selected variation details
    const selectedOption = selectedOptions[product.id];
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      weight: 'bottle', // Default weight for moonwater
      quantity: 1,
      variation: null as any
    };

    // If product has variations, get the selected variation
    if (product.isVariable && product.variations?.length > 0) {
      const selectedFlavor = selectedOption?.includes('flavor-') ? selectedOption.split('flavor-')[1] : null;
      const selectedPackSize = selectedOption?.includes('pack-') ? selectedOption.split('pack-')[1] : null;
      
      const matchingVariation = product.variations.find((v: any) => 
        (!selectedFlavor || v.flavor === selectedFlavor) && 
        (!selectedPackSize || v.packSize === selectedPackSize)
      ) || product.variations[0];

      cartItem.price = matchingVariation.price;
      cartItem.variation = {
        flavor: matchingVariation.flavor,
        packSize: matchingVariation.packSize
      };
    }

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
        <div className="text-white/60 text-lg">Loading moonwater collection...</div>
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
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
              top: '10%',
              left: '10%',
              animationDuration: '4s'
            }}
          ></div>
          
          <div 
            className="absolute w-24 h-24 md:w-36 md:h-36 rounded-full blur-lg animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
              bottom: '15%',
              right: '15%',
              animationDuration: '6s',
              animationDelay: '2s'
            }}
          ></div>
          
          <div 
            className="absolute w-28 h-28 md:w-44 md:h-44 rounded-full blur-md animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(147, 197, 253, 0.34) 0%, transparent 70%)',
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
            <h1 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl leading-tight transform transition-all duration-700" 
                style={{ 
                  fontFamily: 'Nunito Sans, Varela Round, sans-serif',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  animation: 'fadeInUp 0.8s ease-out'
                }}>
              [shop moonwater]
            </h1>
            <h2 className="text-white/90 text-base md:text-lg lg:text-xl font-light tracking-wide opacity-0 animate-fadeInUp" 
                style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Pop, sip, float.
            </h2>
          </div>
        </div>

        {/* Quality Banner - matches other collection pages */}
        <div 
          className="absolute bottom-4 left-4 right-4 px-4 py-3 md:bottom-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:px-6 md:rounded-full z-50 w-auto md:w-auto rounded-full"
          style={{
            background: 'transparent',
            backdropFilter: 'blur(12px) saturate(200%)',
            WebkitBackdropFilter: 'blur(12px) saturate(200%)',
            backgroundColor: 'rgba(74, 74, 74, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex items-center justify-center gap-2 md:gap-4 text-center">
            <span className="text-white/90 font-medium text-xs md:text-sm lg:text-base">✓ All Natural Ingredients</span>
            <span className="text-white/40">•</span>
            <span className="text-white/90 font-medium text-xs md:text-sm lg:text-base">✓ Fast-acting</span>
            <span className="text-white/40">•</span>
            <span className="text-white/90 font-medium text-xs md:text-sm lg:text-base">✓ Refreshing</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <MoonwaterGrid
        products={displayedProducts}
        selectedOptions={selectedOptions}
        loadedImages={loadedImages}
        format={format}
        onProductClick={handleProductClick}
        onOptionSelect={handleOptionSelect}
        onAddToCart={handleAddToCart}
        onImageLoad={handleImageLoad}
        onClearFilters={() => {}} // Empty function since no filters
      />

      {/* Reviews Section */}
      <ReviewsSection productType="moonwater" />

      {/* Quality Section */}
      <Section className="bg-gradient-to-br from-[#4a4a4a] to-[#464646] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
              {format === 'bottle' ? 'Liquid Elevation. Pure Hydration.' : 'Stock Up. Stay Lifted.'}
            </h2>
            <p className="text-xl text-white/80 font-light opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
              {format === 'bottle' 
                ? 'Every bottle is crafted for smooth effects and incredible taste.'
                : 'Multi-packs for those who know what they like and want more of it.'
              }
            </p>
          </div>

          {/* Quality Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {format === 'bottle' ? (
              <>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-green-400 to-green-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Natural Ingredients</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Pure water infused with premium hemp extract. No artificial flavors, just natural refreshment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-blue-400 to-blue-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Fast-Acting Formula</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Advanced nano-emulsion technology for rapid onset. Feel the effects within 15-30 minutes.
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
                        <h3 className="text-white/90 font-medium text-lg mb-2">Precise Dosing</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Consistent 10mg THC per bottle. Perfect for micro-dosing or sharing with friends.
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
                      <div className="w-1 h-16 bg-gradient-to-b from-green-400 to-green-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Bulk Savings</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Save more when you buy in bulk. Perfect for regular users who want the best value.
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
                        <h3 className="text-white/90 font-medium text-lg mb-2">Party-Ready Packs</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Perfect for gatherings, events, or just keeping your fridge stocked. Shareable sizes for any occasion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-cyan-400 to-cyan-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Mix & Match Flavors</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Build your own variety pack. Try different flavors and effects to find your perfect rotation.
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
              {format === 'bottle' 
                ? 'Experience cannabis in its most refreshing form. Moonwater delivers consistent effects with unmatched taste and quality.'
                : 'Stock up on your favorites and never run out. Moonwater packs offer convenience, value, and variety in every order.'
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

export default function MoonwaterPage({ products }: MoonwaterPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#4a4a4a] flex items-center justify-center">
        <div className="text-white/60 text-lg">Loading moonwater collection...</div>
      </div>
    }>
      <MoonwaterPageContent products={products} />
    </Suspense>
  );
} 