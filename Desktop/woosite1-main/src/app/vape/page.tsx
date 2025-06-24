"use client"

// React import not needed in React 17+
import ProductCollectionPage from '../components/ProductCollectionPage';
import { vapeConfig } from '../components/ProductCollectionConfig';
import { VAPE_PRODUCTS } from './constants';
import { filterProducts } from './utils';

// Import unified components from the shared directory
import FilterBar from '@/components/product/FilterBar';
import DenseView from '@/components/product/DenseView';
import HeroSection from '@/components/product/HeroSection';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';

export default function VapeCollectionPage() {
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

  return (
    <ProductCollectionPage
      config={vapeConfig}
      products={VAPE_PRODUCTS}
      FilterBar={EnhancedFilterBar}
      DenseView={EnhancedDenseView}
      HeroSection={EnhancedHeroSection}
      SubscriptionSection={EnhancedSubscriptionSection}
      ReviewsSection={EnhancedReviewsSection}
      filterProducts={wrappedFilterProducts}
    />
  );
}