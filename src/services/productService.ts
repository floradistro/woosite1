import { wooCommerceAPI, transformWooCommerceProduct, Product as WooProduct, WooCommerceProduct } from '../lib/woocommerce';

// Reduced cache duration since API routes now handle primary caching
const productCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // Reduced to 1 minute since API route has longer cache

// Check if we should use WooCommerce or fallback to hardcoded data
const USE_WOOCOMMERCE = process.env.NEXT_PUBLIC_USE_WOOCOMMERCE === 'true';

class ProductService {
  private isValidCache(key: string): boolean {
    const cached = productCache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  }

  private getCache(key: string): any {
    return productCache.get(key)?.data;
  }

  private setCache(key: string, data: any): void {
    productCache.set(key, { data, timestamp: Date.now() });
  }

  // Get all products from WooCommerce
  async getAllProducts(): Promise<WooProduct[]> {
    const cacheKey = 'all_products';
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    if (!USE_WOOCOMMERCE) {

      return [];
    }

    try {

      const wooProducts = await wooCommerceAPI.getProducts({ 
        per_page: 100, 
        status: 'publish' 
      });

      const transformedProducts = wooProducts.map(transformWooCommerceProduct);

      this.setCache(cacheKey, transformedProducts);
      return transformedProducts;
    } catch (error) {
      console.error('Error fetching products from WooCommerce:', error);
      return []; // Return empty array on error, no fallback
    }
  }

  // Get products by type (Flower, Vape, etc.)
  async getProductsByType(productType: string): Promise<WooProduct[]> {

    const allProducts = await this.getAllProducts();
    
    const filtered = allProducts.filter(product => {
      const matches = product.type.toLowerCase() === productType.toLowerCase() ||
                     product.productCategory.toLowerCase() === productType.toLowerCase();
      
      if (matches) {

      }
      
      return matches;
    });

    return filtered;
  }

  // Get single product
  async getProduct(id: number): Promise<WooProduct | null> {
    const cacheKey = `product_${id}`;
    
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    if (!USE_WOOCOMMERCE) {

      return null;
    }

    try {
      const wooProduct = await wooCommerceAPI.getProduct(id);
      if (wooProduct) {
        const transformedProduct = transformWooCommerceProduct(wooProduct);
        this.setCache(cacheKey, transformedProduct);
        return transformedProduct;
      }
      return null;
    } catch (error) {
      console.error('Error fetching single product:', error);
      return null;
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<WooProduct[]> {
    const cacheKey = 'featured_products';
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    if (!USE_WOOCOMMERCE) {

      return [];
    }

    try {
      const wooProducts = await wooCommerceAPI.getProducts({ 
        featured: true, 
        per_page: 20,
        status: 'publish'
      });
      const transformedProducts = wooProducts.map(transformWooCommerceProduct);
      this.setCache(cacheKey, transformedProducts);
      return transformedProducts;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  // Search products
  async searchProducts(query: string): Promise<WooProduct[]> {
    if (!USE_WOOCOMMERCE) {

      return [];
    }

    try {
      const wooProducts = await wooCommerceAPI.getProducts({ 
        search: query, 
        per_page: 50,
        status: 'publish'
      });
      return wooProducts.map(transformWooCommerceProduct);
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Get products by category - optimized to avoid multiple API calls
  async getProductsByCategory(categorySlug: string): Promise<WooProduct[]> {
    const cacheKey = `category_${categorySlug}`;
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    if (!USE_WOOCOMMERCE) {

      return [];
    }

    try {
      // Use the single optimized API call instead of the old method
      const wooProducts = await wooCommerceAPI.getProducts({ 
        category: categorySlug,
        per_page: 100,
        status: 'publish'
      });
      
      const transformedProducts = wooProducts.map(transformWooCommerceProduct);
      this.setCache(cacheKey, transformedProducts);
      return transformedProducts;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }
}

export const productService = new ProductService(); 