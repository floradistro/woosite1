// Shared constants for edibles page
export const SINGLE_PRICING = {
  '1-piece': 8,
  '2-piece': 15,
  '3-piece': 22
} as const;

// Bulk pack pricing
export const PACK_PRICING = {
  '10-pack': 60,
  '20-pack': 110,
  '50-pack': 250
} as const;

export const SINGLE_SIZES = ['1-piece', '2-piece', '3-piece'] as const;
export const PACK_SIZES = ['10-pack', '20-pack', '50-pack'] as const;

// Format types
export type ProductFormat = 'single' | 'bulk';

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

// Check if we should use WooCommerce or fallback to hardcoded data
const USE_WOOCOMMERCE = process.env.NEXT_PUBLIC_USE_WOOCOMMERCE === 'true';

// Transform WooCommerce products to edibles format
export async function getEdiblesProducts(): Promise<FeaturedProduct[]> {
  // If WooCommerce is disabled, return hardcoded fallback data
  if (!USE_WOOCOMMERCE) {

    return [
      {
        id: 1,
        title: "gummy bears",
        description: "classic fruit-flavored gummies with precise dosing",
        price: 25,
        image: "/icons/EDIBLES.png",
        category: "indica",
        vibe: "relax",
        thc: 10.0,
        type: ["gummies"],
        spotlight: "perfectly dosed for consistent effects",
        featured: true
      },
      {
        id: 2,
        title: "chocolate bar",
        description: "rich dark chocolate infused with premium cannabis",
        price: 30,
        image: "/icons/EDIBLES.png",
        category: "hybrid",
        vibe: "balance",
        thc: 100.0,
        type: ["chocolates"],
        spotlight: "artisanal chocolate with full-spectrum extract",
        featured: true
      },
      {
        id: 3,
        title: "sour gummies",
        description: "tangy sour gummies perfect for micro-dosing",
        price: 25,
        image: "/icons/EDIBLES.png",
        category: "sativa",
        vibe: "energize",
        thc: 5.0,
        type: ["gummies"],
        spotlight: "low-dose option for controlled experience",
        featured: true
      }
    ];
  }
  
  try {

    // Use the optimized multi-category fetch
    const edibleCategories = ['edible', 'edibles', 'gummy', 'gummies', 'chocolate', 'candy'];
    
    let edibleProducts = await wooCommerceServerAPI.getProductsByCategories(edibleCategories);

    // If no products found, try category ID 1381 (based on original code)
    if (edibleProducts.length === 0) {

      edibleProducts = await wooCommerceServerAPI.getProducts({ category: '1381', per_page: 100, status: 'publish' });

    }
    
    if (edibleProducts.length === 0) {

      return [];
    }
    
    // Transform WooCommerce products to our format
    return edibleProducts.map((product, index) => {
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

      // Extract edible type from product info
      const getType = (): Array<'gummies' | 'chocolates' | 'mints' | 'cookies' | 'caramels'> => {
        const title = product.name?.toLowerCase() || '';
        const allText = `${title} ${categories.join(' ')} ${tags.join(' ')}`;
        
        const types: Array<'gummies' | 'chocolates' | 'mints' | 'cookies' | 'caramels'> = [];
        
        if (allText.includes('gummy') || allText.includes('gummies')) types.push('gummies');
        if (allText.includes('chocolate')) types.push('chocolates');
        if (allText.includes('mint')) types.push('mints');
        if (allText.includes('cookie') || allText.includes('brownie') || allText.includes('baked')) types.push('cookies');
        if (allText.includes('caramel')) types.push('caramels');
        
        return types.length > 0 ? types : ['gummies']; // Default to gummies array
      };

      // Extract THC dosage from description
      const getThc = (): number => {
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)\s*mg/i);
        return match ? parseFloat(match[1]) : 10.0; // Default 10mg for edibles
      };

      return {
        id: product.id,
        title: product.name || 'Edible Product',
        description: product.short_description?.replace(/<[^>]*>/g, '') || product.description?.replace(/<[^>]*>/g, '') || 'Premium cannabis edible',
        price: parseFloat(product.price) || 29.99,
        image: product.images?.[0]?.src || '/categories/EDIBLES.png',
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        type: getType(),
        spotlight: `Premium ${getCategory()} edibles with precise dosing`,
        featured: index < 4,
        lineage: 'Premium cannabis extract',
        terpenes: getCategory() === 'indica' ? ['myrcene', 'linalool', 'caryophyllene'] : 
                 getCategory() === 'sativa' ? ['limonene', 'pinene', 'terpinolene'] : 
                 ['limonene', 'caryophyllene', 'myrcene']
      };
    });
  } catch (error) {
    console.error('❌ Error fetching edibles products:', error);
    return [];
  }
}

// For backward compatibility during transition
export const EDIBLE_PRODUCTS: FeaturedProduct[] = []; 