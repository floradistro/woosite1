import { FeaturedProduct, FilterState } from './constants';
import { useState, useEffect } from 'react';

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
    
    // Texture filter
    if (filters.texture.length > 0) {
      const hasMatchingTexture = product.texture.some(texture => 
        filters.texture.includes(texture)
      );
      if (!hasMatchingTexture) {
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
  const textures = new Set(products.flatMap(p => p.texture));
  
  return {
    categories: Array.from(categories),
    vibes: Array.from(vibes),
    textures: Array.from(textures)
  };
}

// Check if device is mobile
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768;
  
  return isMobile;
}; 