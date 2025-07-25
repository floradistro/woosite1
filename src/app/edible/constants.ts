// Shared constants for edibles page
export const SINGLE_PRICING = {
  '1-pack': 29.99,
  '2-pack': 49.99,
  '3-pack': 64.99,
  '4-pack': 74.99
} as const;

// Bulk pack pricing
export const PACK_PRICING = {
  '10-pack': 60,
  '20-pack': 110,
  '50-pack': 250
} as const;

export const SINGLE_SIZES = ['1-pack', '2-pack', '3-pack', '4-pack'] as const;
export const PACK_SIZES = ['10-pack', '20-pack', '50-pack'] as const;

// Format types
export type ProductFormat = 'single' | 'bulk';

// Color mappings for tags
export const CATEGORY_COLORS = {
  indica: "bg-purple-600 border-purple-700",
  sativa: "bg-yellow-600 border-yellow-700",
  hybrid: "bg-green-600 border-green-700"
} as const;

export const VIBE_COLORS = {
  relax: "bg-purple-600 border-purple-700",
  energize: "bg-yellow-600 border-yellow-700 text-black",
  balance: "bg-teal-600 border-teal-700"
} as const;

export const TYPE_COLORS = {
  gummies: "bg-pink-500 border-pink-600",
  chocolates: "bg-amber-600 border-amber-700",
  mints: "bg-cyan-500 border-cyan-600",
  cookies: "bg-orange-500 border-orange-600",
  caramels: "bg-yellow-500 border-yellow-600 text-black"
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
  type: Array<'gummies' | 'chocolates' | 'mints' | 'cookies' | 'caramels'>;
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
  type: string[];
}

// Import products from WooCommerce service
import { productService } from '../../services/productService';
import { wooCommerceServerAPI } from '../../lib/woocommerce-server';

