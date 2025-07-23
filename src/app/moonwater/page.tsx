"use client"

import { useState, useEffect } from 'react';
import ProductCollectionPage from '../components/ProductCollectionPage';
import { moonwaterConfig } from '../components/ProductCollectionConfig';
import { getMoonwaterProducts, type FeaturedProduct } from './constants';
import { filterProducts } from './utils';

// Import unified components from the shared directory
import FilterBar from '@/components/product/FilterBar';
import DenseView from '@/components/product/DenseView';
import HeroSection from '@/components/product/HeroSection';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';

export default function MoonwaterCollectionPage() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const moonwaterProducts = await getMoonwaterProducts();
        setProducts(moonwaterProducts);
      } catch (error) {
        console.error('Error fetching moonwater products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Enhanced component props for compatibility
  const EnhancedFilterBar = (props: any) => (
    <FilterBar {...props} formats={moonwaterConfig.formats} />
  );
  
  const EnhancedDenseView = (props: any) => (
    <DenseView 
      {...props}
      productType="moonwater"
      pricing={props.format === 'bottle' ? moonwaterConfig.pricing.primary : moonwaterConfig.pricing.secondary!}
      sizes={props.format === 'bottle' ? Object.keys(moonwaterConfig.pricing.primary) : Object.keys(moonwaterConfig.pricing.secondary!)}
      selectedOptions={props.selectedSizes}
      onOptionSelect={props.onSizeSelect}
    />
  );
  
  const EnhancedHeroSection = (props: any) => (
    <HeroSection
      productType="moonwater"
      format={props.format}
      title={{
        primary: moonwaterConfig.content.hero.primary.title,
        secondary: moonwaterConfig.content.hero.secondary?.title
      }}
      subtitle={{
        primary: moonwaterConfig.content.hero.primary.subtitle,
        secondary: moonwaterConfig.content.hero.secondary?.subtitle
      }}
      features={props.format === 'bottle' 
        ? moonwaterConfig.content.hero.primary.features || []
        : moonwaterConfig.content.hero.secondary?.features || []
      }
      qualityBadges={props.format === 'bottle'
        ? moonwaterConfig.content.hero.primary.qualityBadges || []
        : moonwaterConfig.content.hero.secondary?.qualityBadges || []
      }
    />
  );
  
  const EnhancedSubscriptionSection = () => (
    <SubscriptionSection productType="moonwater" />
  );
  
  const EnhancedReviewsSection = () => (
    <ReviewsSection productType="moonwater" />
  );
  
  // Wrapper to handle type compatibility
  const wrappedFilterProducts = (products: any[], filters: any) => {
    return filterProducts(products, filters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#4a4a4a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading moonwater products...</p>
        </div>
      </div>
    );
  }

  return (
    <ProductCollectionPage
      config={moonwaterConfig}
      products={products}
      FilterBar={EnhancedFilterBar}
      DenseView={EnhancedDenseView}
      HeroSection={EnhancedHeroSection}
      SubscriptionSection={EnhancedSubscriptionSection}
      ReviewsSection={EnhancedReviewsSection}
      filterProducts={wrappedFilterProducts}
    />
  );
}