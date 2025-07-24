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
      
      // Extract category from ACF strain_type or fallback to categories/tags
      const getCategory = (): 'indica' | 'sativa' | 'hybrid' => {
        // Check ACF field
        if (acf.strain_type) {
          const strainType = acf.strain_type.toLowerCase();
          if (strainType.includes('indica')) return 'indica';
          if (strainType.includes('sativa')) return 'sativa';
          if (strainType.includes('hybrid')) return 'hybrid';
        }
        
        // Check meta_data for strain_type
        const strainTypeMeta = product.meta_data?.find((m: any) => m.key === 'strain_type');
        if (strainTypeMeta?.value) {
          const strainType = strainTypeMeta.value.toLowerCase();
          if (strainType.includes('indica')) return 'indica';
          if (strainType.includes('sativa')) return 'sativa';
          if (strainType.includes('hybrid')) return 'hybrid';
        }
        
        // Fallback to existing logic
        if (categories.includes('indica') || tags.includes('indica')) return 'indica';
        if (categories.includes('sativa') || tags.includes('sativa')) return 'sativa';
        return 'hybrid';
      };

      // Extract vibe from ACF effects or fallback to tags
      const getVibe = (): 'relax' | 'energize' | 'balance' => {
        // Check ACF field
        if (acf.effects) {
          const effects = acf.effects.toLowerCase();
          if (effects.includes('relax') || effects.includes('calm') || effects.includes('sleep')) return 'relax';
          if (effects.includes('energiz') || effects.includes('uplifting') || effects.includes('focus')) return 'energize';
        }
        
        // Check meta_data for effects
        const effectsMeta = product.meta_data?.find((m: any) => m.key === 'effects');
        if (effectsMeta?.value) {
          const effects = effectsMeta.value.toLowerCase();
          if (effects.includes('relax') || effects.includes('calm') || effects.includes('sleep')) return 'relax';
          if (effects.includes('energiz') || effects.includes('uplifting') || effects.includes('focus')) return 'energize';
        }
        
        // Fallback to existing logic
        if (tags.includes('relax') || tags.includes('relaxing')) return 'relax';
        if (tags.includes('energize') || tags.includes('energizing')) return 'energize';
        return 'balance';
      };

      // Extract nose characteristics from ACF nose field or fallback to tags
      const getNose = (): Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'> => {
        const noseOptions: Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'> = [];
        
        // Check ACF field
        if (acf.nose) {
          const noseText = acf.nose.toLowerCase();
          
          if (noseText.includes('candy') || noseText.includes('sweet')) noseOptions.push('candy');
          if (noseText.includes('gas') || noseText.includes('fuel') || noseText.includes('diesel')) noseOptions.push('gas');
          if (noseText.includes('cake') || noseText.includes('vanilla') || noseText.includes('cream')) noseOptions.push('cake');
          if (noseText.includes('funk') || noseText.includes('cheese') || noseText.includes('earthy')) noseOptions.push('funk');
          if (noseText.includes('sherb') || noseText.includes('citrus') || noseText.includes('lemon')) noseOptions.push('sherb');
          
          if (noseOptions.length > 0) return noseOptions;
        }
        
        // Check meta_data for nose
        const noseMeta = product.meta_data?.find((m: any) => m.key === 'nose');
        if (noseMeta?.value) {
          const noseText = noseMeta.value.toLowerCase();
          
          // Map specific values to our categories
          if (noseText === 'glue' || noseText.includes('glue')) noseOptions.push('gas');
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
        // Check ACF fields
        if (acf['thca_%']) {
          const thcValue = parseFloat(acf['thca_%'].replace('%', ''));
          if (!isNaN(thcValue)) return thcValue;
        }
        
        // Check meta_data for thca field
        const thcaMeta = product.meta_data?.find((m: any) => m.key === 'thca');
        if (thcaMeta?.value && thcaMeta.value.trim() !== '') {
          const thcValue = parseFloat(thcaMeta.value.replace('%', ''));
          if (!isNaN(thcValue)) return thcValue;
        }
        
        // Fallback to existing logic
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)%?\s*thc/i);
        return match ? parseFloat(match[1]) : 25.0;
      };

      // Get lineage from ACF field or generate default
      const getLineage = (): string => {
        // Check ACF lineage field
        if (acf.lineage) return acf.lineage;
        
        // Check meta_data for taglinelineage field
        const lineageMeta = product.meta_data?.find((m: any) => m.key === 'taglinelineage');
        if (lineageMeta?.value) return lineageMeta.value;
        
        return `strain ${index + 1} lineage`;
      };

      // Get terpenes from ACF dominant terpene or generate defaults
      const getTerpenes = (): string[] => {
        // Check ACF dominent_terpene field
        if (acf.dominent_terpene) {
          return [acf.dominent_terpene.toLowerCase(), "limonene", "caryophyllene"];
        }
        
        // Check meta_data for terpenes field
        const terpenesMeta = product.meta_data?.find((m: any) => m.key === 'terpenes');
        if (terpenesMeta?.value) {
          return [terpenesMeta.value.toLowerCase(), "limonene", "caryophyllene"];
        }
        
        // Default terpenes based on category
        const category = getCategory();
        if (category === 'indica') return ["myrcene", "limonene", "caryophyllene"];
        if (category === 'sativa') return ["pinene", "limonene", "terpinolene"];
        return ["limonene", "myrcene", "caryophyllene"];
      };

      const transformedProduct = {
        id: product.id,
        title: product.name,
        description: product.short_description?.replace(/<[^>]*>/g, '') || product.description?.replace(/<[^>]*>/g, '') || '',
        price: parseFloat(product.price) || 0,
        image: product.images?.[0]?.src || '/icons/FLOWER.png',
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        nose: getNose(),
        spotlight: `Premium flower strain with exceptional quality`,
        featured: index < 4, // First 4 products are featured
        lineage: getLineage(),
        terpenes: getTerpenes()
      };
      
      // Debug log for first few products
      if (index < 3) {
        console.log(`🌿 Transformed flower product:`, {
          name: transformedProduct.title,
          category: transformedProduct.category,
          thc: transformedProduct.thc,
          lineage: transformedProduct.lineage,
          nose: transformedProduct.nose,
          vibe: transformedProduct.vibe
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