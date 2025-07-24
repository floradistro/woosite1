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

// Transform WooCommerce products to flower format
export async function getFlowerProducts(): Promise<FeaturedProduct[]> {
  try {
    // Use the server-side API directly for SSR
    const flowerCategories = ['flower', 'flowers', 'bud', 'cannabis-flower', 'herb'];
    
    let flowerProducts = await wooCommerceServerAPI.getProductsByCategories(flowerCategories);

    // If no products found, try category ID 1372 (based on logs)
    if (flowerProducts.length === 0) {
      flowerProducts = await wooCommerceServerAPI.getProducts({ 
        category: '1372', 
        per_page: 100, 
        status: 'publish' 
      });
    }
    
    if (flowerProducts.length === 0) {
      console.log('No flower products found in WooCommerce');
      return [];
    }
    
    // Transform WooCommerce products to our format
    return flowerProducts.map((product, index) => {
      const categories = product.categories?.map(cat => cat.name.toLowerCase()) || [];
      const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
      const acf = product.acf || {};
      
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

      // Extract category from ACF strain_type or fallback to categories/tags
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

      // Extract vibe from ACF effects or fallback to tags
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

      // Extract nose characteristics from ACF nose field or fallback to tags
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

      // Extract THC percentage from ACF thca_% field or fallback to description
      const getThc = (): number => {
        const thcaValue = getACFValue('thca_%', ['thca_%', 'thca']);
        if (thcaValue) {
          const thcValue = parseFloat(thcaValue.replace('%', ''));
          if (!isNaN(thcValue)) return thcValue;
        }
        
        // Fallback to existing logic
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)%?\s*thc/i);
        return match ? parseFloat(match[1]) : 25.0;
      };

      // Get lineage from ACF field or generate default
      const getLineage = (): string => {
        const lineage = getACFValue('lineage', ['lineage', 'taglinelineage']);
        if (lineage) return lineage;
        
        return `Premium ${getCategory()} strain`;
      };

      // Get terpenes from ACF dominant terpene or generate defaults
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

      // Get effects for spotlight
      const getSpotlight = (): string => {
        const effects = getACFValue('effects', ['effects']);
        if (effects) return effects;
        
        // Generate based on vibe
        const vibe = getVibe();
        if (vibe === 'relax') return 'Relaxed Sleepy Calm';
        if (vibe === 'energize') return 'Energetic Focused Creative';
        return 'Balanced Euphoric Uplifted';
      };

      const transformedProduct = {
        id: product.id,
        title: product.name,
        description: product.short_description?.replace(/<[^>]*>/g, '') || product.description?.replace(/<[^>]*>/g, '') || `Premium ${getCategory()} strain with exceptional quality`,
        price: parseFloat(product.price) || 40,
        image: product.images?.[0]?.src || '/icons/FLOWER.png',
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        nose: getNose(),
        spotlight: getSpotlight(),
        featured: index < 4, // First 4 products are featured
        lineage: getLineage(),
        terpenes: getTerpenes()
      };
      
      // Enhanced debug log for first few products
      if (index < 3) {
        console.log(`🌿 Flower Product Debug - ${transformedProduct.title}:`, {
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
    });
  } catch (error) {
    console.error('❌ Error fetching flower products:', error);
    return [];
  }
}

// For backward compatibility, export a function that returns the products
// This will be replaced with direct API calls in components
export const FLOWER_PRODUCTS: FeaturedProduct[] = [
  {
    id: 1,
    title: "wedding cake",
    description: "premium indica-dominant hybrid with sweet vanilla notes",
    price: 40,
    image: "/icons/FLOWER.png",  
    category: "indica",
    vibe: "relax",
    thc: 28.5,
    nose: ["cake", "sherb"],
    spotlight: "award-winning strain with dense, frosty buds",
    featured: true,
    lineage: "cherry pie x girl scout cookies",
    terpenes: ["myrcene", "limonene", "caryophyllene"]
  },
  {
    id: 2,
    title: "blue dream",
    description: "classic sativa-dominant hybrid for daytime enjoyment",
    price: 40,
    image: "/icons/FLOWER.png",
    category: "sativa", 
    vibe: "energize",
    thc: 22.0,
    nose: ["candy", "gas"],
    spotlight: "uplifting effects with sweet blueberry flavor",
    featured: true,
    lineage: "blueberry x haze",
    terpenes: ["pinene", "myrcene", "caryophyllene"]
  },
  {
    id: 3,
    title: "gelato #33",
    description: "balanced hybrid with dessert-like flavor profile",
    price: 40,
    image: "/icons/FLOWER.png",
    category: "hybrid",
    vibe: "balance", 
    thc: 25.2,
    nose: ["cake", "sherb"],
    spotlight: "perfect balance of euphoria and relaxation",
    featured: true,
    lineage: "sunset sherbet x thin mint gsc",
    terpenes: ["limonene", "caryophyllene", "linalool"]
  },
  {
    id: 4,
    title: "purple punch",
    description: "indica-dominant strain with grape candy flavors",
    price: 40,
    image: "/icons/FLOWER.png",
    category: "indica",
    vibe: "relax",
    thc: 24.8,
    nose: ["candy", "funk"],
    spotlight: "sedating effects perfect for evening use",
    featured: true,
    lineage: "larry og x granddaddy purple",
    terpenes: ["myrcene", "pinene", "caryophyllene"]
  },
  {
    id: 5,
    title: "green crack",
    description: "energizing sativa perfect for productivity",
    price: 40,
    image: "/icons/FLOWER.png",
    category: "sativa",
    vibe: "energize",
    thc: 21.5,
    nose: ["gas", "candy"],
    spotlight: "invigorating strain for daytime activities",
    featured: true,
    lineage: "skunk #1 x unknown indica",
    terpenes: ["limonene", "pinene", "caryophyllene"]
  },
  {
    id: 6,
    title: "granddaddy purple",
    description: "classic indica with grape and berry flavors",
    price: 40,
    image: "/icons/FLOWER.png",
    category: "indica",
    vibe: "relax",
    thc: 23.0,
    nose: ["funk", "sherb"],
    spotlight: "legendary strain for deep relaxation",
    featured: true,
    lineage: "big bud x purple urkle",
    terpenes: ["myrcene", "pinene", "linalool"]
  }
]; 