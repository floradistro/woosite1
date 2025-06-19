// Shared constants for wax/concentrates page
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
export type ProductFormat = 'wax' | 'live-resin';

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

// Import products from inventory
import { products as inventoryProducts } from '../../data/products';

// Convert inventory products to wax format
export const WAX_PRODUCTS: FeaturedProduct[] = inventoryProducts
  .filter(product => product.type.toLowerCase() === 'wax')
  .map((product, index) => ({
    id: index + 1,
    title: product.title.toLowerCase(),
    description: product.body.replace(/<[^>]*>/g, ''), // Remove HTML tags
    price: product.variantPrice,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/WEBSITE_ICONS_12_f18dc325-6f85-491e-a06b-a29cfb9c30b2.png?v=1743487860", // Use consistent wax collection image
    category: 'hybrid' as const, // Default for concentrates
    vibe: 'energize' as const, // Default for concentrates
    thc: 85, // Default THC for concentrates
    texture: ['shatter'] as Array<'shatter' | 'budder' | 'sauce' | 'diamonds' | 'rosin'>, // Default texture
    spotlight: `premium ${product.title.toLowerCase()} concentrate with exceptional potency`,
    featured: true,
    lineage: 'premium concentrate extraction',
    terpenes: ['myrcene', 'limonene', 'caryophyllene']
  })); 