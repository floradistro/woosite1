"use client"

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { MoonwaterProductWithVariations, FeaturedProduct } from '../constants';
import { filterProducts } from '../utils';
import MoonwaterGrid from './MoonwaterGrid';
import HeroSection from '@/components/product/HeroSection';
import FilterBar from '@/components/product/FilterBar';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';
import Section from '../../components/Section';

// Filter types specific to moonwater
type MoonwaterFilterType = 'all' | 'indica' | 'sativa' | 'hybrid';
type MoonwaterVibeType = 'all' | 'relax' | 'energize' | 'balance';
type MoonwaterFlavorType = 'all' | 'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint';

interface MoonwaterPageProps {
  products: MoonwaterProductWithVariations[];
}

function MoonwaterPageContent({ products }: MoonwaterPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  // State management
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState<MoonwaterFilterType>('all');
  const [filterVibe, setFilterVibe] = useState<MoonwaterVibeType>('all');
  const [filterFlavor, setFilterFlavor] = useState<MoonwaterFlavorType>('all');
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filters = {
      category: filterCategory === 'all' ? [] : [filterCategory],
      vibe: filterVibe === 'all' ? [] : [filterVibe],
      flavor: filterFlavor === 'all' ? [] : [filterFlavor]
    };
    
    const filtered = filterProducts(products, filters) as MoonwaterProductWithVariations[];
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'thc':
        return [...filtered].sort((a, b) => b.thc - a.thc);
      case 'name':
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [filterCategory, filterVibe, filterFlavor, sortBy, products]);

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

  // Handle format change
  const handleFormatChange = (newFormat: string) => {
    setFormat(newFormat);
    const params = new URLSearchParams(searchParams);
    params.set('format', newFormat);
    router.push(`/moonwater?${params.toString()}`);
  };

  // Handle image load
  const handleImageLoad = (productId: number) => {
    setLoadedImages(prev => new Set([...prev, productId]));
  };

  // Clear filters
  const clearFilters = () => {
    setFilterCategory('all');
    setFilterVibe('all');
    setFilterFlavor('all');
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
      {/* Hero Section */}
      <HeroSection
        productType="moonwater"
        format={format}
        title={{
          primary: "Liquid Bliss.",
          secondary: "Hydrate & Elevate."
        }}
        subtitle={{
          primary: "Cannabis-Infused Beverages",
          secondary: "Moonwater Multi-Packs"
        }}
        features={format === 'bottle' ? ["Nano-enhanced", "Fast-acting"] : ["Stock up", "Perfect for sharing"]}
        qualityBadges={format === 'bottle' ? ["THC", "Fast-acting"] : ["Multi-packs", "Perfect for sharing"]}
      />

      {/* Filter Bar */}
      <FilterBar
        sortBy={sortBy}
        filterCategory={filterCategory}
        filterVibe={filterVibe}
        filterFlavor={filterFlavor}
        format={format}
        formats={{ primary: 'bottle', secondary: 'pack' }}
        onSortChange={setSortBy}
        onCategoryChange={setFilterCategory}
        onVibeChange={setFilterVibe}
        onFlavorChange={setFilterFlavor}
        onFormatChange={handleFormatChange}
        productCount={filteredProducts.length}
        totalCount={products.length}
      />

      {/* Products Grid */}
      <MoonwaterGrid
        products={filteredProducts}
        selectedOptions={selectedOptions}
        loadedImages={loadedImages}
        format={format}
        onProductClick={handleProductClick}
        onOptionSelect={handleOptionSelect}
        onAddToCart={handleAddToCart}
        onImageLoad={handleImageLoad}
        onClearFilters={clearFilters}
      />

      {/* Subscription Section - only show for bottle format */}
      {format === 'bottle' && <SubscriptionSection productType="moonwater" />}

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

          <div className="grid md:grid-cols-3 gap-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            {format === 'bottle' ? (
              <>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-blue-400 to-blue-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Nano-Enhanced Absorption</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Advanced nano-emulsion technology for faster onset and better bioavailability. Feel it in minutes, not hours.
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
                        <h3 className="text-white/90 font-medium text-lg mb-2">All-Natural Ingredients</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Real fruit extracts. Natural terpenes. No artificial anything. Just clean, refreshing cannabis beverages.
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
                        <h3 className="text-white/90 font-medium text-lg mb-2">Precisely Dosed</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          Consistent 10mg THC per bottle. No guessing, no surprises. Just reliable, repeatable effects every time.
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
                      <div className="w-1 h-16 bg-gradient-to-b from-blue-400 to-blue-400/20 rounded-full"></div>
                      <div>
                        <h3 className="text-white/90 font-medium text-lg mb-2">Bulk Savings</h3>
                        <p className="text-white/70 font-light leading-relaxed">
                          The more you buy, the more you save. Stock up on your favorites and never run dry.
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
          <div className="text-center mt-16 opacity-0 animate-[fadeInUp_1s_ease-out_0.7s_forwards]">
            <p className="text-lg text-white/70 mb-2">
              {format === 'bottle' 
                ? "You won't find chalky, artificial drinks here."
                : "You won't find overpriced singles here."
              }
            </p>
            <p className="text-xl font-medium text-blue-300">
              {format === 'bottle'
                ? "You get smooth, delicious cannabis beverages that actually taste good."
                : "You get value packs that make sense for your lifestyle."
              }
            </p>
          </div>
        </div>
      </Section>
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