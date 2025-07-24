'use client';

import ProductCollectionPage from './ProductCollectionPage';
import { ProductCollectionConfig } from './ProductCollectionConfig';
import FilterBar from '@/components/product/FilterBar';
import DenseView from '@/components/product/DenseView';
import HeroSection from '@/components/product/HeroSection';
import SubscriptionSection from '@/components/product/SubscriptionSection';
import ReviewsSection from '@/components/product/ReviewsSection';

interface ProductPageClientWrapperProps {
  config: ProductCollectionConfig;
  products: any[];
  productType: 'flower' | 'vape' | 'edible' | 'concentrate' | 'moonwater' | 'wax';
}

export default function ProductPageClientWrapper({ 
  config, 
  products,
  productType 
}: ProductPageClientWrapperProps) {
  // Dynamically import the correct filterProducts function based on productType
  let filterProducts: (products: any[], filters: any) => any[];
  
  switch (productType) {
    case 'flower':
      filterProducts = require('@/app/flower/utils').filterProducts;
      break;
    case 'vape':
      filterProducts = require('@/app/vape/utils').filterProducts;
      break;
    case 'edible':
      filterProducts = require('@/app/edible/utils').filterProducts;
      break;
    case 'concentrate':
      filterProducts = require('@/app/concentrate/utils').filterProducts;
      break;
    case 'moonwater':
      filterProducts = require('@/app/moonwater/utils').filterProducts;
      break;
    case 'wax':
      filterProducts = require('@/app/wax/utils').filterProducts;
      break;
    default:
      filterProducts = (products: any[]) => products;
  }
  
  // Enhanced component props for compatibility
  const EnhancedFilterBar = (props: any) => (
    <FilterBar {...props} formats={config.formats} />
  );
  
  const EnhancedDenseView = (props: any) => {
    const isPrimary = props.format === config.formats.primary;
    const pricing = isPrimary ? config.pricing.primary : config.pricing.secondary!;
    const sizes = Object.keys(pricing);
    
    return (
      <DenseView 
        {...props}
        productType={productType}
        pricing={pricing}
        sizes={sizes}
        selectedOptions={props.selectedWeights || props.selectedSizes}
        onOptionSelect={props.onWeightSelect || props.onSizeSelect}
      />
    );
  };
  
  const EnhancedHeroSection = (props: any) => {
    const isPrimary = props.format === config.formats.primary;
    
    return (
      <HeroSection
        productType={productType}
        format={props.format}
        title={{
          primary: config.content.hero.primary.title,
          secondary: config.content.hero.secondary?.title
        }}
        subtitle={{
          primary: config.content.hero.primary.subtitle,
          secondary: config.content.hero.secondary?.subtitle
        }}
        features={isPrimary 
          ? config.content.hero.primary.features || []
          : config.content.hero.secondary?.features || []
        }
        qualityBadges={isPrimary
          ? config.content.hero.primary.qualityBadges || []
          : config.content.hero.secondary?.qualityBadges || []
        }
      />
    );
  };
  
  const EnhancedSubscriptionSection = () => (
    <SubscriptionSection productType={productType} />
  );
  
  const EnhancedReviewsSection = () => (
    <ReviewsSection productType={productType} />
  );
  
  // Wrapper to handle type compatibility
  const wrappedFilterProducts = (products: any[], filters: any) => {
    return filterProducts(products, filters);
  };

  return (
    <ProductCollectionPage
      config={config}
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