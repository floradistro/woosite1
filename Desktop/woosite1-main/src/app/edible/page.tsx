"use client"

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { EDIBLE_PRODUCTS, SINGLE_PRICING, PACK_PRICING, type FilterState, type FeaturedProduct, type ProductFormat } from './constants';
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

function EdibleCollectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState<'all' | 'indica' | 'sativa' | 'hybrid'>('all');
  const [filterVibe, setFilterVibe] = useState<'all' | 'relax' | 'energize' | 'balance'>('all');
  const [filterType, setFilterType] = useState<'all' | 'gummies' | 'chocolates' | 'mints' | 'cookies' | 'caramels'>('all');
  const [format, setFormat] = useState<ProductFormat>('single');
  const [isLoading, setIsLoading] = useState(true);

  // Handle URL parameters for format and filters
  useEffect(() => {
    const formatParam = searchParams.get('format');
    const typeParam = searchParams.get('type');
    
    if (formatParam === 'bulk') {
      setFormat('bulk');
    } else if (formatParam === 'single') {
      setFormat('single');
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
      type: filterType === 'all' ? [] : [filterType]
    };
    const products = filterProducts(EDIBLE_PRODUCTS, filters);
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => {
          const priceA = format === 'single' ? SINGLE_PRICING['1-piece'] : PACK_PRICING['10-pack'];
          const priceB = format === 'single' ? SINGLE_PRICING['1-piece'] : PACK_PRICING['10-pack'];
          return priceA - priceB;
        });
      case 'price-high':
        return [...products].sort((a, b) => {
          const priceA = format === 'single' ? SINGLE_PRICING['1-piece'] : PACK_PRICING['10-pack'];
          const priceB = format === 'single' ? SINGLE_PRICING['1-piece'] : PACK_PRICING['10-pack'];
          return priceB - priceA;
        });
      case 'thc':
        return [...products].sort((a, b) => b.thc - a.thc);
      default:
        return products;
    }
  }, [filterCategory, filterVibe, filterType, sortBy, format]);

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
    const defaultSize = format === 'single' ? '1-piece' : '10-pack';
    const size = selectedSizes[product.id] || defaultSize;
    const pricing = format === 'single' ? SINGLE_PRICING : PACK_PRICING;
    const price = pricing[size as keyof typeof pricing];
    
    addToCart({
      id: product.id,
      title: format === 'bulk' ? `${product.title} bulk` : product.title,
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
    setFilterType('all');
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
        filterType={filterType}
        format={format}
        onSortChange={setSortBy}
        onCategoryChange={setFilterCategory}
        onVibeChange={setFilterVibe}
        onTypeChange={setFilterType}
        onFormatChange={handleFormatChange}
        productCount={filteredProducts.length}
        totalCount={EDIBLE_PRODUCTS.length}
      />

      {/* Products Section - Always Dense View */}
      {renderProducts()}

      {/* Edible Subscription Section */}
      {format === 'single' && <SubscriptionSection />}

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
                {format === 'single' ? 'Precision Dosed. Deliciously Crafted.' : 'Stock Up. Save More.'}
              </h2>
              <p className="text-xl text-white/80 font-light">
                {format === 'single' 
                  ? 'Every edible is precisely dosed for consistent, reliable effects.' 
                  : 'Bulk packs for those who know what works and want to save.'
                }
              </p>
              <p className="text-lg text-white/60 font-light mt-2">
                {format === 'single' 
                  ? 'No guessing. No surprises. Just perfect portions every time.' 
                  : 'Buy more, save more. Perfect for regular users and sharing.'
                }
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-3 gap-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-pink-400 to-pink-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        {format === 'single' ? 'Artisan Quality' : 'Value Pricing'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'single' 
                          ? 'Small-batch production with premium ingredients. Real fruit, real chocolate, real flavor—no artificial nonsense.'
                          : 'The more you buy, the more you save. Stock up on your favorites without breaking the bank.'
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
                    <div className="w-1 h-16 bg-gradient-to-b from-orange-400 to-orange-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        {format === 'single' ? 'Lab-Tested Consistency' : 'Freshness Guaranteed'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'single' 
                          ? 'Every batch tested for potency and purity. Consistent 10mg doses in every piece, guaranteed.'
                          : 'Individually wrapped for freshness. Long shelf life means you can stock up worry-free.'
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
                    <div className="w-1 h-16 bg-gradient-to-b from-purple-400 to-purple-400/20 rounded-full"></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        {format === 'single' ? 'Onset You Can Trust' : 'Perfect for Sharing'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'single' 
                          ? 'Feel it in 30-60 minutes. Effects last 4-6 hours. Predictable, reliable, enjoyable.'
                          : 'Great for parties, events, or just having plenty on hand. Share the experience.'
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
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30"></div>
                </div>
                <p className="text-xl text-white/85 font-light leading-relaxed">
                  {format === 'single' 
                    ? 'You won\'t find chalky, bitter edibles here.'
                    : 'You won\'t find overpriced single servings here.'
                  }
                </p>
                <p className="text-lg text-pink-400 font-medium mt-2">
                  {format === 'single' 
                    ? 'You get delicious, precisely-dosed treats that actually taste good.'
                    : 'You get bulk value without compromising on quality.'
                  }
                </p>
              </div>
            </div>

            {/* Visual Elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-orange-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Dispensary Standards. Ecom Speed. Section */}
      <Section id="edible-experience-section">
        <div className="relative z-10 py-8 w-full">
          <SectionHeader 
            title="Fresh Made. Fast Delivered."
            subtitle="Sweetness in Motion."
            delay="0.3s"
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 pb-8">
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            {/* Same-Day Shipouts */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Same-Day <span className="text-pink-400">Processing</span>
              </h3>
              <p className="text-white/70 font-light">
                Orders placed by 2PM ship within hours.
              </p>
            </div>
            
            {/* Packed Fresh */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Freshness <span className="text-orange-400">Sealed.</span>
              </h3>
              <p className="text-white/70 font-light">
                {format === 'single' ? 'Every edible individually wrapped for maximum freshness.' : 'Bulk packs sealed tight to maintain quality and potency.'}
              </p>
            </div>
            
            {/* Local Faster */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Local? <span className="text-purple-400">Sweet & Fast.</span>
              </h3>
              <p className="text-white/70 font-light">
                Most local orders arrive next day, fresh as can be.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// Loading fallback component
function EdiblePageLoading() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading edible collection...</p>
      </div>
    </div>
  );
}

export default function EdibleCollectionPage() {
  return (
    <Suspense fallback={<EdiblePageLoading />}>
      <EdibleCollectionContent />
    </Suspense>
  );
}