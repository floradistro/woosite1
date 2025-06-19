"use client"

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { VAPE_PRODUCTS, WEIGHT_PRICING, DISPOSABLE_PRICING, type FilterState, type FeaturedProduct, type ProductFormat } from './constants';
import { filterProducts } from './utils';
import Section from '../components/Section';
import SectionHeader from '../components/SectionHeader';

// Import new components
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import DenseView from './components/DenseView';
import SubscriptionSection from './components/SubscriptionSection';
import ReviewsSection from './components/ReviewsSection';

function VapeCollectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  // State
  const [selectedWeights, setSelectedWeights] = useState<Record<number, string>>({});
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState<'all' | 'indica' | 'sativa' | 'hybrid'>('all');
  const [filterVibe, setFilterVibe] = useState<'all' | 'relax' | 'energize' | 'balance'>('all');
  const [filterNose, setFilterNose] = useState<'all' | 'candy' | 'gas' | 'cake' | 'funk' | 'sherb'>('all');
  const format: ProductFormat = 'cartridge'; // Fixed format
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Handle URL parameters for filters only
  useEffect(() => {
    const typeParam = searchParams.get('type');
    
    // Handle type parameter for category filtering
    if (typeParam && ['indica', 'sativa', 'hybrid'].includes(typeParam)) {
      setFilterCategory(typeParam as 'indica' | 'sativa' | 'hybrid');
    }
  }, [searchParams]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filters = {
      category: filterCategory === 'all' ? [] : [filterCategory],
      vibe: filterVibe === 'all' ? [] : [filterVibe],
      nose: filterNose === 'all' ? [] : [filterNose]
    };
    const products = filterProducts(VAPE_PRODUCTS, filters);
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'thc':
        return [...products].sort((a, b) => b.thc - a.thc);
      default:
        return products;
    }
  }, [filterCategory, filterVibe, filterNose, sortBy]);

  // Handle weight selection
  const handleWeightSelect = (productId: number, weight: string) => {
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };

  // Handle add to cart
  const handleAddToCart = (product: FeaturedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultWeight = '0.5g';
    const weight = selectedWeights[product.id] || defaultWeight;
    const pricing = WEIGHT_PRICING;
    const price = pricing[weight as keyof typeof pricing];
    
    addToCart({
      id: product.id,
      title: product.title,
      price: price,
      weight: weight,
      image: product.image
    }, 1);
  };

  // Handle product click
  const handleProductClick = (product: FeaturedProduct) => {
    const handle = product.title.toLowerCase().replace(/\s+/g, '-');
    router.push(`/product/${handle}`);
  };

  // Handle image load
  const handleImageLoad = (productId: number) => {
    setLoadedImages(prev => new Set([...prev, productId]));
  };

  // Clear filters
  const clearFilters = () => {
    setFilterCategory('all');
    setFilterVibe('all');
    setFilterNose('all');
  };

  // Dummy function for FilterBar compatibility
  const handleFormatChange = (newFormat: ProductFormat) => {
    // No-op since format is fixed
  };

  // Render the appropriate view component
  const renderProductView = () => {
    const commonProps = {
      products: filteredAndSortedProducts,
      selectedWeights,
      loadedImages,
      format,
      onProductClick: handleProductClick,
      onWeightSelect: handleWeightSelect,
      onAddToCart: handleAddToCart,
      onImageLoad: handleImageLoad,
      onClearFilters: clearFilters
    };

    // Always render DenseView
    return <DenseView {...commonProps} />;
  };

  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white">
      {/* Hero Section */}
      <HeroSection format={format} />

      {/* Filter Bar */}
      <FilterBar
        sortBy={sortBy}
        filterCategory={filterCategory}
        filterVibe={filterVibe}
        filterNose={filterNose}
        format={format}
        onSortChange={setSortBy}
        onCategoryChange={setFilterCategory}
        onVibeChange={setFilterVibe}
        onNoseChange={setFilterNose}
        onFormatChange={handleFormatChange}
        productCount={filteredAndSortedProducts.length}
        totalCount={VAPE_PRODUCTS.length}
      />

      {/* Product View */}
      {renderProductView()}

      {/* Vape Subscription Section */}
      <SubscriptionSection />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* We Ship Fire Section */}
      <section className="relative bg-[#4a4a4a] overflow-hidden -mt-px" style={{ 
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)'
      }}>
        <div className="relative z-10 py-16 px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-12 opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]">
              <h2 className="text-4xl md:text-5xl font-extralight tracking-wide mb-4">
                Premium Oil. Pure Potency.
              </h2>
              <p className="text-xl text-white/80 font-light">
                Every cartridge is crafted for maximum impact.
              </p>
              <p className="text-lg text-white/60 font-light mt-2">
                If it doesn't hit clean, it's out. No compromises.
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-3 gap-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-amber-400 to-amber-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        Lab-Tested Excellence
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        No mystery oils. No cutting agents. Every batch tested for purity and potency—because your lungs deserve transparency.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-emerald-400 to-emerald-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        Premium Hardware Only
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        Ceramic coils. Glass tanks. No cheap metals. Hardware that respects the oil inside.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-blue-400 to-blue-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        Strain-Specific Profiles
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        Real terpenes from real strains. No fake flavors. If it says Blue Dream, it tastes like Blue Dream.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Statement */}
            <div className="mt-12 text-center opacity-0 animate-[fadeInUp_1s_ease-out_0.7s_forwards]">
              <div className="inline-block">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/30"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30"></div>
                </div>
                <p className="text-xl text-white/85 font-light leading-relaxed">
                  You won't find hotdog water in fancy packaging here.
                </p>
                <p className="text-lg text-emerald-400 font-medium mt-2">
                  You get premium oil, clean hits, and verified potency.
                </p>
              </div>
            </div>

            {/* Visual Elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Dispensary Standards. Ecom Speed. Section */}
      <Section id="vape-experience-section">
        <div className="relative z-10 py-8 w-full">
          <SectionHeader 
            title="Fresh Stock. Fast Delivery."
            subtitle="Quality in Motion."
            delay="0.3s"
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 pb-8">
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            {/* Same-Day Shipouts */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Same-Day <span className="text-blue-400">Processing</span>
              </h3>
              <p className="text-white/70 font-light">
                Orders placed by 2PM ship within hours.
              </p>
            </div>
            
            {/* Packed Fresh */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Fresh <span className="text-green-400">Inventory Only.</span>
              </h3>
              <p className="text-white/70 font-light">
                Every cartridge is batch-dated and rotation-managed.
              </p>
            </div>
            
            {/* Local Faster */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Local? <span className="text-purple-400">Lightning Fast.</span>
              </h3>
              <p className="text-white/70 font-light">
                Most local orders arrive next day. Many land same day.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Loading fallback component
function VapePageLoading() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading vape collection...</p>
      </div>
    </div>
  );
}

export default function VapeCollectionPage() {
  return (
    <Suspense fallback={<VapePageLoading />}>
      <VapeCollectionContent />
    </Suspense>
  );
}