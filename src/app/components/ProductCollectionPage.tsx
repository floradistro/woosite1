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
    
    const price = pricing[selectedWeight];
    
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
      />

      {/* Products Section */}
      {renderProducts()}

      {/* Subscription Section - only show for primary format and if component exists */}
      {format === config.formats.primary && SubscriptionSection && <SubscriptionSection />}

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Quality Section */}
      <section className="relative bg-[#4a4a4a] overflow-hidden -mt-px" style={{ 
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)'
      }}>
        <div className="relative z-10 py-16 px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-12 opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]">
              <h2 className="text-4xl md:text-5xl font-extralight tracking-wide mb-4">
                {format === config.formats.secondary && config.content.qualitySection.title.secondary
                  ? config.content.qualitySection.title.secondary
                  : config.content.qualitySection.title.primary}
              </h2>
              <p className="text-xl text-white/80 font-light">
                {format === config.formats.secondary && config.content.qualitySection.subtitle.secondary
                  ? config.content.qualitySection.subtitle.secondary
                  : config.content.qualitySection.subtitle.primary}
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-3 gap-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
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
            <div className="mt-12 text-center opacity-0 animate-[fadeInUp_1s_ease-out_0.7s_forwards]">
              <div className="inline-block">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/30"></div>
                  <div className={`w-2 h-2 bg-${config.content.qualitySection.bottomStatement.highlightColor}-400 rounded-full animate-pulse`}></div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30"></div>
                </div>
                <p className="text-xl text-white/85 font-light leading-relaxed">
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

            {/* Visual Elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <Section id={`${config.productType}-experience-section`}>
        <div className="relative z-10 py-8 w-full">
          <SectionHeader 
            title={config.content.experienceSection.title}
            subtitle={config.content.experienceSection.subtitle}
            delay="0.3s"
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 pb-8">
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
            {config.content.experienceSection.columns.map((column, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                  {column.title} <span className={`text-${column.highlightColor}-400`}>{column.highlight}</span>
                </h3>
                <p className="text-white/70 font-light">
                  {format === config.formats.secondary && column.description.secondary
                    ? column.description.secondary
                    : column.description.primary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
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