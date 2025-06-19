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

// Import products from inventory
import { products as inventoryProducts } from '../../data/products';

// Convert inventory products to moonwater format
export const MOONWATER_PRODUCTS: FeaturedProduct[] = inventoryProducts
  .filter(product => 
    product.type === 'Moonwater' || 
    product.tags.some(tag => tag.toLowerCase().includes('beverage'))
  )
  .map((product, index) => ({
    id: index + 1,
    title: product.title.toLowerCase(),
    description: product.body.replace(/<[^>]*>/g, ''), // Remove HTML tags
    price: product.variantPrice,
    image: product.imageSrc,
    category: 'hybrid' as const, // Default for beverages
    vibe: 'balance' as const, // Default for beverages  
    thc: 5, // Default THC for beverages (5mg)
    flavor: ['citrus'] as Array<'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint'>, // Default flavor
    spotlight: `refreshing ${product.title.toLowerCase()} with natural hemp-derived delta-9 thc`,
    featured: true,
    lineage: 'hemp-derived delta-9 thc infusion',
    terpenes: ['limonene', 'myrcene', 'pinene']
  })); 