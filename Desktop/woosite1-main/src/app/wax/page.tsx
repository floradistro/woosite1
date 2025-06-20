"use client"

// React import not needed in React 17+
import ProductCollectionPage from '../components/ProductCollectionPage';
import { waxConfig } from '../components/ProductCollectionConfig';
import { WAX_PRODUCTS } from './constants';
import { filterProducts } from './utils';

// Import unified components from the shared directory
import FilterBar from '@/components/product/FilterBar';
import DenseView from '@/components/product/DenseView';
import HeroSection from '@/components/product/HeroSection';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';

export default function WaxCollectionPage() {
  // Enhanced component props for compatibility
  const EnhancedFilterBar = (props: any) => (
    <FilterBar {...props} formats={waxConfig.formats} />
  );
  
  const EnhancedDenseView = (props: any) => (
    <DenseView 
      {...props}
      productType="wax"
      pricing={props.format === 'wax' ? waxConfig.pricing.primary : waxConfig.pricing.secondary!}
      sizes={props.format === 'wax' ? Object.keys(waxConfig.pricing.primary) : Object.keys(waxConfig.pricing.secondary!)}
      selectedOptions={props.selectedWeights}
      onOptionSelect={props.onWeightSelect}
    />
  );
  
  const EnhancedHeroSection = (props: any) => (
    <HeroSection
      productType="wax"
      format={props.format}
      title={{
        primary: waxConfig.content.hero.primary.title,
        secondary: waxConfig.content.hero.secondary?.title
      }}
      subtitle={{
        primary: waxConfig.content.hero.primary.subtitle,
        secondary: waxConfig.content.hero.secondary?.subtitle
      }}
      features={props.format === 'wax' 
        ? waxConfig.content.hero.primary.features || []
        : waxConfig.content.hero.secondary?.features || []
      }
      qualityBadges={props.format === 'wax'
        ? waxConfig.content.hero.primary.qualityBadges || []
        : waxConfig.content.hero.secondary?.qualityBadges || []
      }
    />
  );
  
  const EnhancedSubscriptionSection = () => (
    <SubscriptionSection productType="wax" />
  );
  
  const EnhancedReviewsSection = () => (
    <ReviewsSection productType="wax" />
  );
  
  // Wrapper to handle type compatibility
  const wrappedFilterProducts = (products: any[], filters: any) => {
    return filterProducts(products, filters);
  };

  return (
    <ProductCollectionPage
      config={waxConfig}
      products={WAX_PRODUCTS}
      FilterBar={EnhancedFilterBar}
      DenseView={EnhancedDenseView}
      HeroSection={EnhancedHeroSection}
      SubscriptionSection={EnhancedSubscriptionSection}
      ReviewsSection={EnhancedReviewsSection}
      filterProducts={wrappedFilterProducts}
    />
  );
}