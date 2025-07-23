// Shared constants for flower page
export const WEIGHT_PRICING = {
  '1g': 15,
  '3.5g': 40,
  '7g': 60,
  '14g': 110,
  '28g': 200
} as const;

// Pre-roll pricing
export const PREROLL_PRICING = {
  '1-pack': 12,
  '3-pack': 30,
  '5-pack': 45,
  '10-pack': 85
} as const;

export const WEIGHTS = ['1g', '3.5g', '7g', '14g', '28g'] as const;
export const PREROLL_SIZES = ['1-pack', '3-pack', '5-pack', '10-pack'] as const;

// Format types
export type ProductFormat = 'flower' | 'preroll';

// Color mappings for tags
export const CATEGORY_COLORS = {
  indica: "bg-indigo-600 border-indigo-700",
  sativa: "bg-red-600 border-red-700",
  hybrid: "bg-green-600 border-green-700"
} as const;

export const VIBE_COLORS = {
  relax: "bg-purple-600 border-purple-700",
  energize: "bg-yellow-600 border-yellow-700 text-black",
  balance: "bg-teal-600 border-teal-700"
} as const;

export const NOSE_COLORS = {
  candy: "bg-pink-500 border-pink-600",
  gas: "bg-gray-600 border-gray-700",
  cake: "bg-amber-400 border-amber-500 text-black",
  funk: "bg-violet-700 border-violet-800",
  sherb: "bg-emerald-500 border-emerald-600"
} as const;

// Common styling
export const GLASS_CARD_STYLE = {
  background: '#4a4a4a',
  backdropFilter: 'blur(20px) saturate(150%)',
  WebkitBackdropFilter: 'blur(20px) saturate(150%)'
} as const;

export const PRODUCT_CARD_STYLE = {
  background: '#4a4a4a',
  backdropFilter: 'blur(20px) saturate(120%)',
  WebkitBackdropFilter: 'blur(20px) saturate(120%)'
} as const;

// Product interfaces
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: 'indica' | 'sativa' | 'hybrid';
  vibe: 'relax' | 'energize' | 'balance';
  thc: number;
  nose: Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'>;
  lineage?: string;
  terpenes?: string[];
}

export interface FeaturedProduct extends Product {
  spotlight: string;
  featured: boolean;
}

export interface FilterState {
  category: string[];
  vibe: string[];
  nose: string[];
}

// Import products from WooCommerce service
import { productService } from '../../services/productService';

// Transform WooCommerce products to flower format
export async function getFlowerProducts(): Promise<FeaturedProduct[]> {
  try {
    console.log('=== FETCHING FLOWER PRODUCTS ===');
    
    // Use the optimized multi-category fetch
    const { wooCommerceAPI } = await import('../../lib/woocommerce');
    const flowerCategories = ['flower', 'flowers', 'bud', 'cannabis-flower', 'herb'];
    
    let flowerProducts = await wooCommerceAPI.getProductsByCategories(flowerCategories);
    console.log(`Found ${flowerProducts.length} products from flower categories`);
    
    // If no products found, try some additional specific terms but avoid expensive "all products" fetch
    if (flowerProducts.length === 0) {
      console.log('Trying additional flower-specific categories...');
      const additionalCategories = ['indica', 'sativa', 'hybrid', 'strain'];
      flowerProducts = await wooCommerceAPI.getProductsByCategories(additionalCategories);
      console.log(`Found ${flowerProducts.length} products from additional categories`);
    }
    
    if (flowerProducts.length === 0) {
      console.log('No flower products found in any category');
      return [];
    }
    
    // Transform WooCommerce products to our format
    return flowerProducts.map((product, index) => {
      const categories = product.categories?.map(cat => cat.name.toLowerCase()) || [];
      const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
      
      // Extract category from categories or tags
      const getCategory = (): 'indica' | 'sativa' | 'hybrid' => {
        if (categories.includes('indica') || tags.includes('indica')) return 'indica';
        if (categories.includes('sativa') || tags.includes('sativa')) return 'sativa';
        return 'hybrid';
      };

      // Extract vibe from tags
      const getVibe = (): 'relax' | 'energize' | 'balance' => {
        if (tags.includes('relax') || tags.includes('relaxing')) return 'relax';
        if (tags.includes('energize') || tags.includes('energizing')) return 'energize';
        return 'balance';
      };

      // Extract nose characteristics
      const getNose = (): Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'> => {
        const noseOptions: Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'> = [];
        
        tags.forEach(tag => {
          if (tag.includes('candy') || tag.includes('sweet')) noseOptions.push('candy');
          if (tag.includes('gas') || tag.includes('fuel')) noseOptions.push('gas');
          if (tag.includes('cake') || tag.includes('vanilla')) noseOptions.push('cake');
          if (tag.includes('funk') || tag.includes('cheese')) noseOptions.push('funk');
          if (tag.includes('sherb') || tag.includes('citrus')) noseOptions.push('sherb');
        });

        // Default nose profiles if none found
        if (noseOptions.length === 0) {
          const category = getCategory();
          if (category === 'indica') return ['sherb', 'cake'];
          if (category === 'sativa') return ['gas', 'candy'];
          return ['gas', 'sherb'];
        }

        return noseOptions;
      };

      // Extract THC percentage from description or meta
      const getThc = (): number => {
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)%?\s*thc/i);
        return match ? parseFloat(match[1]) : 25.0;
      };

      return {
        id: product.id,
        title: product.name.toLowerCase(),
        description: product.short_description?.replace(/<[^>]*>/g, '').toLowerCase() || product.description?.replace(/<[^>]*>/g, '').toLowerCase() || '',
        price: parseFloat(product.price) || 0,
        image: product.images?.[0]?.src || '/icons/FLOWER.png',
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        nose: getNose(),
        spotlight: `premium flower strain with exceptional quality`,
        featured: index < 4, // First 4 products are featured
        lineage: 'premium cannabis genetics',
        terpenes: getCategory() === 'indica' ? ['myrcene', 'linalool', 'caryophyllene'] : 
                 getCategory() === 'sativa' ? ['limonene', 'pinene', 'terpinolene'] : 
                 ['limonene', 'caryophyllene', 'myrcene']
      };
    });
  } catch (error) {
    console.error('❌ Error fetching flower products:', error);
    return [];
  }
}

// For backward compatibility, export a function that returns the products
// This will be replaced with direct API calls in components
export const FLOWER_PRODUCTS: FeaturedProduct[] = []; 