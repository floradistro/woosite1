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

// Transform WooCommerce products to concentrate format
export async function getConcentrateProducts(): Promise<FeaturedProduct[]> {
  try {

    // Direct approach using known category ID
    const concentrateProducts = await wooCommerceServerAPI.getProducts({ 
      category: '1408', 
      per_page: 100, 
      status: 'publish' 
    });

    if (concentrateProducts.length === 0) {

      return [];
    }

    return concentrateProducts.map((product, index) => {
      const categories = product.categories?.map(cat => cat.name.toLowerCase()) || [];
      const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
      const acf = product.acf;

      console.log(`🧪 Concentrate Product Debug - ${product.name}:`, {
        id: product.id,
        acf_object: acf || {},
        acf_keys: acf ? Object.keys(acf) : [],
        meta_data_keys: product.meta_data?.map((m: any) => m.key) || [],
        extracted_values: {},
        final_mapped: {}
      });

      // Helper function to get ACF value with multiple fallback strategies
      const getACFValue = (acfKey: string, metaKeys: string[] = []): string | undefined => {
        // First try the acf object
        if (acf && typeof acf === 'object' && acfKey in acf) {
          const acfValue = (acf as any)[acfKey];
          if (acfValue && typeof acfValue === 'string' && acfValue.trim()) {
            return acfValue.trim();
          }
        }
        
        // Then try meta_data with various key variations
        const keysToTry = [acfKey, ...metaKeys];
        for (const key of keysToTry) {
          const metaValue = product.meta_data?.find((m: any) => m.key === key);
          if (metaValue?.value && typeof metaValue.value === 'string' && metaValue.value.trim()) {
            return metaValue.value.trim();
          }
        }
        
        return undefined;
      };

      // Extract ACF values
      const thcaValue = getACFValue('thca_%', ['thca', '_thca']);
      const strainType = getACFValue('strain_type', ['type', '_type']);
      const nose = getACFValue('nose', ['_nose']);
      const effects = getACFValue('effects', ['_effects']);
      const dominentTerpene = getACFValue('dominent_terpene', ['terpenes', '_terpenes']);
      const lineage = getACFValue('lineage', ['_lineage']);

      // Map strain type to category
      const getCategory = (): 'indica' | 'sativa' | 'hybrid' => {
        if (strainType) {
          const type = strainType.toLowerCase();
          if (type.includes('indica')) return 'indica';
          if (type.includes('sativa')) return 'sativa';
          if (type.includes('hybrid')) return 'hybrid';
        }
        // Fallback to categories/tags
        if (categories.includes('indica') || tags.includes('indica')) return 'indica';
        if (categories.includes('sativa') || tags.includes('sativa')) return 'sativa';
        return 'hybrid';
      };

      // Map effects to vibe
      const getVibe = (): 'relax' | 'energize' | 'balance' => {
        if (effects) {
          const effect = effects.toLowerCase();
          if (effect.includes('relax')) return 'relax';
          if (effect.includes('energize')) return 'energize';
          if (effect.includes('balance')) return 'balance';
        }
        // Fallback to tags
        if (tags.includes('relax') || tags.includes('relaxing')) return 'relax';
        if (tags.includes('energize') || tags.includes('energizing')) return 'energize';
        return 'balance';
      };

      // Extract texture from product title/description/tags
      const getTexture = (): Array<'shatter' | 'budder' | 'sauce' | 'diamonds' | 'rosin'> => {
        const title = product.name?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || product.short_description?.toLowerCase() || '';
        const allText = `${title} ${description} ${tags.join(' ')}`;
        
        const textures: Array<'shatter' | 'budder' | 'sauce' | 'diamonds' | 'rosin'> = [];
        
        if (allText.includes('shatter')) textures.push('shatter');
        if (allText.includes('budder')) textures.push('budder');
        if (allText.includes('sauce')) textures.push('sauce');
        if (allText.includes('diamonds')) textures.push('diamonds');
        if (allText.includes('rosin')) textures.push('rosin');
        
        return textures.length > 0 ? textures : ['shatter']; // Default to shatter
      };

      // Parse THC percentage
      const getThc = (): number => {
        if (thcaValue) {
          const match = thcaValue.match(/(\d+\.?\d*)/);
          if (match) return parseFloat(match[1]);
        }
        // Fallback to description parsing
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)%?\s*thc/i);
        return match ? parseFloat(match[1]) : 85.0; // Default high THC for concentrates
      };

      const category = getCategory();
      const vibe = getVibe();
      const thc = getThc();
      const texture = getTexture();
      const spotlight = effects || `Premium ${product.name} concentrate`;

      // Build terpenes array
      const terpenes = dominentTerpene ? 
        [dominentTerpene.toLowerCase(), 'limonene', 'caryophyllene'] :
        category === 'indica' ? ['myrcene', 'linalool', 'caryophyllene'] : 
        category === 'sativa' ? ['limonene', 'pinene', 'terpinolene'] : 
        ['limonene', 'caryophyllene', 'myrcene'];

      const extractedValues = {
        thca: thcaValue,
        strain_type: strainType,
        nose: nose,
        effects: effects,
        dominent_terpene: dominentTerpene,
        lineage: lineage
      };

      const finalMapped = {
        category,
        thc,
        lineage: lineage || 'Premium concentrate extraction',
        nose: nose ? [nose.toLowerCase()] : ['concentrate'],
        vibe,
        spotlight,
        terpenes
      };

      // Update the debug log with actual values
      console.log(`🧪 Concentrate Product Debug - ${product.name}:`, {
        id: product.id,
        acf_object: acf || {},
        acf_keys: acf ? Object.keys(acf) : [],
        meta_data_keys: product.meta_data?.map((m: any) => m.key) || [],
        extracted_values: extractedValues,
        final_mapped: finalMapped
      });

      return {
        id: product.id,
        title: product.name,
        description: product.description?.replace(/<[^>]*>/g, '') || product.short_description?.replace(/<[^>]*>/g, '') || 'Premium cannabis concentrate',
        price: parseFloat(product.price) || 0,
        image: product.images?.[0]?.src || '/categories/WAX.png',
        category,
        vibe,
        thc,
        texture,
        spotlight,
        featured: index < 4,
        lineage: lineage || 'Premium concentrate extraction',
        terpenes,
        nose: nose ? [nose.toLowerCase()] : ['concentrate']
      };
    });
  } catch (error) {
    console.error('❌ Error fetching concentrate products:', error);
    return [];
  }
} 