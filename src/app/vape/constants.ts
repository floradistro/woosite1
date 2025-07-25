// Shared constants for vape page
export const VAPE_PRICING = {
  '1': 49.99,
  '2': 79.99,
  '3': 104.99,
  '4': 124.99
} as const;

// Legacy exports for backward compatibility
export const WEIGHT_PRICING = VAPE_PRICING;
export const DISPOSABLE_PRICING = {
  '1-pack': 25,
  '2-pack': 45,
  '3-pack': 65
} as const;

export const VAPE_SIZES = ['1', '2', '3', '4'] as const;
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

// Helper function to get product variations
async function getProductVariations(productId: number): Promise<any[]> {
  try {
    const storeUrl = process.env.WOOCOMMERCE_STORE_URL || 
                    process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL || 
                    'https://distropass.wpcomstaging.com';
    
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || 
                       process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || 
                          process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      return [];
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const url = `${storeUrl}/wp-json/wc/v3/products/${productId}/variations`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching variations for product ${productId}:`, error);
    return [];
  }
}

// Transform WooCommerce products to vape format
export async function getVapeProducts(): Promise<FeaturedProduct[]> {
  try {
    // Only fetch vape products, not concentrate products
    const vapeCategories = ['vape', 'Vape'];
    
    const vapeProducts = await wooCommerceServerAPI.getProductsByCategories(vapeCategories);
    
    if (vapeProducts.length === 0) {
      console.log('No vape products found in WooCommerce categories:', vapeCategories);
      return [];
    }
    
    // Process products with variation pricing support
    const processedProducts = await Promise.all(vapeProducts.map(async (product, index) => {
      const categories = product.categories?.map(cat => cat.name.toLowerCase()) || [];
      const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
      const acf = product.acf || {};
      
      // Helper function to get ACF value with multiple fallback strategies (same as flower)
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

      // Extract category from ACF strain_type or fallback to categories/tags (same as flower)
      const getCategory = (): 'indica' | 'sativa' | 'hybrid' => {
        const strainType = getACFValue('strain_type', ['strain_type']);
        if (strainType) {
          const type = strainType.toLowerCase();
          if (type.includes('indica')) return 'indica';
          if (type.includes('sativa')) return 'sativa';
          if (type.includes('hybrid')) return 'hybrid';
        }
        
        // Fallback to existing logic
        if (categories.includes('indica') || tags.includes('indica')) return 'indica';
        if (categories.includes('sativa') || tags.includes('sativa')) return 'sativa';
        return 'hybrid';
      };

      // Extract vibe from ACF effects or fallback to tags (same as flower)
      const getVibe = (): 'relax' | 'energize' | 'balance' => {
        const effects = getACFValue('effects', ['effects']);
        if (effects) {
          const effectsLower = effects.toLowerCase();
          if (effectsLower.includes('relax') || effectsLower.includes('calm') || effectsLower.includes('sleep')) return 'relax';
          if (effectsLower.includes('energiz') || effectsLower.includes('uplifting') || effectsLower.includes('focus')) return 'energize';
          if (effectsLower.includes('balance') || effectsLower.includes('balanced')) return 'balance';
        }
        
        // Fallback to existing logic
        if (tags.includes('relax') || tags.includes('relaxing')) return 'relax';
        if (tags.includes('energize') || tags.includes('energizing')) return 'energize';
        return 'balance';
      };

      // Extract nose characteristics from ACF nose field or fallback to tags (same as flower)
      const getNose = (): Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'> => {
        const noseOptions: Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'> = [];
        
        const noseValue = getACFValue('nose', ['nose']);
        if (noseValue) {
          const noseText = noseValue.toLowerCase();
          
          if (noseText.includes('candy') || noseText.includes('sweet')) noseOptions.push('candy');
          if (noseText.includes('gas') || noseText.includes('fuel') || noseText.includes('diesel')) noseOptions.push('gas');
          if (noseText.includes('cake') || noseText.includes('vanilla') || noseText.includes('cream')) noseOptions.push('cake');
          if (noseText.includes('funk') || noseText.includes('cheese') || noseText.includes('earthy')) noseOptions.push('funk');
          if (noseText.includes('sherb') || noseText.includes('citrus') || noseText.includes('lemon')) noseOptions.push('sherb');
          
          if (noseOptions.length > 0) return noseOptions;
        }
        
        // Fallback to existing tag-based logic
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

      // Extract THC percentage from ACF thca_% field or fallback to description (same as flower)
      const getThc = (): number => {
        const thcaValue = getACFValue('thca_%', ['thca_%', 'thca']);
        if (thcaValue) {
          const thcValue = parseFloat(thcaValue.replace('%', ''));
          if (!isNaN(thcValue)) return thcValue;
        }
        
        // Fallback to existing logic
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)%?\s*thc/i);
        return match ? parseFloat(match[1]) : 85.0; // Default for vape
      };

      // Get lineage from ACF field or generate default (same as flower)
      const getLineage = (): string => {
        const lineage = getACFValue('lineage', ['lineage', 'taglinelineage']);
        if (lineage) return lineage;
        
        return `Premium ${getCategory()} strain`;
      };

      // Get terpenes from ACF dominant terpene or generate defaults (same as flower)
      const getTerpenes = (): string[] => {
        const dominentTerpene = getACFValue('dominent_terpene', ['dominent_terpene', 'terpenes']);
        if (dominentTerpene) {
          return [dominentTerpene.toLowerCase(), "limonene", "caryophyllene"];
        }
        
        // Default terpenes based on category
        const category = getCategory();
        if (category === 'indica') return ["myrcene", "limonene", "caryophyllene"];
        if (category === 'sativa') return ["pinene", "limonene", "terpinolene"];
        return ["limonene", "myrcene", "caryophyllene"];
      };

      // Get effects for spotlight (same as flower)
      const getSpotlight = (): string => {
        const effects = getACFValue('effects', ['effects']);
        if (effects) return effects;
        
        // Generate based on vibe
        const vibe = getVibe();
        if (vibe === 'relax') return 'Relaxed Sleepy Calm';
        if (vibe === 'energize') return 'Energetic Focused Creative';
        return 'Balanced Euphoric Uplifted';
      };

      // Fetch variations for tiered pricing
      const variationPricing: Record<string, number> = {};
      try {
        if (product.type === 'variable' && product.variations && product.variations.length > 0) {
          const variations = await getProductVariations(product.id);
          
          // Extract quantity-based pricing from variations
          variations.forEach((variation: any) => {
            const quantityAttr = variation.attributes?.find((attr: any) => 
              attr.name === 'Quantity' || attr.slug === 'pa_edible-quantity'
            );
            if (quantityAttr && quantityAttr.option && variation.price) {
              variationPricing[quantityAttr.option] = parseFloat(variation.price);
            }
          });
        }
      } catch (error) {
        console.log(`⚠️ Could not fetch variations for ${product.name}:`, error);
      }

      const transformedProduct = {
        id: product.id,
        title: product.name,
        description: product.short_description?.replace(/<[^>]*>/g, '') || product.description?.replace(/<[^>]*>/g, '') || `Premium ${getCategory()} vape cartridge with exceptional quality`,
        price: parseFloat(product.price) || VAPE_PRICING['1'],
        image: product.images?.[0]?.src || "/icons/vapeicon2.png",
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        nose: getNose(),
        spotlight: getSpotlight(),
        featured: index < 4, // First 4 products are featured
        lineage: getLineage(),
        terpenes: getTerpenes(),
        variationPricing: Object.keys(variationPricing).length > 0 ? variationPricing : VAPE_PRICING
      };
      
      // Enhanced debug log for first few products (same as flower)
      if (index < 3) {
        console.log(`💨 Vape Product Debug - ${transformedProduct.title}:`, {
          id: product.id,
          acf_object: acf,
          acf_keys: Object.keys(acf),
          meta_data_keys: product.meta_data?.map((m: any) => m.key) || [],
          extracted_values: {
            thca: getACFValue('thca_%', ['thca_%', 'thca']),
            strain_type: getACFValue('strain_type', ['strain_type']),
            nose: getACFValue('nose', ['nose']),
            effects: getACFValue('effects', ['effects']),
            dominent_terpene: getACFValue('dominent_terpene', ['dominent_terpene', 'terpenes']),
            lineage: getACFValue('lineage', ['lineage', 'taglinelineage'])
          },
          final_mapped: {
            category: transformedProduct.category,
            thc: transformedProduct.thc,
            lineage: transformedProduct.lineage,
            nose: transformedProduct.nose,
            vibe: transformedProduct.vibe,
            spotlight: transformedProduct.spotlight
          }
        });
      }
      
      return transformedProduct;
    }));
    
    return processedProducts;
  } catch (error) {
    console.error('❌ Error fetching vape products:', error);
    return [];
  }
}

// For backward compatibility during transition
export const VAPE_PRODUCTS: FeaturedProduct[] = []; 

export const VAPE_FORMAT_LABELS = {
  '1': '1 Vape',
  '2': '2 Vapes',
  '3': '3 Vapes', 
  '4': '4 Vapes'
} as const; 