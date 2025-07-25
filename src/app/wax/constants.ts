// Shared constants for concentrate page
export const WEIGHT_PRICING = {
  '0.5g': 30,
  '1g': 55,
  '2g': 100,
  '3.5g': 170,
  '7g': 320
} as const;

// Live resin pricing
export const GRAM_PRICING = {
  '0.5g': 35,
  '1g': 65,
  '2g': 120,
  '3.5g': 200
} as const;

export const WEIGHTS = ['0.5g', '1g', '2g', '3.5g', '7g'] as const;
export const GRAM_SIZES = ['0.5g', '1g', '2g', '3.5g'] as const;

// Format types
export type ProductFormat = 'concentrate' | 'live-resin';

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
  lineage?: string;
  terpenes?: string[];
  nose?: string[];
  type?: string;
}

export interface FeaturedProduct extends Product {
  spotlight: string;
  featured: boolean;
}

export interface FilterState {
  category: string[];
  vibe: string[];
  nose?: string[];
}

// Import products from WooCommerce service
import { productService } from '../../services/productService';
import { wooCommerceServerAPI } from '../../lib/woocommerce-server';

// Transform WooCommerce products to wax format
export async function getConcentrateProducts(): Promise<FeaturedProduct[]> {
  try {
    // Transform WooCommerce products to wax format
    // Try multiple category names to match WooCommerce categories
    const concentrateCategories = ['concentrate', 'Concentrate', 'wax', 'Wax', 'concentrates', 'Concentrates'];
    
    const waxProducts = await wooCommerceServerAPI.getProductsByCategories(concentrateCategories);
    
    if (waxProducts.length === 0) {
      console.log('No wax/concentrate products found in WooCommerce');
      return [];
    }
    
    return waxProducts.map((product, index) => {
      const categories = product.categories?.map(cat => cat.name.toLowerCase()) || [];
      const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
      
      // Helper function to get ACF value from meta_data
      const getACFValue = (key: string): string | undefined => {
        const metaItem = product.meta_data?.find((meta: any) => meta.key === key);
        return metaItem?.value && typeof metaItem.value === 'string' ? metaItem.value.trim() : undefined;
      };

      // Extract ACF values from meta_data
      const thcaValue = getACFValue('thca_%');
      const strainType = getACFValue('strain_type');
      const nose = getACFValue('nose');
      const effects = getACFValue('effects');
      const dominentTerpene = getACFValue('dominent_terpene');
      const lineage = getACFValue('lineage');
      
      // Extract category from ACF strain_type or fallback to categories/tags
      const getCategory = (): 'indica' | 'sativa' | 'hybrid' => {
        if (strainType) {
          const type = strainType.toLowerCase();
          if (type.includes('indica')) return 'indica';
          if (type.includes('sativa')) return 'sativa';
          if (type.includes('hybrid')) return 'hybrid';
        }
        if (categories.includes('indica') || tags.includes('indica')) return 'indica';
        if (categories.includes('sativa') || tags.includes('sativa')) return 'sativa';
        return 'hybrid';
      };

      // Extract vibe from ACF effects or fallback to tags
      const getVibe = (): 'relax' | 'energize' | 'balance' => {
        if (effects) {
          const effect = effects.toLowerCase();
          if (effect.includes('relax') || effect.includes('calm') || effect.includes('sleep')) return 'relax';
          if (effect.includes('energiz') || effect.includes('uplifting') || effect.includes('focus')) return 'energize';
          if (effect.includes('balance')) return 'balance';
        }
        if (tags.includes('relax') || tags.includes('relaxing')) return 'relax';
        if (tags.includes('energize') || tags.includes('energizing')) return 'energize';
        return 'balance';
      };

      // Extract THC from ACF thca_% field
      const getThc = (): number => {
        if (thcaValue) {
          const match = thcaValue.match(/(\d+\.?\d*)/);
          if (match) return parseFloat(match[1]);
        }
        return 75.0; // Default for concentrates
      };

      return {
        id: product.id,
        title: product.name,
        description: product.short_description?.replace(/<[^>]*>/g, '') || product.description?.replace(/<[^>]*>/g, '') || 'Premium cannabis concentrate',
        price: parseFloat(product.price) || 60,
        image: product.images?.[0]?.src || "/categories/WAX.png",
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        spotlight: effects || "Premium concentrate with exceptional potency",
        featured: index < 4,
        lineage: lineage || "premium genetics",
        terpenes: dominentTerpene ? [dominentTerpene.toLowerCase(), "limonene", "caryophyllene"] : ["myrcene", "limonene", "caryophyllene"],
        nose: nose ? [nose.toLowerCase()] : ['concentrate'], // Add nose field
        type: strainType || getCategory() // Add type field for display
      };
    });
    } catch (error) {
    console.error('Error fetching wax/concentrate products from WooCommerce:', error);
    return [];
  }
} 