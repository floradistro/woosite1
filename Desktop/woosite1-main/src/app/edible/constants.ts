// Shared constants for edibles page
export const SINGLE_PRICING = {
  '1-piece': 5,
  '2-piece': 9,
  '5-piece': 20,
  '10-piece': 35
} as const;

// Bulk pack pricing
export const PACK_PRICING = {
  '10-pack': 40,
  '20-pack': 75,
  '50-pack': 170,
  '100-pack': 300
} as const;

export const SINGLE_SIZES = ['1-piece', '2-piece', '5-piece', '10-piece'] as const;
export const PACK_SIZES = ['10-pack', '20-pack', '50-pack', '100-pack'] as const;

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

// Product data
export const EDIBLE_PRODUCTS: FeaturedProduct[] = [
  {
    id: 1,
    title: "strawberry gummies",
    description: "sweet nostalgia meets modern potency. strawberry gummies deliver consistent effects with a burst of summer flavor.",
    price: 5.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/ZOTE.png?v=1743485173",
    category: "sativa",
    vibe: "energize",
    thc: 10,
    type: ["gummies"],
    spotlight: "energizing strawberry gummies with natural fruit flavor",
    featured: true,
    lineage: "strawberry cough infusion",
    terpenes: ["limonene", "pinene", "terpinolene"]
  },
  {
    id: 2,
    title: "dark chocolate squares",
    description: "rich, decadent, and perfectly dosed. dark chocolate squares offer a sophisticated way to elevate.",
    price: 5.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/Blizzard.png?v=1743485174",
    category: "indica",
    vibe: "relax",
    thc: 10,
    type: ["chocolates"],
    spotlight: "premium dark chocolate with relaxing indica effects",
    featured: true,
    lineage: "og kush blend",
    terpenes: ["myrcene", "linalool", "caryophyllene"]
  },
  {
    id: 3,
    title: "mint chill drops",
    description: "cool down and chill out. mint chill drops dissolve quickly for fast-acting, refreshing relief.",
    price: 5.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/Cobb_Stopper.png?v=1743485175",
    category: "hybrid",
    vibe: "balance",
    thc: 10,
    type: ["mints"],
    spotlight: "fast-acting mints with cooling sensation",
    featured: true,
    lineage: "thin mint cookies x peppermint",
    terpenes: ["limonene", "eucalyptol", "menthol"]
  },
  {
    id: 4,
    title: "snickerdoodle cookies",
    description: "homestyle comfort in every bite. snickerdoodle cookies bring warmth and relaxation together.",
    price: 5.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/Gary_Poppins.png?v=1743485175",
    category: "indica",
    vibe: "relax",
    thc: 10,
    type: ["cookies"],
    spotlight: "classic cookie flavor with soothing effects",
    featured: true,
    lineage: "girl scout cookies blend",
    terpenes: ["caryophyllene", "limonene", "humulene"]
  },
  {
    id: 5,
    title: "sea salt caramels",
    description: "sweet meets savory in perfect harmony. sea salt caramels offer a gourmet experience with every dose.",
    price: 5.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/Mac_And_Cheese.png?v=1743485176",
    category: "hybrid",
    vibe: "balance",
    thc: 10,
    type: ["caramels"],
    spotlight: "artisan caramels with balanced hybrid effects",
    featured: false,
    lineage: "wedding cake blend",
    terpenes: ["myrcene", "pinene", "caryophyllene"]
  },
  {
    id: 6,
    title: "mixed berry gummies",
    description: "a fruit medley that hits different. mixed berry gummies combine strawberry, blueberry, and raspberry flavors.",
    price: 5.00,
    image: "https://cdn.shopify.com/s/files/1/0877/4480/7195/files/Strawberry_Cream.png?v=1743485177",
    category: "sativa",
    vibe: "energize",
    thc: 10,
    type: ["gummies"],
    spotlight: "uplifting berry blend for daytime enjoyment",
    featured: false,
    lineage: "blue dream x berry white",
    terpenes: ["limonene", "linalool", "caryophyllene"]
  }
]; 