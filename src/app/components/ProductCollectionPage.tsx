"use client"

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Section from './Section';
import SectionHeader from './SectionHeader';
import { ProductCollectionConfig, FilterType, VibeType, SecondaryFilterType } from './ProductCollectionConfig';

// Define the FeaturedProduct type that all product types share
export interface FeaturedProduct {
  id: number;
  title: string;
  thc: number;
  cbd?: number;
  effects?: string[]; // Made optional
  image: string;
  price: number;
  category: string;
  vibe: string;
  nose?: string | string[]; // Can be string or array
  type?: string | string[]; // Can be string or array
  texture?: string | string[]; // Can be string or array
  flavor?: string | string[]; // Can be string or array
  description?: string;
  // Additional properties that some products might have
  spotlight?: string;
  featured?: boolean;
  lineage?: string;
  terpenes?: string[];
  [key: string]: any; // Allow any additional properties
}

interface ProductCollectionPageProps {
  config: ProductCollectionConfig;
  products: FeaturedProduct[];
  FilterBar: React.ComponentType<any>;
  DenseView: React.ComponentType<any>;
  HeroSection: React.ComponentType<any>;
  SubscriptionSection?: React.ComponentType<any>;
  ReviewsSection: React.ComponentType<any>;
  filterProducts: (products: FeaturedProduct[], filters: any) => FeaturedProduct[];
}

