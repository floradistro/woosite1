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

export const TEXTURE_COLORS = {
  shatter: "bg-amber-500 border-amber-600",
  budder: "bg-yellow-400 border-yellow-500 text-black",
  sauce: "bg-orange-500 border-orange-600",
  diamonds: "bg-cyan-400 border-cyan-500 text-black",
  rosin: "bg-emerald-500 border-emerald-600"
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
  texture: Array<'shatter' | 'budder' | 'sauce' | 'diamonds' | 'rosin'>;
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
  texture: string[];
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
      const acf = product.acf || {};
      
      // Extract category from ACF strain_type or fallback to categories/tags
      const getCategory = (): 'indica' | 'sativa' | 'hybrid' => {
        if (acf.strain_type) {
          const strainType = acf.strain_type.toLowerCase();
          if (strainType.includes('indica')) return 'indica';
          if (strainType.includes('sativa')) return 'sativa';
          if (strainType.includes('hybrid')) return 'hybrid';
        }
        if (categories.includes('indica') || tags.includes('indica')) return 'indica';
        if (categories.includes('sativa') || tags.includes('sativa')) return 'sativa';
        return 'hybrid';
      };

      // Extract vibe from ACF effects or fallback to tags
      const getVibe = (): 'relax' | 'energize' | 'balance' => {
        if (acf.effects) {
          const effects = acf.effects.toLowerCase();
          if (effects.includes('relax') || effects.includes('calm') || effects.includes('sleep')) return 'relax';
          if (effects.includes('energiz') || effects.includes('uplifting') || effects.includes('focus')) return 'energize';
        }
        if (tags.includes('relax') || tags.includes('relaxing')) return 'relax';
        if (tags.includes('energize') || tags.includes('energizing')) return 'energize';
        return 'balance';
      };

             // Extract texture from product name or tags
       const getTexture = (): Array<'shatter' | 'budder' | 'sauce' | 'diamonds' | 'rosin'> => {
         const name = product.name.toLowerCase();
         const textures: Array<'shatter' | 'budder' | 'sauce' | 'diamonds' | 'rosin'> = [];
         
         if (name.includes('shatter')) textures.push('shatter');
         if (name.includes('budder') || name.includes('badder') || name.includes('batter')) textures.push('budder');
         if (name.includes('sauce')) textures.push('sauce');
         if (name.includes('diamond')) textures.push('diamonds');
         if (name.includes('rosin')) textures.push('rosin');
         
         return textures.length > 0 ? textures : ['budder'];
       };

      // Extract THC from ACF thca_% field
      const getThc = (): number => {
        if (acf['thca_%']) {
          const thcValue = parseFloat(acf['thca_%'].replace('%', ''));
          if (!isNaN(thcValue)) return thcValue;
        }
        return 75.0; // Default for concentrates
      };

      return {
        id: product.id,
        title: product.name.toLowerCase(),
        description: product.short_description || product.description || 'Premium cannabis concentrate',
        price: parseFloat(product.price) || 60,
        image: product.images?.[0]?.src || "/categories/WAX.png",
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        texture: getTexture(),
        spotlight: acf.effects || "Premium concentrate with exceptional potency",
        featured: index < 4,
        lineage: acf.lineage || "premium genetics",
        terpenes: acf.dominent_terpene ? [acf.dominent_terpene.toLowerCase(), "limonene", "caryophyllene"] : ["myrcene", "limonene", "caryophyllene"]
      };
    });
    } catch (error) {
    console.error('Error fetching wax/concentrate products from WooCommerce:', error);
    return [];
  }
} 