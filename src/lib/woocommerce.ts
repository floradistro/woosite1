// ACF Field Interfaces based on your export
export interface EdibleMoonwaterACF {
  strength_mg?: string;
  effects?: string;
}

export interface FlowerVapeConcentrateACF {
  'thca_%'?: string;
  strain_type?: string;
  nose?: string;
  effects?: string;
  dominent_terpene?: string;
  lineage?: string;
}

// Combined ACF fields interface
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

// WooCommerce Product Interface
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

// Normalized Product Interface for our app
export interface Product {
  id: number;
  handle: string;
  title: string;
  body: string;
  vendor: string;
  productCategory: string;
  type: string;
  tags: string[];
  published: boolean;
  options: string[];
  variantSku: string;
  variantGrams: number;
  variantInventoryTracker: string;
  variantInventoryPolicy: string;
  variantFulfillmentService: string;
  variantPrice: number;
  variantCompareAtPrice: number;
  variantRequiresShipping: boolean;
  variantTaxable: boolean;
  variantBarcode: string;
  imageSrc: string;
  imagePosition: number;
  imageAltText: string;
  giftCard: boolean;
  seoTitle: string;
  seoDescription: string;
  status: string;
  strainType2?: string;
  lineage?: string;
  thcaPercentage?: string;
  shortDescription?: string;
  longDescription: string | null;
  // ACF Fields mapped to our format
  strengthMg?: string;
  effects?: string;
  nose?: string;
  dominentTerpene?: string;
}

