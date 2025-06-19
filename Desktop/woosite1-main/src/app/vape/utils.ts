import { WEIGHT_PRICING, type FilterState, type FeaturedProduct } from './constants';
import { useState, useEffect } from 'react';

// Utility functions for vape page
export const getProductPrice = (productId: number, selectedWeights: Record<number, string>): number => {
  const selectedWeight = selectedWeights[productId] || '0.5g';
  return WEIGHT_PRICING[selectedWeight as keyof typeof WEIGHT_PRICING];
};

export const getHandle = (title: string): string => 
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const filterProducts = (products: FeaturedProduct[], filters: FilterState) => {
  return products.filter(product => {
    const categoryMatch = filters.category.length === 0 || 
                         filters.category.includes(product.category);
    
    const vibeMatch = filters.vibe.length === 0 || 
                      filters.vibe.includes(product.vibe);
    
    const noseMatch = filters.nose.length === 0 || 
                     product.nose.some(nose => filters.nose.includes(nose));
    
    return categoryMatch && vibeMatch && noseMatch;
  });
};

export const getUniqueNoseProfiles = (products: FeaturedProduct[]): string[] => 
  [...new Set(products.flatMap(product => product.nose))];

export const checkIsMobile = (breakpoint = 768): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoint;
};

// Hook version for React components
export const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set initial value
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}; 