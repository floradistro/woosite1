"use client"

// React import not needed in React 17+
import ProductCollectionPage from '../components/ProductCollectionPage';
import { moonwaterConfig } from '../components/ProductCollectionConfig';
import { MOONWATER_PRODUCTS } from './constants';
import { filterProducts } from './utils';

// Import unified components from the shared directory
import FilterBar from '@/components/product/FilterBar';
import DenseView from '@/components/product/DenseView';
import HeroSection from '@/components/product/HeroSection';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';

export default function MoonwaterCollectionPage() {
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

  return (
    <ProductCollectionPage
      config={moonwaterConfig}
      products={MOONWATER_PRODUCTS}
      FilterBar={EnhancedFilterBar}
      DenseView={EnhancedDenseView}
      HeroSection={EnhancedHeroSection}
      SubscriptionSection={EnhancedSubscriptionSection}
      ReviewsSection={EnhancedReviewsSection}
      filterProducts={wrappedFilterProducts}
    />
  );
}