// Transform WooCommerce product to our format
export function transformWooCommerceProduct(wooProduct: WooCommerceProduct): Product {
  // Extract ACF fields from meta_data
  const extractMetaValue = (key: string): string | undefined => {
    if (!wooProduct.meta_data) return undefined;
    const meta = wooProduct.meta_data.find((m: any) => m.key === key);
    if (!meta?.value) return undefined;
    
    // Fix character encoding issues
    let value = meta.value;
    if (typeof value === 'string') {
      // Fix common UTF-8 encoding issues
      value = value
        .replace(/â€™/g, "'")
        .replace(/â€"/g, "—")
        .replace(/â€"/g, "–")
        .replace(/â€œ/g, '"')
        .replace(/â€/g, '"')
        .replace(/Ã—/g, "×")
        .replace(/Ã/g, "×")
        .replace(/â€'/g, "-");
    }
    
    return value;
  };
  
  // Try to get ACF fields from acf object first, then fallback to meta_data
  const acf = wooProduct.acf || {};
  
  // Helper function to get ACF value with fallback to meta_data
  const getACFValue = (acfKey: keyof ACFFields, metaKey?: string): string | undefined => {
    // First try the acf object
    const acfValue = acf[acfKey];
    if (acfValue && typeof acfValue === 'string' && acfValue.trim()) {
      return acfValue.trim();
    }
    
    // Then try meta_data with the provided key or a default mapping
    const metaKeyToUse = metaKey || acfKey.replace('_%', '').replace('_', '');
    const metaValue = extractMetaValue(metaKeyToUse);
    if (metaValue && typeof metaValue === 'string' && metaValue.trim()) {
      return metaValue.trim();
    }
    
    // Try alternative meta keys based on what we found in the actual data
    const alternativeKeys: Record<string, string[]> = {
      'thca_%': ['thca', 'thca_%'],
      'strain_type': ['strain_type'],
      'nose': ['nose'],
      'effects': ['effects'],
      'dominent_terpene': ['terpenes', 'dominent_terpene'],
      'lineage': ['taglinelineage', 'lineage'],
      'strength_mg': ['strength', 'strength_mg']
    };
    
    const altKeys = alternativeKeys[acfKey];
    if (altKeys) {
      for (const altKey of altKeys) {
        const altValue = extractMetaValue(altKey);
        if (altValue && typeof altValue === 'string' && altValue.trim()) {
          return altValue.trim();
        }
      }
    }
    
    return undefined;
  };
  
  // Debug log ACF fields for troubleshooting
  if (process.env.NODE_ENV === 'development' && wooProduct.categories?.[0]?.name === 'Flower') {
    const extractedFields = {
      thca: getACFValue('thca_%', 'thca'),
      strain_type: getACFValue('strain_type', 'strain_type'),
      nose: getACFValue('nose', 'nose'),
      effects: getACFValue('effects', 'effects'),
      terpenes: getACFValue('dominent_terpene', 'terpenes'),
      lineage: getACFValue('lineage', 'taglinelineage'),
      strength: getACFValue('strength_mg', 'strength')
    };
    
    console.log(`🌿 Flower Product ${wooProduct.id} (${wooProduct.name}):`, {
      categories: wooProduct.categories?.map(c => c.name),
      extractedACF: extractedFields,
      rawMetaData: wooProduct.meta_data?.filter((m: any) => 
        ['thca', 'strain_type', 'nose', 'effects', 'terpenes', 'taglinelineage'].includes(m.key)
      ).map((m: any) => ({ key: m.key, value: m.value }))
    });
  }
  
  return {
    id: wooProduct.id,
    handle: wooProduct.slug,
    title: wooProduct.name,
    body: wooProduct.description || wooProduct.short_description || '',
    vendor: 'Flora Distro',
    productCategory: wooProduct.categories?.[0]?.name || 'General',
    type: wooProduct.categories?.[0]?.name || 'Product',
    tags: wooProduct.tags?.map(tag => tag.name) || [],
    published: wooProduct.status === 'publish',
    options: [], // WooCommerce handles this differently
    variantSku: wooProduct.sku || '',
    variantGrams: 0, // Not directly available in WooCommerce
    variantInventoryTracker: 'woocommerce',
    variantInventoryPolicy: wooProduct.manage_stock ? 'deny' : 'continue',
    variantFulfillmentService: 'manual',
    variantPrice: parseFloat(wooProduct.price) || 0,
    variantCompareAtPrice: parseFloat(wooProduct.regular_price) || 0,
    variantRequiresShipping: wooProduct.shipping_required,
    variantTaxable: wooProduct.tax_status === 'taxable',
    variantBarcode: '',
    imageSrc: wooProduct.images?.[0]?.src || '/categories/FLOWER.png',
    imagePosition: 1,
    imageAltText: wooProduct.images?.[0]?.alt || wooProduct.name,
    giftCard: false,
    seoTitle: wooProduct.name,
    seoDescription: wooProduct.short_description || wooProduct.description || '',
    status: wooProduct.status,
    // Map ACF fields with proper handling
    strainType2: getACFValue('strain_type', 'strain_type'),
    lineage: getACFValue('lineage', 'taglinelineage'),
    thcaPercentage: getACFValue('thca_%', 'thca'),
    shortDescription: wooProduct.short_description || '',
    longDescription: wooProduct.description || null,
    // Map ACF fields to our format
    strengthMg: getACFValue('strength_mg', 'strength'),
    effects: getACFValue('effects', 'effects'),
    nose: getACFValue('nose', 'nose'),
    dominentTerpene: getACFValue('dominent_terpene', 'terpenes'),
  };
}

// API Functions using our server-side endpoint to avoid CORS
export const wooCommerceAPI = {
  // Get all products
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

      // Use our server-side API to avoid CORS issues
      const queryParams = new URLSearchParams();
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.tag) queryParams.append('tag', params.tag);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.featured) queryParams.append('featured', params.featured.toString());
      
      const url = `/api/woo-products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        return [];
      }
      
      console.log('WooCommerce API response:', {
        status: response.status,
        dataLength: data.products?.length,
        cached: data.cached
      });
      
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products from WooCommerce:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      return [];
    }
  },

  // Get products by trying multiple category names (optimized)
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

  // Get single product
  async getProduct(id: number): Promise<WooCommerceProduct | null> {
    try {
      const response = await fetch(`/api/woo-products/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        return null;
      }
      
      return data.product || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Get products by category
  async getProductsByCategory(categorySlug: string): Promise<WooCommerceProduct[]> {
    return this.getProducts({ category: categorySlug });
  },

  // Get categories
  async getCategories(): Promise<any[]> {
    try {
      const response = await fetch('/api/woo-categories');
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        return [];
      }
      
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
}; 