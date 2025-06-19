"use client"

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { WAX_PRODUCTS, WEIGHT_PRICING, GRAM_PRICING, type FilterState, type FeaturedProduct, type ProductFormat } from './constants';
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

function WaxCollectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [selectedWeights, setSelectedWeights] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState<'all' | 'indica' | 'sativa' | 'hybrid'>('all');
  const [filterVibe, setFilterVibe] = useState<'all' | 'relax' | 'energize' | 'balance'>('all');
  const [filterTexture, setFilterTexture] = useState<'all' | 'shatter' | 'budder' | 'sauce' | 'diamonds' | 'rosin'>('all');
  const [format, setFormat] = useState<ProductFormat>('wax');
  const [isLoading, setIsLoading] = useState(true);

  // Handle URL parameters for format and filters
  useEffect(() => {
    const formatParam = searchParams.get('format');
    const typeParam = searchParams.get('type');
    
    if (formatParam === 'live-resin') {
      setFormat('live-resin');
    } else if (formatParam === 'wax') {
      setFormat('wax');
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
      texture: filterTexture === 'all' ? [] : [filterTexture]
    };
    const products = filterProducts(WAX_PRODUCTS, filters);
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => {
          const priceA = format === 'wax' ? WEIGHT_PRICING['1g'] : GRAM_PRICING['0.5g'];
          const priceB = format === 'wax' ? WEIGHT_PRICING['1g'] : GRAM_PRICING['0.5g'];
          return priceA - priceB;
        });
      case 'price-high':
        return [...products].sort((a, b) => {
          const priceA = format === 'wax' ? WEIGHT_PRICING['1g'] : GRAM_PRICING['0.5g'];
          const priceB = format === 'wax' ? WEIGHT_PRICING['1g'] : GRAM_PRICING['0.5g'];
          return priceB - priceA;
        });
      case 'thc':
        return [...products].sort((a, b) => b.thc - a.thc);
      default:
        return products;
    }
  }, [filterCategory, filterVibe, filterTexture, sortBy, format]);

  // Handle weight selection
  const handleWeightSelect = (productId: number, weight: string) => {
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };

  // Handle format change
  const handleFormatChange = (newFormat: ProductFormat) => {
    setFormat(newFormat);
    // Clear selected weights when switching formats
    setSelectedWeights({});
  };

  // Handle add to cart
  const handleAddToCart = (product: FeaturedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultWeight = format === 'wax' ? '1g' : '0.5g';
    const weight = selectedWeights[product.id] || defaultWeight;
    const pricing = format === 'wax' ? WEIGHT_PRICING : GRAM_PRICING;
    const price = pricing[weight as keyof typeof pricing];
    
    addToCart({
      id: product.id,
      title: format === 'live-resin' ? `${product.title} live resin` : product.title,
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
    setFilterTexture('all');
  };

  const renderProducts = () => {
    const commonProps = {
      products: filteredProducts,
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
        filterTexture={filterTexture}
        format={format}
        onSortChange={setSortBy}
        onCategoryChange={setFilterCategory}
        onVibeChange={setFilterVibe}
        onTextureChange={setFilterTexture}
        onFormatChange={handleFormatChange}
        productCount={filteredProducts.length}
        totalCount={WAX_PRODUCTS.length}
      />

      {/* Products Section - Always Dense View */}
      {renderProducts()}

      {/* Wax Subscription Section */}
      {format === 'wax' && <SubscriptionSection />}

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
                {format === 'wax' ? 'Pure Potency. Concentrated Excellence.' : 'Fresh Frozen. Maximum Terps.'}
              </h2>
              <p className="text-xl text-white/80 font-light">
                {format === 'wax' 
                  ? 'Every concentrate is crafted for maximum potency and flavor.' 
                  : 'Live resin captured at peak freshness for unmatched terpene profiles.'
                }
              </p>
              <p className="text-lg text-white/60 font-light mt-2">
                {format === 'wax' 
                  ? 'If it doesn\'t dab clean, it\'s gone. No residue, no compromise.' 
                  : 'Flash frozen at harvest. Extracted with precision. Terps preserved perfectly.'
                }
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
                        {format === 'wax' ? 'Solventless Excellence' : 'Fresh Frozen Perfection'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'wax' 
                          ? 'No butane. No propane. Just pure extraction methods that preserve the plant\'s essence without compromise.'
                          : 'Harvested at peak ripeness and flash frozen within hours. No drying, no curing—just pure, fresh terpenes.'
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
                    <div className="w-1 h-16 bg-gradient-to-b from-emerald-400 to-emerald-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        {format === 'wax' ? 'Lab-Tested Purity' : 'Terpene Preservation'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'wax' 
                          ? 'Every batch tested for potency, purity, and residuals. Clean dabs only—your lungs will thank you.'
                          : 'Low-temp extraction preserves the full spectrum of terpenes. Taste the strain, not the process.'
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
                    <div className="w-1 h-16 bg-gradient-to-b from-blue-400 to-blue-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        {format === 'wax' ? 'Consistency Matters' : 'Strain-Specific Profiles'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'wax' 
                          ? 'From shatter to sauce, every texture is perfected. Stable at room temp, melts clean on the nail.'
                          : 'Each batch captures the unique profile of its source strain. Real cannabis flavors, amplified.'
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
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30"></div>
                </div>
                <p className="text-xl text-white/85 font-light leading-relaxed">
                  {format === 'wax' 
                    ? 'You won\'t find dark, burnt concentrates here.'
                    : 'You won\'t find dried-out, flavorless extracts here.'
                  }
                </p>
                <p className="text-lg text-emerald-400 font-medium mt-2">
                  {format === 'wax' 
                    ? 'You get golden, clean-melting concentrates that hit pure.'
                    : 'You get terp-rich, fresh-frozen excellence in every dab.'
                  }
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
      <Section id="wax-experience-section">
        <div className="relative z-10 py-8 w-full">
          <SectionHeader 
            title="Extracted Fresh. Delivered Fast."
            subtitle="Potency in Motion."
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
                Cold-Chain <span className="text-green-400">Preserved.</span>
              </h3>
              <p className="text-white/70 font-light">
                {format === 'wax' ? 'Every concentrate stored and shipped at optimal temps.' : 'Live resin kept cold from extraction to your door.'}
              </p>
            </div>
            
            {/* Local Faster */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Local? <span className="text-purple-400">Lightning Fast.</span>
              </h3>
              <p className="text-white/70 font-light">
                Most local orders drop next day. Many land same day.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Loading fallback component
function WaxPageLoading() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading concentrate collection...</p>
      </div>
    </div>
  );
}

export default function WaxCollectionPage() {
  return (
    <Suspense fallback={<WaxPageLoading />}>
      <WaxCollectionContent />
    </Suspense>
  );
}