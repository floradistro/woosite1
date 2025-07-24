// Server-side WooCommerce functions for SSR
// These functions directly call WooCommerce API without going through Next.js API routes

// ACF Field Interfaces
export interface ACFFields {
  // Edible/Moonwater fields
  strength_mg?: string;
  // Flower/Vape/Concentrate fields
  'thca_%'?: string;
  strain_type?: string;
  nose?: string;
  effects?: string;
  dominent_terpene?: string;
  lineage?: string;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    date_created: string;
    date_modified: string;
    src: string;
    name: string;
    alt: string;
  }>;
  attributes: any[];
  default_attributes: any[];
  variations: any[];
  grouped_products: any[];
  menu_order: number;
  price_html: string;
  related_ids: number[];
  meta_data: Array<{
    id: number;
    key: string;
    value: any;
  }>;
  stock_status: string;
  has_options: boolean;
  post_password: string;
  // ACF Fields
  acf?: ACFFields;
}

// Server-side cache for better performance
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(params: any): string {
  return JSON.stringify(params);
}

function isValidCache(key: string): boolean {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
}

// Direct server-side API functions
export const wooCommerceServerAPI = {
  // Get products directly from WooCommerce API
  async getProducts(params?: {
    per_page?: number;
    page?: number;
    search?: string;
    category?: string;
    tag?: string;
    status?: string;
    featured?: boolean;
  }): Promise<WooCommerceProduct[]> {
    try {
      const storeUrl = process.env.WOOCOMMERCE_STORE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
      const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
      const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

      if (!storeUrl || !consumerKey || !consumerSecret) {
        console.error('Missing WooCommerce credentials');
        return [];
      }

      // Check cache first
      const cacheKey = getCacheKey(params);
      if (isValidCache(cacheKey)) {
        const cached = cache.get(cacheKey);
        return cached!.data;
      }

      // Build URL with parameters
      const queryParams = new URLSearchParams();
      queryParams.append('consumer_key', consumerKey);
      queryParams.append('consumer_secret', consumerSecret);
      
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.tag) queryParams.append('tag', params.tag);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.featured) queryParams.append('featured', params.featured.toString());
      
      // Set defaults
      if (!params?.per_page) queryParams.append('per_page', '100');
      if (!params?.status) queryParams.append('status', 'publish');
      
      // Add ACF fields to the request - ensure ACF fields are included
      queryParams.append('acf_format', 'standard');
      // Temporarily remove _fields to get full response including ACF
      // queryParams.append('_fields', 'id,name,slug,price,regular_price,sale_price,categories,tags,images,description,short_description,status,featured,acf');
      
      const url = `${storeUrl}/wp-json/wc/v3/products?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`WooCommerce API error: ${response.status} - ${errorText}`);
        return [];
      }

      const products = await response.json();
      
      // Cache the result
      cache.set(cacheKey, { data: products, timestamp: Date.now() });
      
      return products || [];
    } catch (error) {
      console.error('Error fetching products from WooCommerce:', error);
      return [];
    }
  },

  // Get categories directly
  async getCategories(): Promise<any[]> {
    try {
      const storeUrl = process.env.WOOCOMMERCE_STORE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
      const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
      const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

      if (!storeUrl || !consumerKey || !consumerSecret) {
        console.error('Missing WooCommerce credentials');
        return [];
      }

      const cacheKey = 'categories';
      if (isValidCache(cacheKey)) {
        const cached = cache.get(cacheKey);
        return cached!.data;
      }

      const url = `${storeUrl}/wp-json/wc/v3/products/categories?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=100`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch categories:', response.status);
        return [];
      }

      const categories = await response.json();
      
      // Cache the result
      cache.set(cacheKey, { data: categories, timestamp: Date.now() });
      
      return categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get products by multiple category names (optimized for SSR)
  async getProductsByCategories(categoryNames: string[]): Promise<WooCommerceProduct[]> {
    try {
      // First, get all categories to map names to IDs
      const categories = await this.getCategories();
      if (!categories || categories.length === 0) {
        console.error('No categories found');
        return [];
      }
      
      // Create a map of category names (lowercase) to IDs
      const categoryMap = new Map<string, number>();
      categories.forEach(cat => {
        categoryMap.set(cat.name.toLowerCase(), cat.id);
        categoryMap.set(cat.slug?.toLowerCase(), cat.id);
      });
      
      // Find matching category IDs
      const categoryIds: number[] = [];
      categoryNames.forEach(name => {
        const lowercaseName = name.toLowerCase();
        if (categoryMap.has(lowercaseName)) {
          const id = categoryMap.get(lowercaseName)!;
          if (!categoryIds.includes(id)) {
            categoryIds.push(id);
          }
        }
      });
      
      if (categoryIds.length === 0) {
        return [];
      }

      // Fetch products using category IDs
      const categoryParam = categoryIds.join(',');
      const products = await this.getProducts({ 
        category: categoryParam, 
        per_page: 100, 
        status: 'publish' 
      });

      return products;
    } catch (error) {
      console.error('Error fetching products by categories:', error);
      return [];
    }
  },
}; 