// Transform WooCommerce products to edibles format
export async function getEdiblesProducts(): Promise<FeaturedProduct[]> {
  try {
    // Transform WooCommerce products to edibles format
    // Try multiple category names to match WooCommerce categories
    const edibleCategories = ['edibles', 'Edibles', 'edible', 'Edible'];
    
    let edibleProducts = await wooCommerceServerAPI.getProductsByCategories(edibleCategories);
    
    // If no products found by category name, try getting all products and filtering
    if (edibleProducts.length === 0) {
      const allProducts = await wooCommerceServerAPI.getProducts({ per_page: 100 });
      edibleProducts = allProducts.filter(product => 
        product.categories?.some((cat: any) => 
          ['edibles', 'Edibles', 'edible', 'Edible'].includes(cat.name)
        )
      );
    }
    
          if (edibleProducts.length === 0) {
        console.log('🍯 Still no edible products found after filtering, returning empty array');
        return [];
      }
    
    return edibleProducts.map((product, index) => {
      const categories = product.categories?.map(cat => cat.name.toLowerCase()) || [];
      const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
      const acf = product.acf || {};
      
      // Helper function to get ACF value from meta_data
      const getACFValue = (acfKey: string): string | undefined => {
        // ACF fields are stored in meta_data, not in a separate acf object
        const metaValue = product.meta_data?.find((m: any) => m.key === acfKey)?.value;
        if (metaValue && typeof metaValue === 'string' && metaValue.trim()) {
          return metaValue.trim();
        }
        
        return undefined;
      };
      
      // Extract category - for edibles, we don't rely on strain_type as much
      const getCategory = (): 'indica' | 'sativa' | 'hybrid' => {
        // Check ACF effects field to determine category
        const effects = getACFValue('effects');
        if (effects) {
          const effectsLower = effects.toLowerCase();
          if (effectsLower.includes('relax') || effectsLower.includes('calm') || effectsLower.includes('sleep') || effectsLower.includes('indica')) return 'indica';
          if (effectsLower.includes('energiz') || effectsLower.includes('uplifting') || effectsLower.includes('focus') || effectsLower.includes('sativa')) return 'sativa';
          if (effectsLower.includes('balanc') || effectsLower.includes('hybrid')) return 'hybrid';
        }
        
        // Fallback to categories/tags
        if (categories.includes('indica') || tags.includes('indica')) return 'indica';
        if (categories.includes('sativa') || tags.includes('sativa')) return 'sativa';
        return 'hybrid';
      };

      // Extract vibe from ACF effects field
      const getVibe = (): 'relax' | 'energize' | 'balance' => {
        const effects = getACFValue('effects');
        if (effects) {
          const effectsLower = effects.toLowerCase();
          if (effectsLower.includes('relax') || effectsLower.includes('calm') || effectsLower.includes('sleep')) return 'relax';
          if (effectsLower.includes('energiz') || effectsLower.includes('uplifting') || effectsLower.includes('focus')) return 'energize';
          if (effectsLower.includes('balanc')) return 'balance';
        }
        
        // Fallback to tags
        if (tags.includes('relax') || tags.includes('relaxing')) return 'relax';
        if (tags.includes('energize') || tags.includes('energizing')) return 'energize';
        return 'balance';
      };

      // Extract THC from ACF strength_mg field (specific to edibles)
      const getThc = (): number => {
        // Check ACF strength_mg field (primary field for edibles)
        const strengthMg = getACFValue('strength_mg');
        if (strengthMg) {
          const thcValue = parseFloat(strengthMg.replace(/[^0-9.]/g, ''));
          if (!isNaN(thcValue)) {
            return thcValue;
          }
        }
        
        // Fallback to description parsing
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)\s*mg/i);
        const fallbackValue = match ? parseFloat(match[1]) : 10.0;
        
        return fallbackValue;
      };

      // Extract edible type from product name or tags
      const getType = (): Array<'gummies' | 'chocolates' | 'mints' | 'cookies' | 'caramels'> => {
        const name = product.name.toLowerCase();
        const productTags = tags;
        
        if (name.includes('gumm') || productTags.includes('gummies')) return ['gummies'];
        if (name.includes('chocolate') || productTags.includes('chocolate')) return ['chocolates'];
        if (name.includes('cookie') || productTags.includes('cookies')) return ['cookies'];
        if (name.includes('brownie') || productTags.includes('brownies')) return ['cookies'];
        if (name.includes('caramel') || productTags.includes('caramels')) return ['caramels'];
        if (name.includes('mint') || productTags.includes('mints')) return ['mints'];
        
        return ['gummies']; // Default type
      };

      // Get the effects for spotlight text
      const getSpotlight = (): string => {
        const effects = getACFValue('effects');
        if (effects && effects.trim()) {
          return effects;
        }
        return "Precisely dosed for consistent effects";
      };



      // For edibles, we show: Strength (MG), Effects, and Description
      const effects = getACFValue('effects');
      const displayEffects = effects && effects.trim() ? effects : 'Relaxed Sleepy Calm';
      
      // Get the actual product description (not the mock one)
      let productDescription = '';
      if (product.short_description && product.short_description.trim()) {
        productDescription = product.short_description.replace(/<[^>]*>/g, '').trim();
      } else if (product.description && product.description.trim()) {
        productDescription = product.description.replace(/<[^>]*>/g, '').trim();
      }
      
      return {
        id: product.id,
        title: product.name,
        description: productDescription || 'Premium cannabis edible', // Show actual product description
        price: parseFloat(product.price) || 25,
        image: product.images?.[0]?.src || "/icons/newGummy.webp",
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        type: getType(),
        spotlight: displayEffects, // Show ACF effects field here
        featured: index < 4,
        stockQuantity: product.stock_quantity,
        stockStatus: product.stock_status,
        inStock: product.stock_status === 'instock' && (product.stock_quantity === null || product.stock_quantity > 0)
      };
    });
  } catch (error) {
    console.error('Error fetching edible products from WooCommerce:', error);
    return [];
  }
}

// For backward compatibility during transition
export const EDIBLE_PRODUCTS: FeaturedProduct[] = []; 