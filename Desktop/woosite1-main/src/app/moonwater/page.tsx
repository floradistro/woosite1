"use client"

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { MOONWATER_PRODUCTS, BOTTLE_PRICING, PACK_PRICING, type FilterState, type FeaturedProduct, type ProductFormat } from './constants';
import { filterProducts } from './utils';
import Section from '../components/Section';
import SectionHeader from '../components/SectionHeader';
import ExperiencePanel from '../components/ExperiencePanel';
import FilterBar from './components/FilterBar';
import DenseView from './components/DenseView';

// Import new components
import HeroSection from './components/HeroSection';
import SubscriptionSection from './components/SubscriptionSection';
import ReviewsSection from './components/ReviewsSection';

function MoonwaterCollectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState<'all' | 'indica' | 'sativa' | 'hybrid'>('all');
  const [filterVibe, setFilterVibe] = useState<'all' | 'relax' | 'energize' | 'balance'>('all');
  const [filterFlavor, setFilterFlavor] = useState<'all' | 'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint'>('all');
  const [format, setFormat] = useState<ProductFormat>('bottle');
  const [isLoading, setIsLoading] = useState(true);

  // Handle URL parameters for format and filters
  useEffect(() => {
    const formatParam = searchParams.get('format');
    const typeParam = searchParams.get('type');
    
    if (formatParam === 'pack') {
      setFormat('pack');
    } else if (formatParam === 'bottle') {
      setFormat('bottle');
    }
    
    // Handle type parameter for category filtering
    if (typeParam && ['indica', 'sativa', 'hybrid'].includes(typeParam)) {
      setFilterCategory(typeParam as 'indica' | 'sativa' | 'hybrid');
    }
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filters = {
      category: filterCategory === 'all' ? [] : [filterCategory],
      vibe: filterVibe === 'all' ? [] : [filterVibe],
      flavor: filterFlavor === 'all' ? [] : [filterFlavor]
    };
    const products = filterProducts(MOONWATER_PRODUCTS, filters);
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => {
          const priceA = format === 'bottle' ? BOTTLE_PRICING['1-bottle'] : PACK_PRICING['4-pack'];
          const priceB = format === 'bottle' ? BOTTLE_PRICING['1-bottle'] : PACK_PRICING['4-pack'];
          return priceA - priceB;
        });
      case 'price-high':
        return [...products].sort((a, b) => {
          const priceA = format === 'bottle' ? BOTTLE_PRICING['1-bottle'] : PACK_PRICING['4-pack'];
          const priceB = format === 'bottle' ? BOTTLE_PRICING['1-bottle'] : PACK_PRICING['4-pack'];
          return priceB - priceA;
        });
      case 'thc':
        return [...products].sort((a, b) => b.thc - a.thc);
      default:
        return products;
    }
  }, [filterCategory, filterVibe, filterFlavor, sortBy, format]);

  // Handle size selection
  const handleSizeSelect = (productId: number, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  // Handle format change
  const handleFormatChange = (newFormat: ProductFormat) => {
    setFormat(newFormat);
    // Clear selected sizes when switching formats
    setSelectedSizes({});
  };

  // Handle add to cart
  const handleAddToCart = (product: FeaturedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = format === 'bottle' ? '1-bottle' : '4-pack';
    const size = selectedSizes[product.id] || defaultSize;
    const pricing = format === 'bottle' ? BOTTLE_PRICING : PACK_PRICING;
    const price = pricing[size as keyof typeof pricing];
    
    addToCart({
      id: product.id,
      title: format === 'pack' ? `${product.title} pack` : product.title,
      price: price,
      weight: size,
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
    setFilterFlavor('all');
  };

  const renderProducts = () => {
    const commonProps = {
      products: filteredProducts,
      selectedSizes,
      loadedImages,
      format,
      onProductClick: handleProductClick,
      onSizeSelect: handleSizeSelect,
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
        filterFlavor={filterFlavor}
        format={format}
        onSortChange={setSortBy}
        onCategoryChange={setFilterCategory}
        onVibeChange={setFilterVibe}
        onFlavorChange={setFilterFlavor}
        onFormatChange={handleFormatChange}
        productCount={filteredProducts.length}
        totalCount={MOONWATER_PRODUCTS.length}
      />

      {/* Products Section - Always Dense View */}
      {renderProducts()}

      {/* Moonwater Subscription Section */}
      {format === 'bottle' && <SubscriptionSection />}

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
                {format === 'bottle' ? 'Liquid Elevation. Pure Hydration.' : 'Stock Up. Stay Lifted.'}
              </h2>
              <p className="text-xl text-white/80 font-light">
                {format === 'bottle' 
                  ? 'Every bottle is crafted for smooth effects and incredible taste.' 
                  : 'Multi-packs for those who know what they like and want more of it.'
                }
              </p>
              <p className="text-lg text-white/60 font-light mt-2">
                {format === 'bottle' 
                  ? 'No artificial flavors. No synthetic cannabinoids. Just pure, natural bliss.' 
                  : 'Save more when you buy more. Perfect for sharing or stocking up.'
                }
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-3 gap-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-blue-400 to-blue-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        {format === 'bottle' ? 'Nano-Enhanced Absorption' : 'Bulk Savings'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'bottle' 
                          ? 'Advanced nano-emulsion technology for faster onset and better bioavailability. Feel it in minutes, not hours.'
                          : 'The more you buy, the more you save. Stock up on your favorites and never run dry.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-purple-400 to-purple-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        {format === 'bottle' ? 'All-Natural Ingredients' : 'Party-Ready Packs'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'bottle' 
                          ? 'Real fruit extracts. Natural terpenes. No artificial anything. Just clean, refreshing cannabis beverages.'
                          : 'Perfect for gatherings, events, or just keeping your fridge stocked. Shareable sizes for any occasion.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-cyan-400 to-cyan-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        {format === 'bottle' ? 'Precisely Dosed' : 'Mix & Match Flavors'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'bottle' 
                          ? 'Consistent 10mg THC per bottle. No guessing, no surprises. Just reliable, repeatable effects every time.'
                          : 'Build your own variety pack. Try different flavors and effects to find your perfect rotation.'
                        }
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
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30"></div>
                </div>
                <p className="text-xl text-white/85 font-light leading-relaxed">
                  {format === 'bottle' 
                    ? 'You won\'t find chalky, artificial drinks here.'
                    : 'You won\'t find overpriced singles here.'
                  }
                </p>
                <p className="text-lg text-blue-400 font-medium mt-2">
                  {format === 'bottle' 
                    ? 'You get smooth, delicious cannabis beverages that actually taste good.'
                    : 'You get value packs that make sense for your lifestyle.'
                  }
                </p>
              </div>
            </div>

            {/* Visual Elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Dispensary Standards. Ecom Speed. Section */}
      <Section id="moonwater-experience-section">
        <div className="relative z-10 py-8 w-full">
          <SectionHeader 
            title="Cold-Shipped. Always Fresh."
            subtitle="Refreshment in Motion."
            delay="0.3s"
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 pb-8">
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            {/* Same-Day Shipouts */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Same-Day <span className="text-blue-400">Cold-Pack</span>
              </h3>
              <p className="text-white/70 font-light">
                Orders placed by 2PM ship cold within hours.
              </p>
            </div>
            
            {/* Packed Fresh */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Temperature <span className="text-purple-400">Controlled.</span>
              </h3>
              <p className="text-white/70 font-light">
                {format === 'bottle' ? 'Every bottle ships with ice packs to maintain freshness.' : 'Multi-packs shipped in insulated packaging for perfect arrival.'}
              </p>
            </div>
            
            {/* Local Faster */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Local? <span className="text-cyan-400">Ice Cold.</span>
              </h3>
              <p className="text-white/70 font-light">
                Most local orders arrive next day, perfectly chilled.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Loading fallback component
function MoonwaterPageLoading() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading moonwater collection...</p>
      </div>
    </div>
  );
}

export default function MoonwaterCollectionPage() {
  return (
    <Suspense fallback={<MoonwaterPageLoading />}>
      <MoonwaterCollectionContent />
    </Suspense>
  );
}