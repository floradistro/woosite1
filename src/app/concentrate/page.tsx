"use client"

import { useState, useEffect } from 'react';
import ProductCollectionPage from '../components/ProductCollectionPage';
import { concentrateConfig } from '../components/ProductCollectionConfig';
import { getConcentrateProducts, type FeaturedProduct } from './constants';
import { filterProducts } from './utils';

// Import unified components from the shared directory
import FilterBar from '@/components/product/FilterBar';
import DenseView from '@/components/product/DenseView';
import HeroSection from '@/components/product/HeroSection';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';

export default function ConcentrateCollectionPage() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const concentrateProducts = await getConcentrateProducts();
        setProducts(concentrateProducts);
      } catch (error) {
        console.error('Error fetching concentrate products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

      // Enhanced component props for compatibility
    const EnhancedFilterBar = (props: any) => (
      <FilterBar {...props} formats={concentrateConfig.formats} />
    );
  
  const EnhancedDenseView = (props: any) => (
    <DenseView 
      {...props}
      productType="concentrate"
      pricing={props.format === 'concentrate' ? concentrateConfig.pricing.primary : concentrateConfig.pricing.secondary!}
      sizes={props.format === 'concentrate' ? Object.keys(concentrateConfig.pricing.primary) : Object.keys(concentrateConfig.pricing.secondary!)}
      selectedOptions={props.selectedWeights}
      onOptionSelect={props.onWeightSelect}
    />
  );
  
  const EnhancedHeroSection = (props: any) => (
    <HeroSection
      productType="concentrate"
      format={props.format}
      title={{
        primary: concentrateConfig.content.hero.primary.title,
        secondary: concentrateConfig.content.hero.secondary?.title
      }}
      subtitle={{
        primary: concentrateConfig.content.hero.primary.subtitle,
        secondary: concentrateConfig.content.hero.secondary?.subtitle
      }}
      features={props.format === 'concentrate' 
        ? concentrateConfig.content.hero.primary.features || []
        : concentrateConfig.content.hero.secondary?.features || []
      }
      qualityBadges={props.format === 'concentrate'
        ? concentrateConfig.content.hero.primary.qualityBadges || []
        : concentrateConfig.content.hero.secondary?.qualityBadges || []
      }
    />
  );
  
  const EnhancedSubscriptionSection = () => (
    <SubscriptionSection productType="concentrate" />
  );
  
  const EnhancedReviewsSection = () => (
    <ReviewsSection productType="concentrate" />
  );
  
  // Wrapper to handle type compatibility
  const wrappedFilterProducts = (products: any[], filters: any) => {
    return filterProducts(products, filters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading concentrates...</div>
      </div>
    );
  }

  return (
    <ProductCollectionPage
      config={concentrateConfig}
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