"use client"

import { useState, useEffect } from 'react';
import ProductCollectionPage from '../components/ProductCollectionPage';
import { vapeConfig } from '../components/ProductCollectionConfig';
import { getVapeProducts, type FeaturedProduct } from './constants';
import { filterProducts } from './utils';

// Import unified components from the shared directory
import FilterBar from '@/components/product/FilterBar';
import DenseView from '@/components/product/DenseView';
import HeroSection from '@/components/product/HeroSection';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';

export default function VapeCollectionPage() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const vapeProducts = await getVapeProducts();
        setProducts(vapeProducts);
      } catch (error) {
        console.error('Error fetching vape products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Enhanced component props for compatibility
  const EnhancedFilterBar = (props: any) => (
    <FilterBar {...props} formats={vapeConfig.formats} />
  );
  
  const EnhancedDenseView = (props: any) => (
    <DenseView 
      {...props}
      productType="vape"
      pricing={vapeConfig.pricing.primary}
      sizes={Object.keys(vapeConfig.pricing.primary)}
      selectedOptions={props.selectedWeights}
      onOptionSelect={props.onWeightSelect}
    />
  );
  
  const EnhancedHeroSection = (props: any) => (
    <HeroSection
      productType="vape"
      format={props.format}
      title={{
        primary: vapeConfig.content.hero.primary.title
      }}
      subtitle={{
        primary: vapeConfig.content.hero.primary.subtitle
      }}
      features={vapeConfig.content.hero.primary.features || []}
      qualityBadges={vapeConfig.content.hero.primary.qualityBadges || []}
    />
  );
  
  const EnhancedSubscriptionSection = () => (
    <SubscriptionSection productType="vape" />
  );
  
  const EnhancedReviewsSection = () => (
    <ReviewsSection productType="vape" />
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
          <p className="text-white/70">Loading vape products...</p>
        </div>
      </div>
    );
  }

  return (
    <ProductCollectionPage
      config={vapeConfig}
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