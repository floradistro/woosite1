"use client"

import { useState, useEffect } from 'react';
import ProductCollectionPage from '../components/ProductCollectionPage';
import { edibleConfig } from '../components/ProductCollectionConfig';
import { getEdiblesProducts, type FeaturedProduct } from './constants';
import { filterProducts } from './utils';

// Import unified components from the shared directory
import FilterBar from '@/components/product/FilterBar';
import DenseView from '@/components/product/DenseView';
import HeroSection from '@/components/product/HeroSection';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';

export default function EdiblesCollectionPage() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ediblesProducts = await getEdiblesProducts();
        setProducts(ediblesProducts);
      } catch (error) {
        console.error('Error fetching edibles products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Enhanced component props for compatibility
  const EnhancedFilterBar = (props: any) => (
    <FilterBar {...props} formats={edibleConfig.formats} />
  );
  
  const EnhancedDenseView = (props: any) => (
    <DenseView 
      {...props}
      productType="edible"
      pricing={props.format === 'single' ? edibleConfig.pricing.primary : edibleConfig.pricing.secondary!}
      sizes={props.format === 'single' ? Object.keys(edibleConfig.pricing.primary) : Object.keys(edibleConfig.pricing.secondary!)}
      selectedOptions={props.selectedSizes}
      onOptionSelect={props.onSizeSelect}
    />
  );
  
  const EnhancedHeroSection = (props: any) => (
    <HeroSection
      productType="edible"
      format={props.format}
      title={{
        primary: edibleConfig.content.hero.primary.title,
        secondary: edibleConfig.content.hero.secondary?.title
      }}
      subtitle={{
        primary: edibleConfig.content.hero.primary.subtitle,
        secondary: edibleConfig.content.hero.secondary?.subtitle
      }}
      features={props.format === 'single' 
        ? edibleConfig.content.hero.primary.features || []
        : edibleConfig.content.hero.secondary?.features || []
      }
      qualityBadges={props.format === 'single'
        ? edibleConfig.content.hero.primary.qualityBadges || []
        : edibleConfig.content.hero.secondary?.qualityBadges || []
      }
    />
  );
  
  const EnhancedSubscriptionSection = () => (
    <SubscriptionSection productType="edible" />
  );
  
  const EnhancedReviewsSection = () => (
    <ReviewsSection productType="edible" />
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
          <p className="text-white/70">Loading edibles products...</p>
        </div>
      </div>
    );
  }

  return (
    <ProductCollectionPage
      config={edibleConfig}
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