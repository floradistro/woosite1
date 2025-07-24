// Shared constants for moonwater/beverages page
export const BOTTLE_PRICING = {
  '1-bottle': 8,
  '2-bottle': 15,
  '3-bottle': 21,
  '6-bottle': 40
} as const;

// Multi-pack pricing
export const PACK_PRICING = {
  '4-pack': 28,
  '8-pack': 52,
  '12-pack': 72,
  '24-pack': 135
} as const;

export const BOTTLE_SIZES = ['1-bottle', '2-bottle', '3-bottle', '6-bottle'] as const;
export const PACK_SIZES = ['4-pack', '8-pack', '12-pack', '24-pack'] as const;

// Format types
export type ProductFormat = 'bottle' | 'pack';

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

export const FLAVOR_COLORS = {
  citrus: "bg-orange-500 border-orange-600",
  berry: "bg-purple-500 border-purple-600",
  tropical: "bg-pink-500 border-pink-600",
  herbal: "bg-green-500 border-green-600",
  mint: "bg-cyan-500 border-cyan-600"
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
  flavor: Array<'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint'>;
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
  flavor: string[];
}

// Import server-side API
import { wooCommerceServerAPI } from '../../lib/woocommerce-server';

// Transform WooCommerce products to moonwater format
export async function getMoonwaterProducts(): Promise<FeaturedProduct[]> {
  try {

    // Use the optimized multi-category fetch
    const moonwaterCategories = ['moonwater', 'beverage', 'beverages', 'drink', 'drinks'];
    
    let moonwaterProducts = await wooCommerceServerAPI.getProductsByCategories(moonwaterCategories);

    // If no products found, try category ID 1378 (based on original code)
    if (moonwaterProducts.length === 0) {

      moonwaterProducts = await wooCommerceServerAPI.getProducts({ category: '1378', per_page: 100, status: 'publish' });

    }
    
    if (moonwaterProducts.length === 0) {

      return [];
    }
    
    // Transform WooCommerce products to our format
    return moonwaterProducts.map((product, index) => {
      const categories = product.categories?.map(cat => cat.name.toLowerCase()) || [];
      const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
      
      // Extract category from categories or tags (default to hybrid for beverages)
      const getCategory = (): 'indica' | 'sativa' | 'hybrid' => {
        if (categories.includes('indica') || tags.includes('indica')) return 'indica';
        if (categories.includes('sativa') || tags.includes('sativa')) return 'sativa';
        return 'hybrid'; // Default for beverages
      };

      // Extract vibe from tags (default to balance for beverages)
      const getVibe = (): 'relax' | 'energize' | 'balance' => {
        if (tags.includes('relax') || tags.includes('relaxing')) return 'relax';
        if (tags.includes('energize') || tags.includes('energizing')) return 'energize';
        return 'balance'; // Default for beverages
      };

      // Extract THC dosage from description
      const getThc = (): number => {
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)\s*mg/i);
        return match ? parseFloat(match[1]) : 10.0; // Default 10mg for beverages
      };

      // Extract flavor from product info
      const getFlavor = (): Array<'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint'> => {
        const title = product.name?.toLowerCase() || '';
        const description = product.short_description?.toLowerCase() || product.description?.toLowerCase() || '';
        const allText = `${title} ${description} ${tags.join(' ')}`;
        
        const flavors: Array<'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint'> = [];
        
        if (allText.includes('berry') || allText.includes('berries')) flavors.push('berry');
        if (allText.includes('citrus') || allText.includes('lemon') || allText.includes('lime')) flavors.push('citrus');
        if (allText.includes('tropical') || allText.includes('mango') || allText.includes('pineapple')) flavors.push('tropical');
        if (allText.includes('herbal') || allText.includes('ginger') || allText.includes('tea')) flavors.push('herbal');
        if (allText.includes('mint') || allText.includes('menthol')) flavors.push('mint');
        
        return flavors.length > 0 ? flavors : ['citrus']; // Default to citrus array
      };

      return {
        id: product.id,
        title: product.name || 'Moonwater Beverage',
        description: product.short_description?.replace(/<[^>]*>/g, '') || product.description?.replace(/<[^>]*>/g, '') || 'Premium THC beverage',
        price: parseFloat(product.price) || 12.99,
        image: product.images?.[0]?.src || '/icons/Moonwater.png',
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        flavor: getFlavor(),
        spotlight: `Refreshing ${getFlavor()[0]} moonwater with ${getThc()}mg THC`,
        featured: index < 4,
        lineage: 'Premium cannabis extract',
        terpenes: getCategory() === 'indica' ? ['myrcene', 'linalool'] : 
                 getCategory() === 'sativa' ? ['limonene', 'pinene'] : 
                 ['limonene', 'myrcene']
      };
    });
  } catch (error) {
    console.error('❌ Error fetching moonwater products:', error);
    return [];
  }
}

// For backward compatibility during transition
export const MOONWATER_PRODUCTS: FeaturedProduct[] = [];

// Legacy code commented out - no longer needed
/*
// Import products from inventory
import { products as inventoryProducts } from '../../data/products';

// Convert inventory products to moonwater format
export const MOONWATER_PRODUCTS: FeaturedProduct[] = inventoryProducts
  .filter(product => 
    product.type === 'Moonwater' || 
    product.tags.some(tag => tag.toLowerCase().includes('beverage'))
  )
  .map(product => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    image: product.image,
    category: 'hybrid' as const,
    vibe: 'balance' as const,
    thc: 5, // Default THC for beverages
    flavor: ['citrus'], // Default flavor
    spotlight: `Refreshing ${product.title} with balanced effects`,
    featured: product.id <= 2,
    lineage: 'Premium hemp extract',
    terpenes: ['limonene', 'myrcene', 'pinene']
  }));
*/ 