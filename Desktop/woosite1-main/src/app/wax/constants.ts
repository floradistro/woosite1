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
  indica: "bg-indigo-600 border-indigo-700",
  sativa: "bg-red-600 border-red-700",
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

// Transform WooCommerce products to concentrate format
export async function getConcentrateProducts(): Promise<FeaturedProduct[]> {
  try {
    console.log('=== FETCHING CONCENTRATE PRODUCTS ===');
    
    // Direct approach using known category ID
    const { wooCommerceAPI } = await import('../../lib/woocommerce');
    console.log('Fetching concentrate products using category ID 1408...');
    
    const concentrateProducts = await wooCommerceAPI.getProducts({ 
      category: '1408', 
      per_page: 100, 
      status: 'publish' 
    });
    
    console.log(`Found ${concentrateProducts.length} concentrate products`);
    
    if (concentrateProducts.length === 0) {
      console.log('No concentrate products found');
      return [];
    }
    
    console.log('Raw concentrate products:', concentrateProducts.map(p => ({ id: p.id, name: p.name, categories: p.categories?.map(c => c.name) })));
    
    // Transform WooCommerce products to our format
    return concentrateProducts.map((product, index) => {
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

      // Extract THC percentage from description
      const getThc = (): number => {
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)%?\s*thc/i);
        return match ? parseFloat(match[1]) : 85.0; // Default high THC for concentrates
      };

      return {
        id: product.id,
        title: product.name.toLowerCase(),
        description: product.short_description?.replace(/<[^>]*>/g, '').toLowerCase() || product.description?.replace(/<[^>]*>/g, '').toLowerCase() || 'premium cannabis concentrate',
        price: parseFloat(product.price) || 0,
        image: product.images?.[0]?.src || '/categories/WAX.png',
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        texture: getTexture(),
        spotlight: `premium ${product.name} concentrate with exceptional potency and purity`,
        featured: index < 4,
        lineage: 'premium concentrate extraction',
        terpenes: getCategory() === 'indica' ? ['myrcene', 'linalool', 'caryophyllene'] : 
                 getCategory() === 'sativa' ? ['limonene', 'pinene', 'terpinolene'] : 
                 ['limonene', 'caryophyllene', 'myrcene']
      };
    });
  } catch (error) {
    console.error('❌ Error fetching concentrate products:', error);
    return [];
  }
} 