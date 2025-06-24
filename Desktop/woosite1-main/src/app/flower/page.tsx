"use client"

// React import not needed in React 17+
import ProductCollectionPage from '../components/ProductCollectionPage';
import { flowerConfig } from '../components/ProductCollectionConfig';
import { FLOWER_PRODUCTS } from './constants';
import { filterProducts } from './utils';

// Import unified components from the shared directory
import FilterBar from '@/components/product/FilterBar';
import DenseView from '@/components/product/DenseView';
import HeroSection from '@/components/product/HeroSection';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';

export default function FlowerCollectionPage() {
  // Enhanced component props for compatibility
  const EnhancedFilterBar = (props: any) => (
    <FilterBar {...props} formats={flowerConfig.formats} />
  );
  
  const EnhancedDenseView = (props: any) => (
    <DenseView 
      {...props}
      productType="flower"
      pricing={props.format === 'flower' ? flowerConfig.pricing.primary : flowerConfig.pricing.secondary!}
      sizes={props.format === 'flower' ? Object.keys(flowerConfig.pricing.primary) : Object.keys(flowerConfig.pricing.secondary!)}
      selectedOptions={props.selectedWeights}
      onOptionSelect={props.onWeightSelect}
    />
  );
  
  const EnhancedHeroSection = (props: any) => (
    <HeroSection
      productType="flower"
      format={props.format}
      title={{
        primary: flowerConfig.content.hero.primary.title,
        secondary: flowerConfig.content.hero.secondary?.title
      }}
      subtitle={{
        primary: flowerConfig.content.hero.primary.subtitle,
        secondary: flowerConfig.content.hero.secondary?.subtitle
      }}
      features={props.format === 'flower' 
        ? flowerConfig.content.hero.primary.features || []
        : flowerConfig.content.hero.secondary?.features || []
      }
      qualityBadges={props.format === 'flower'
        ? flowerConfig.content.hero.primary.qualityBadges || []
        : flowerConfig.content.hero.secondary?.qualityBadges || []
      }
    />
  );
  
  const EnhancedSubscriptionSection = () => (
    <SubscriptionSection productType="flower" />
  );
  
  const EnhancedReviewsSection = () => (
    <ReviewsSection productType="flower" />
  );
  
  // Wrapper to handle type compatibility
  const wrappedFilterProducts = (products: any[], filters: any) => {
    return filterProducts(products, filters);
  };

  return (
    <ProductCollectionPage
      config={flowerConfig}
      products={FLOWER_PRODUCTS}
      FilterBar={EnhancedFilterBar}
      DenseView={EnhancedDenseView}
      HeroSection={EnhancedHeroSection}
      SubscriptionSection={EnhancedSubscriptionSection}
      ReviewsSection={EnhancedReviewsSection}
      filterProducts={wrappedFilterProducts}
    />
  );
}