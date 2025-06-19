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

// Product data
export const FLOWER_PRODUCTS: FeaturedProduct[] = [
  {
    id: 1,
    title: "zote",
    description: "mysterious and minimal. zote is like silence in a room full of noise's undeniably powerful.",
    price: 15.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/ZOTE.png?v=1743485173",
    category: "indica",
    vibe: "relax",
    thc: 26.31,
    nose: ["sherb", "gas"],
    spotlight: "premium indica strain with exceptional potency",
    featured: true,
    lineage: "zkittlez x gelato",
    terpenes: ["limonene", "caryophyllene", "linalool"]
  },
  {
    id: 2,
    title: "blizzard",
    description: "cold, crisp, and calculated. blizzard hits with a clinical precision you'll want to experience again and again.",
    price: 15.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/Blizzard.png?v=1743485174",
    category: "sativa",
    vibe: "energize",
    thc: 25.75,
    nose: ["candy", "gas"],
    spotlight: "energizing sativa blend with a sweet candy profile",
    featured: true,
    lineage: "snowman x white runtz",
    terpenes: ["myrcene", "pinene", "terpinolene"]
  },
  {
    id: 3,
    title: "cobb stopper",
    description: "dense and commanding. cobb stopper doesn't ask for your attention's it takes it, and never gives it back.",
    price: 15.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/Cobb_Stopper.png?v=1743485175",
    category: "indica",
    vibe: "relax",
    thc: 25.19,
    nose: ["cake", "sherb"],
    spotlight: "deep relaxation with an unforgettable cake nose",
    featured: true,
    lineage: "wedding cake x sherb",
    terpenes: ["caryophyllene", "limonene", "myrcene"]
  },
  {
    id: 4,
    title: "gary poppins",
    description: "this isn't your childhood chimney sweep. gary poppins lifts you high, with just enough grit to keep you grounded.",
    price: 15.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/Gary_Poppins.png?v=1743485175",
    category: "hybrid",
    vibe: "balance",
    thc: 28.44,
    nose: ["candy", "gas"],
    spotlight: "our highest thc hybrid strain for the connoisseur",
    featured: true,
    lineage: "gary payton x runtz",
    terpenes: ["limonene", "caryophyllene", "humulene"]
  },
  {
    id: 5,
    title: "mac and cheese",
    description: "a bold strain for those with acquired taste. mac and cheese lingers's rich, pungent, and absolutely unapologetic.",
    price: 15.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/Mac_And_Cheese.png?v=1743485176",
    category: "hybrid",
    vibe: "balance",
    thc: 28.22,
    nose: ["funk", "gas"],
    spotlight: "a truly unique funk profile for those who appreciate complexity",
    featured: false,
    lineage: "miracle alien cookies x cheese",
    terpenes: ["myrcene", "pinene", "caryophyllene"]
  },
  {
    id: 6,
    title: "strawberry cream",
    description: "sweet, seductive, and dangerously smooth. strawberry cream is what you reach for when you're too refined for reality.",
    price: 15.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/Strawberry_Cream.png?v=1743485177",
    category: "indica",
    vibe: "relax",
    thc: 23.47,
    nose: ["cake", "candy"],
    spotlight: "dessert-like indica with a sweet finish",
    featured: false,
    lineage: "strawberry banana x cookies & cream",
    terpenes: ["limonene", "linalool", "caryophyllene"]
  }
]; 