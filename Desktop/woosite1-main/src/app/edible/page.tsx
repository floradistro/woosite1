"use client"

// React import not needed in React 17+
import ProductCollectionPage from '../components/ProductCollectionPage';
import { edibleConfig } from '../components/ProductCollectionConfig';
import { EDIBLE_PRODUCTS } from './constants';
import { filterProducts } from './utils';

// Import unified components from the shared directory
import FilterBar from '@/components/product/FilterBar';
import DenseView from '@/components/product/DenseView';
import HeroSection from '@/components/product/HeroSection';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';

export default function EdibleCollectionPage() {
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

  return (
    <ProductCollectionPage
      config={edibleConfig}
      products={EDIBLE_PRODUCTS}
      FilterBar={EnhancedFilterBar}
      DenseView={EnhancedDenseView}
      HeroSection={EnhancedHeroSection}
      SubscriptionSection={EnhancedSubscriptionSection}
      ReviewsSection={EnhancedReviewsSection}
      filterProducts={wrappedFilterProducts}
    />
  );
}