// Shared constants for vape page
export const WEIGHT_PRICING = {
  '0.5g': 35,
  '1g': 50,
  '2g': 85,
  '3g': 120,
  '5g': 180
} as const;

// Disposable vape pricing
export const DISPOSABLE_PRICING = {
  '0.5g': 35,
  '1g': 50,
  '2g': 85,
  '3g': 120
} as const;

export const WEIGHTS = ['0.5g', '1g', '2g', '3g', '5g'] as const;
export const DISPOSABLE_SIZES = ['0.5g', '1g', '2g', '3g'] as const;

// Format types
export type ProductFormat = 'cartridge' | 'disposable';

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

// Product data - Vape products
export const VAPE_PRODUCTS: FeaturedProduct[] = [
  {
    id: 1,
    title: "jungle cake",
    description: "mysterious and minimal. jungle cake captures the essence of silence in a room full of noise—undeniably powerful.",
    price: 35.00,
    image: "/categories/VAPE.png",
    category: "indica",
    vibe: "relax",
    thc: 88.31,
    nose: ["sherb", "gas"],
    spotlight: "premium live resin with exceptional potency",
    featured: true,
    lineage: "zkittlez x gelato",
    terpenes: ["limonene", "caryophyllene", "linalool"]
  },
  {
    id: 2,
    title: "white runtz",
    description: "cold, crisp, and calculated. white runtz hits with a clinical precision you'll want to experience again and again.",
    price: 35.00,
    image: "/categories/VAPE.png",
    category: "sativa",
    vibe: "energize",
    thc: 92.75,
    nose: ["candy", "gas"],
    spotlight: "pure distillate with energizing sativa terpenes",
    featured: true,
    lineage: "snowman x white runtz",
    terpenes: ["myrcene", "pinene", "terpinolene"]
  },
  {
    id: 3,
    title: "jet fuel",
    description: "dense and commanding. jet fuel doesn't ask for your attention—it takes it, and never gives it back.",
    price: 35.00,
    image: "/categories/VAPE.png",
    category: "indica",
    vibe: "relax",
    thc: 85.19,
    nose: ["cake", "sherb"],
    spotlight: "solventless rosin for the true connoisseur",
    featured: true,
    lineage: "wedding cake x sherb",
    terpenes: ["caryophyllene", "limonene", "myrcene"]
  },
  {
    id: 4,
    title: "gelato 33",
    description: "this isn't your childhood chimney sweep. gelato 33 lifts you high, with just enough grit to keep you grounded.",
    price: 35.00,
    image: "/categories/VAPE.png",
    category: "hybrid",
    vibe: "balance",
    thc: 89.44,
    nose: ["candy", "gas"],
    spotlight: "our highest thc hybrid vape for the connoisseur",
    featured: true,
    lineage: "gary payton x runtz",
    terpenes: ["limonene", "caryophyllene", "humulene"]
  },
  {
    id: 5,
    title: "super skunk",
    description: "a bold strain for those with acquired taste. super skunk lingers—rich, pungent, and absolutely unapologetic.",
    price: 35.00,
    image: "/categories/VAPE.png",
    category: "hybrid",
    vibe: "balance",
    thc: 87.22,
    nose: ["funk", "gas"],
    spotlight: "terp sauce with a truly unique funk profile",
    featured: false,
    lineage: "miracle alien cookies x cheese",
    terpenes: ["myrcene", "pinene", "caryophyllene"]
  }
]; 