"use client"

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { FLOWER_PRODUCTS, WEIGHT_PRICING, PREROLL_PRICING, type FilterState, type FeaturedProduct, type ProductFormat } from './constants';
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

function FlowerCollectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [selectedWeights, setSelectedWeights] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState<'all' | 'indica' | 'sativa' | 'hybrid'>('all');
  const [filterVibe, setFilterVibe] = useState<'all' | 'relax' | 'energize' | 'balance'>('all');
  const [filterNose, setFilterNose] = useState<'all' | 'candy' | 'gas' | 'cake' | 'funk' | 'sherb'>('all');
  const [format, setFormat] = useState<ProductFormat>('flower');
  const [isLoading, setIsLoading] = useState(true);

  // Handle URL parameters for format and filters
  useEffect(() => {
    const formatParam = searchParams.get('format');
    const typeParam = searchParams.get('type');
    
    if (formatParam === 'preroll') {
      setFormat('preroll');
    } else if (formatParam === 'flower') {
      setFormat('flower');
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
      nose: filterNose === 'all' ? [] : [filterNose]
    };
    const products = filterProducts(FLOWER_PRODUCTS, filters);
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => {
          const priceA = format === 'flower' ? WEIGHT_PRICING['3.5g'] : PREROLL_PRICING['1-pack'];
          const priceB = format === 'flower' ? WEIGHT_PRICING['3.5g'] : PREROLL_PRICING['1-pack'];
          return priceA - priceB;
        });
      case 'price-high':
        return [...products].sort((a, b) => {
          const priceA = format === 'flower' ? WEIGHT_PRICING['3.5g'] : PREROLL_PRICING['1-pack'];
          const priceB = format === 'flower' ? WEIGHT_PRICING['3.5g'] : PREROLL_PRICING['1-pack'];
          return priceB - priceA;
        });
      case 'thc':
        return [...products].sort((a, b) => b.thc - a.thc);
      default:
        return products;
    }
  }, [filterCategory, filterVibe, filterNose, sortBy, format]);

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
    const defaultWeight = format === 'flower' ? '3.5g' : '1-pack';
    const weight = selectedWeights[product.id] || defaultWeight;
    const pricing = format === 'flower' ? WEIGHT_PRICING : PREROLL_PRICING;
    const price = pricing[weight as keyof typeof pricing];
    
    addToCart({
      id: product.id,
      title: format === 'preroll' ? `${product.title} pre-rolls` : product.title,
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
        filterNose={filterNose}
        format={format}
        onSortChange={setSortBy}
        onCategoryChange={setFilterCategory}
        onVibeChange={setFilterVibe}
        onNoseChange={setFilterNose}
        onFormatChange={handleFormatChange}
        productCount={filteredProducts.length}
        totalCount={FLOWER_PRODUCTS.length}
      />

      {/* Products Section - Always Dense View */}
      {renderProducts()}

      {/* Flower Subscription Section */}
      {format === 'flower' && <SubscriptionSection />}

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
                {format === 'flower' ? 'We Ship Fire.' : 'Fresh Rolled. Made to Order.'}
              </h2>
              <p className="text-xl text-white/80 font-light">
                {format === 'flower' 
                  ? 'Every strain is judged on impact.' 
                  : 'Every pre-roll is rolled fresh from our premium flower.'
                }
              </p>
              <p className="text-lg text-white/60 font-light mt-2">
                {format === 'flower' 
                  ? 'If it doesn\'t punch, it\'s gone. No second chances.' 
                  : 'No shake. No trim. Just pure flower, rolled to perfection.'
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
                        {format === 'flower' ? 'Direct Source Only' : 'Made to Order'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'flower' 
                          ? 'No white labels. No brokers. No warehouse swaps. We work direct—because trusting middlemen is how you end up with trash.'
                          : 'Every pre-roll is rolled fresh when you order. No pre-made inventory sitting around losing potency.'
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
                        {format === 'flower' ? 'If It\'s Not Indoor, It\'s Not Even Considered' : 'Premium Flower Only'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'flower' 
                          ? 'Outdoor doesn\'t make the cut—ever. No exceptions. No compromises. No conversation.'
                          : 'Same premium indoor flower we sell loose, just rolled for your convenience. No shake, no trim, no filler.'
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
                        {format === 'flower' ? 'We Smoke Everything Before You Do' : 'Hand-Rolled Precision'}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === 'flower' 
                          ? 'No guessing. No hype strain bias. If it didn\'t pass through our lungs, it doesn\'t pass to the shelf.'
                          : 'Each pre-roll is hand-inspected and perfectly packed. Consistent burn, full flavor, every time.'
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
                  {format === 'flower' 
                    ? 'You won\'t find old weed in shiny bags here.'
                    : 'You won\'t find stale pre-rolls in plastic tubes here.'
                  }
                </p>
                <p className="text-lg text-emerald-400 font-medium mt-2">
                  {format === 'flower' 
                    ? 'You get it fresh, loud, and exactly how we smoke it.'
                    : 'You get it fresh-rolled, loud, and ready to light.'
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
      <Section id="flower-experience-section">
        <div className="relative z-10 py-8 w-full">
          <SectionHeader 
            title="Orders Don't Sit. Neither Do We."
            subtitle="Freshness in Motion."
            delay="0.3s"
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 pb-8">
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            {/* Same-Day Shipouts */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Same-Day <span className="text-blue-400">Shipouts</span>
              </h3>
              <p className="text-white/70 font-light">
                Orders placed by 2PM ship within hours.
              </p>
            </div>
            
            {/* Packed Fresh */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                No <span className="text-green-400">Prepacked Bullsh*t.</span>
              </h3>
              <p className="text-white/70 font-light">
                {format === 'flower' ? 'Every order is sealed fresh — right after it\'s placed.' : 'We don\'t pre-roll. Every pre-roll is made fresh — right after it\'s ordered.'}
              </p>
            </div>
            
            {/* Local Faster */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                Local? <span className="text-purple-400">Even Faster.</span>
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
function FlowerPageLoading() {
  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading flower collection...</p>
      </div>
    </div>
  );
}

export default function FlowerCollectionPage() {
  return (
    <Suspense fallback={<FlowerPageLoading />}>
      <FlowerCollectionContent />
    </Suspense>
  );
}