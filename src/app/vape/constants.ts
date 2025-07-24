// Shared constants for vape page
export const VAPE_PRICING = {
  '0.5g': 35,
  '1g': 60
} as const;

// Legacy exports for backward compatibility
export const WEIGHT_PRICING = VAPE_PRICING;
export const DISPOSABLE_PRICING = {
  '1-pack': 25,
  '2-pack': 45,
  '3-pack': 65
} as const;

export const VAPE_SIZES = ['0.5g', '1g'] as const;
export const WEIGHTS = VAPE_SIZES;
export const DISPOSABLE_SIZES = ['1-pack', '2-pack', '3-pack'] as const;

// Format types
export type ProductFormat = 'vape' | 'cartridge' | 'disposable';

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
import { wooCommerceServerAPI } from '../../lib/woocommerce-server';

// Transform WooCommerce products to vape format
export async function getVapeProducts(): Promise<FeaturedProduct[]> {
  try {
    // Try multiple category names since vape products might be in Concentrate category
    const vapeCategories = ['vape', 'Vape', 'concentrate', 'Concentrate'];
    
    const vapeProducts = await wooCommerceServerAPI.getProductsByCategories(vapeCategories);
    
    if (vapeProducts.length === 0) {
      console.log('No vape products found in WooCommerce categories:', vapeCategories);
      return [];
    }
    
    return vapeProducts.map((product, index) => {
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

      // Extract nose from ACF or fallback to tags
      const getNose = (): Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'> => {
        if (acf.nose) {
          const noseOptions: Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'> = [];
          const noseText = acf.nose.toLowerCase();
          
          if (noseText.includes('candy') || noseText.includes('sweet')) noseOptions.push('candy');
          if (noseText.includes('gas') || noseText.includes('fuel')) noseOptions.push('gas');
          if (noseText.includes('cake') || noseText.includes('vanilla')) noseOptions.push('cake');
          if (noseText.includes('funk') || noseText.includes('cheese')) noseOptions.push('funk');
          if (noseText.includes('sherb') || noseText.includes('citrus')) noseOptions.push('sherb');
          
          if (noseOptions.length > 0) return noseOptions;
        }
        
        const category = getCategory();
        if (category === 'indica') return ['cake', 'sherb'];
        if (category === 'sativa') return ['gas', 'candy'];
        return ['gas', 'sherb'];
      };

      // Extract THC from ACF thca_% field
      const getThc = (): number => {
        // Check ACF fields
        if (acf['thca_%']) {
          const thcValue = parseFloat(acf['thca_%'].replace('%', ''));
          if (!isNaN(thcValue)) return thcValue;
        }
        
        // Check meta_data for thca field
        const thcaMeta = product.meta_data?.find((m: any) => m.key === 'thca');
        if (thcaMeta?.value) {
          const thcValue = parseFloat(thcaMeta.value.replace('%', ''));
          if (!isNaN(thcValue)) return thcValue;
        }
        
        return 85.0; // Default for vape
      };

      return {
        id: product.id,
        title: product.name.toLowerCase(),
        description: product.short_description || product.description || 'Premium vape cartridge',
        price: parseFloat(product.price) || 45,
        image: product.images?.[0]?.src || "/icons/vapeicon2.png",
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        nose: getNose(),
        spotlight: acf.effects || "Premium live resin extraction",
        featured: index < 4,
        lineage: acf.lineage || "premium genetics",
        terpenes: acf.dominent_terpene ? [acf.dominent_terpene.toLowerCase(), "limonene", "caryophyllene"] : ["myrcene", "limonene", "caryophyllene"]
      };
    });
  } catch (error) {
    console.error('Error fetching vape products from WooCommerce:', error);
    return [];
  }
}

// For backward compatibility during transition
export const VAPE_PRODUCTS: FeaturedProduct[] = []; 