function ProductCollectionContent({ 
  config, 
  products, 
  FilterBar, 
  DenseView, 
  HeroSection, 
  SubscriptionSection,
  ReviewsSection,
  filterProducts 
}: ProductCollectionPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  // State management
  const [selectedWeights, setSelectedWeights] = useState<Record<number, string>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState(config.defaultValues.sortBy);
  const [filterCategory, setFilterCategory] = useState<FilterType>('all');
  const [filterVibe, setFilterVibe] = useState<VibeType>('all');
  const [filterSecondary, setFilterSecondary] = useState<SecondaryFilterType>('all');
  const [format, setFormat] = useState<string>(config.formats.primary);
  const [isLoading, setIsLoading] = useState(true);

  // Handle URL parameters for format and filters
  useEffect(() => {
    const formatParam = searchParams.get('format');
    const typeParam = searchParams.get('type');
    
    if (formatParam && config.formats.secondary && formatParam === config.formats.secondary) {
      setFormat(config.formats.secondary);
    } else if (formatParam === config.formats.primary) {
      setFormat(config.formats.primary);
    }
    
    // Handle type parameter for category filtering
    if (typeParam && ['indica', 'sativa', 'hybrid'].includes(typeParam)) {
      setFilterCategory(typeParam as FilterType);
    }
  }, [searchParams, config.formats]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filters: Record<string, string[]> = {
      category: filterCategory === 'all' ? [] : [filterCategory],
      vibe: filterVibe === 'all' ? [] : [filterVibe]
    };
    
    // Add secondary filter based on product type
    if (config.filters.secondaryFilterName) {
      filters[config.filters.secondaryFilterName] = filterSecondary === 'all' ? [] : [filterSecondary];
    }
    
    const filtered = filterProducts(products, filters);
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => {
          const pricing = format === config.formats.primary ? config.pricing.primary : config.pricing.secondary!;
          const defaultSize = format === config.formats.primary ? config.defaultValues.weight.primary : config.defaultValues.weight.secondary!;
          const priceA = pricing[defaultSize];
          const priceB = pricing[defaultSize];
          return priceA - priceB;
        });
      case 'price-high':
        return [...filtered].sort((a, b) => {
          const pricing = format === config.formats.primary ? config.pricing.primary : config.pricing.secondary!;
          const defaultSize = format === config.formats.primary ? config.defaultValues.weight.primary : config.defaultValues.weight.secondary!;
          const priceA = pricing[defaultSize];
          const priceB = pricing[defaultSize];
          return priceB - priceA;
        });
      case 'thc':
        return [...filtered].sort((a, b) => b.thc - a.thc);
      default:
        return filtered;
    }
  }, [filterCategory, filterVibe, filterSecondary, sortBy, format, config, products, filterProducts]);

  // Handle weight/size selection - using unified name for both
  const handleWeightSelect = (productId: number, weight: string) => {
    if (config.productType === 'edible' || config.productType === 'moonwater') {
      setSelectedSizes(prev => ({ ...prev, [productId]: weight }));
    } else {
      setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
    }
  };

  // Handle format change
  const handleFormatChange = (newFormat: string) => {
    setFormat(newFormat);
    // Clear selected weights/sizes when switching formats
    setSelectedWeights({});
    setSelectedSizes({});
  };

  // Handle add to cart
  const handleAddToCart = (product: FeaturedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultWeight = format === config.formats.primary 
      ? config.defaultValues.weight.primary 
      : config.defaultValues.weight.secondary!;
    
    const selectedWeight = config.productType === 'edible' || config.productType === 'moonwater'
      ? selectedSizes[product.id] || defaultWeight
      : selectedWeights[product.id] || defaultWeight;
    
    const pricing = format === config.formats.primary 
      ? config.pricing.primary 
      : config.pricing.secondary!;
    
    // Determine pricing based on product type and available data
    let price: number;
    
    // For concentrates and vapes with custom pricing, use that directly
    if ((config.productType === 'concentrate' || config.productType === 'wax' || config.productType === 'vape') && 
        (product as any).variationPricing && 
        Object.keys((product as any).variationPricing).length > 0) {
      // Use real WooCommerce tiered pricing from variations
      const variationPricing = (product as any).variationPricing;
      price = variationPricing[selectedWeight] || pricing[selectedWeight] || product.price || (config.productType === 'vape' ? 49.99 : 55);
    } else {
      // Use config pricing for all other cases (like flower does)
      price = pricing[selectedWeight] || product.price || (config.productType === 'vape' ? 49.99 : 15);
    }
    
    // Customize title based on format
    let title = product.title;
    if (format === 'preroll') title = `${product.title} pre-rolls`;
    else if (format === 'bulk') title = `${product.title} bulk`;
    else if (format === 'pack') title = `${product.title} pack`;
    else if (format === 'live-resin') title = `${product.title} live resin`;
    
    addToCart({
      id: product.id,
      title,
      price: price,
      weight: selectedWeight,
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
    setFilterSecondary('all');
  };

  const renderProducts = () => {
    const commonProps = {
      products: filteredProducts,
      selectedWeights: config.productType === 'edible' || config.productType === 'moonwater' ? selectedSizes : selectedWeights,
      selectedSizes, // For compatibility
      loadedImages,
      format,
      onProductClick: handleProductClick,
      onWeightSelect: handleWeightSelect,
      onSizeSelect: handleWeightSelect, // For edibles/moonwater compatibility
      onAddToCart: handleAddToCart,
      onImageLoad: handleImageLoad,
      onClearFilters: clearFilters
    };

    return <DenseView {...commonProps} />;
  };

  // Get current content based on format
  const currentContent = format === config.formats.secondary && config.content.hero.secondary
    ? config.content.hero.secondary
    : config.content.hero.primary;

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

      {/* Hero Section */}
      <HeroSection format={format} />

      {/* Filter Bar */}
      <FilterBar
        sortBy={sortBy}
        filterCategory={filterCategory}
        filterVibe={filterVibe}
        filterNose={config.filters.secondaryFilterName === 'nose' ? filterSecondary : undefined}
        filterType={config.filters.secondaryFilterName === 'type' ? filterSecondary : undefined}
        filterTexture={config.filters.secondaryFilterName === 'texture' ? filterSecondary : undefined}
        filterFlavor={config.filters.secondaryFilterName === 'flavor' ? filterSecondary : undefined}
        format={format}
        onSortChange={setSortBy}
        onCategoryChange={setFilterCategory}
        onVibeChange={setFilterVibe}
        onNoseChange={config.filters.secondaryFilterName === 'nose' ? setFilterSecondary : undefined}
        onTypeChange={config.filters.secondaryFilterName === 'type' ? setFilterSecondary : undefined}
        onTextureChange={config.filters.secondaryFilterName === 'texture' ? setFilterSecondary : undefined}
        onFlavorChange={config.filters.secondaryFilterName === 'flavor' ? setFilterSecondary : undefined}
        onFormatChange={handleFormatChange}
        productCount={filteredProducts.length}
        totalCount={products.length}
        formats={config.formats}
      />

      {/* Products Section */}
      {renderProducts()}

      {/* Subscription Section - only show for primary format and if component exists */}
      {format === config.formats.primary && SubscriptionSection && <SubscriptionSection />}

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Quality Section */}
      <Section className="bg-gradient-to-br from-[#4a4a4a] to-[#464646] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
              {format === config.formats.secondary && config.content.qualitySection.title.secondary
                ? config.content.qualitySection.title.secondary
                : config.content.qualitySection.title.primary}
            </h2>
            <p className="text-xl text-white/80 font-light opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
              {format === config.formats.secondary && config.content.qualitySection.subtitle.secondary
                ? config.content.qualitySection.subtitle.secondary
                : config.content.qualitySection.subtitle.primary}
            </p>
          </div>

          {/* Quality Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {config.content.qualitySection.columns.map((column, index) => (
              <div key={index} className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className={`w-1 h-16 bg-gradient-to-b from-${column.color}-400 to-${column.color}-400/20 rounded-full`}></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        {format === config.formats.secondary && column.title.secondary
                          ? column.title.secondary
                          : column.title.primary}
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === config.formats.secondary && column.description.secondary
                          ? column.description.secondary
                          : column.description.primary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Statement */}
          <div className="text-center mt-16 opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
            <p className="text-lg text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              {format === config.formats.secondary && config.content.qualitySection.bottomStatement.text.secondary
                ? config.content.qualitySection.bottomStatement.text.secondary
                : config.content.qualitySection.bottomStatement.text.primary}
            </p>
            <p className={`text-lg text-${config.content.qualitySection.bottomStatement.highlightColor}-400 font-medium mt-2`}>
              {format === config.formats.secondary && config.content.qualitySection.bottomStatement.highlight.secondary
                ? config.content.qualitySection.bottomStatement.highlight.secondary
                : config.content.qualitySection.bottomStatement.highlight.primary}
            </p>
          </div>
        </div>
      </Section>

      {/* Experience Section */}
      <Section className="bg-gradient-to-br from-[#4a4a4a] to-[#464646] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
              {config.content.experienceSection.title}
            </h2>
            <p className="text-xl text-white/80 font-light opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
              {config.content.experienceSection.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {config.content.experienceSection.columns.map((column, index) => (
              <div key={index} className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className={`w-1 h-16 bg-gradient-to-b from-${column.highlightColor}-400 to-${column.highlightColor}-400/20 rounded-full`}></div>
                    <div>
                      <h3 className="text-white/90 font-medium text-lg mb-2">
                        {column.title} <span className={`text-${column.highlightColor}-400`}>{column.highlight}</span>
                      </h3>
                      <p className="text-white/70 font-light leading-relaxed">
                        {format === config.formats.secondary && column.description.secondary
                          ? column.description.secondary
                          : column.description.primary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

// Loading fallback component
function ProductPageLoading({ loadingText }: { loadingText: string }) {
  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">{loadingText}</p>
      </div>
    </div>
  );
}

export default function ProductCollectionPage(props: ProductCollectionPageProps) {
  return (
    <Suspense fallback={<ProductPageLoading loadingText={props.config.loadingText} />}>
      <ProductCollectionContent {...props} />
    </Suspense>
  );
} 