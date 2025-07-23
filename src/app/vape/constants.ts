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

// Check if we should use WooCommerce or fallback to hardcoded data
const USE_WOOCOMMERCE = process.env.NEXT_PUBLIC_USE_WOOCOMMERCE === 'true';

// Transform WooCommerce products to vape format
export async function getVapeProducts(): Promise<FeaturedProduct[]> {
  // If WooCommerce is disabled, return hardcoded fallback data
  if (!USE_WOOCOMMERCE) {

    return [
      {
        id: 1,
        title: "wedding cake cart",
        description: "premium live resin cartridge with sweet vanilla notes",
        price: 45,
        image: "/categories/VAPE.png",
        category: "indica" as const,
        vibe: "relax" as const,
        thc: 85.0,
        nose: ["cake", "sherb"] as const,
        spotlight: "solventless extraction for pure flavor",
        featured: true,
        lineage: "cherry pie x girl scout cookies",
        terpenes: ["myrcene", "limonene", "caryophyllene"]
      },
      {
        id: 2,
        title: "blue dream cart",
        description: "uplifting sativa cartridge for daytime use",
        price: 45,
        image: "/categories/VAPE.png",
        category: "sativa" as const,
        vibe: "energize" as const,
        thc: 82.0,
        nose: ["candy", "gas"] as const,
        spotlight: "energizing effects with sweet berry flavor",
        featured: true,
        lineage: "blueberry x haze",
        terpenes: ["pinene", "myrcene", "limonene"]
      },
      {
        id: 3,
        title: "gelato cart",
        description: "balanced hybrid cartridge with dessert-like flavor",
        price: 45,
        image: "/categories/VAPE.png",
        category: "hybrid" as const,
        vibe: "balance" as const,
        thc: 87.0,
        nose: ["cake", "sherb"] as const,
        spotlight: "perfect balance of euphoria and relaxation",
        featured: true,
        lineage: "sunset sherbet x thin mint gsc",
        terpenes: ["limonene", "caryophyllene", "linalool"]
      }
    ];
  }
  
  try {

    // Direct approach using known category ID
    const { wooCommerceAPI } = await import('../../lib/woocommerce');

    const vapeProducts = await wooCommerceAPI.getProducts({ 
      category: '1374', 
      per_page: 100, 
      status: 'publish' 
    });

    if (vapeProducts.length === 0) {

      return [];
    }

    // Transform WooCommerce products to our format
    const transformedProducts = vapeProducts.map((product, index) => {
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

      // Extract nose characteristics from tags
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
          if (category === 'indica') return ['cake', 'sherb'];
          if (category === 'sativa') return ['gas', 'candy'];
          return ['gas', 'sherb'];
        }

        return noseOptions;
      };

      // Extract THC percentage from description
      const getThc = (): number => {
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)%?\s*thc/i);
        return match ? parseFloat(match[1]) : 85.0; // Default high THC for vapes
      };

      const transformedProduct = {
        id: product.id,
        title: product.name.toLowerCase(),
        description: product.short_description?.replace(/<[^>]*>/g, '').toLowerCase() || product.description?.replace(/<[^>]*>/g, '').toLowerCase() || 'premium cannabis vape',
        price: parseFloat(product.price) || 0,
        image: product.images?.[0]?.src || '/categories/VAPE.png',
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        nose: getNose(),
        spotlight: `premium ${getCategory()} vape with exceptional potency`,
        featured: index < 4,
        lineage: 'premium cannabis extract',
        terpenes: getCategory() === 'indica' ? ['myrcene', 'linalool', 'caryophyllene'] : 
                 getCategory() === 'sativa' ? ['limonene', 'pinene', 'terpinolene'] : 
                 ['limonene', 'caryophyllene', 'myrcene']
      };
      
      console.log(`Transformed vape product ${index + 1}:`, {
        id: transformedProduct.id,
        title: transformedProduct.title,
        category: transformedProduct.category,
        vibe: transformedProduct.vibe,
        nose: transformedProduct.nose,
        price: transformedProduct.price
      });
      
      return transformedProduct;
    });

    return transformedProducts;
  } catch (error) {
    console.error('❌ Error fetching vape products:', error);
    return [];
  }
}

// For backward compatibility during transition
export const VAPE_PRODUCTS: FeaturedProduct[] = []; 