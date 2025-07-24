'use client';

import { useState, useEffect } from 'react';
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
  const [filterProducts, setFilterProducts] = useState<(products: any[], filters: any) => any[]>(() => (products: any[]) => products);
  
  useEffect(() => {
    const loadFilterFunction = async () => {
      let filterFunc: (products: any[], filters: any) => any[];
      
      switch (productType) {
        case 'flower':
          filterFunc = (await import('@/app/flower/utils')).filterProducts;
          break;
        case 'vape':
          filterFunc = (await import('@/app/vape/utils')).filterProducts;
          break;
        case 'edible':
          filterFunc = (await import('@/app/edible/utils')).filterProducts;
          break;
        case 'concentrate':
          filterFunc = (await import('@/app/concentrate/utils')).filterProducts;
          break;
        case 'moonwater':
          filterFunc = (await import('@/app/moonwater/utils')).filterProducts;
          break;
        case 'wax':
          filterFunc = (await import('@/app/wax/utils')).filterProducts;
          break;
        default:
          filterFunc = (products: any[]) => products;
      }
      
      setFilterProducts(() => filterFunc);
    };
    
    loadFilterFunction();
  }, [productType]);
  
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