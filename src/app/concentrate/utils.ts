import { FeaturedProduct, FilterState } from './constants';
// Utility functions only - hooks moved to custom hook files

// Utility functions for wax page
export const getHandle = (title: string): string => 
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function filterProducts(products: FeaturedProduct[], filters: FilterState): FeaturedProduct[] {
  return products.filter(product => {
    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(product.category)) {
      return false;
    }
    
    // Vibe filter
    if (filters.vibe.length > 0 && !filters.vibe.includes(product.vibe)) {
      return false;
    }
    
    // Nose filter
    if (filters.nose && filters.nose.length > 0) {
      const productNose = product.nose || [];
      const hasMatchingNose = productNose.some((nose: string) => 
        filters.nose!.includes(nose)
      );
      if (!hasMatchingNose) {
        return false;
      }
    }
    
    return true;
  });
}

export const checkIsMobile = (breakpoint = 768): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoint;
};

// Check if device is mobile (utility function)
export const isMobileDevice = (breakpoint = 768): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= breakpoint;
};

// Sort products by various criteria
export function sortProducts(products: FeaturedProduct[], sortBy: string): FeaturedProduct[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'thc':
      return sorted.sort((a, b) => b.thc - a.thc);
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      // 'featured' - keep original order
      return sorted;
  }
}

// Get unique filter values from products
export function getFilterOptions(products: FeaturedProduct[]) {
  const categories = new Set(products.map(p => p.category));
  const vibes = new Set(products.map(p => p.vibe));
  const noses = new Set(products.flatMap(p => p.nose || []));
  
  return {
    categories: Array.from(categories),
    vibes: Array.from(vibes),
    noses: Array.from(noses)
  };
}

// Check if device is mobile
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768;
  
  return isMobile;
}; 