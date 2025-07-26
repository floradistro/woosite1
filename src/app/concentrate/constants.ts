// Shared constants for concentrate page - weights match flower options
export const WEIGHTS = ['1g', '3.5g', '7g', '14g', '28g'] as const;
export const GRAM_SIZES = ['1g', '3.5g', '7g', '14g', '28g'] as const;

// Format types
export type ProductFormat = 'concentrate' | 'live-resin';

// Color mappings for tags
export const CATEGORY_COLORS = {
  indica: "bg-purple-600 border-purple-700",
  sativa: "bg-yellow-600 border-yellow-700",
  hybrid: "bg-green-600 border-green-700"
} as const;

export const VIBE_COLORS = {
  relax: "bg-purple-600 border-purple-700",
  energize: "bg-yellow-600 border-yellow-700 text-black",
  balance: "bg-teal-600 border-teal-700"
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
  lineage?: string;
  terpenes?: string[];
  nose?: string[];
  type?: string;
  stockQuantity?: number | null;
  stockStatus?: string;
  inStock?: boolean;
}

export interface FeaturedProduct extends Product {
  spotlight: string;
  featured?: boolean;
  hasVariations?: boolean;
  variationPricing?: Record<string, number>;
  variations?: any[];
  type?: string;
}

export interface FilterState {
  category: string[];
  vibe: string[];
  nose?: string[];
}

// Import products from WooCommerce service
import { productService } from '../../services/productService';
import { wooCommerceServerAPI } from '../../lib/woocommerce-server';
import { fetchWithRetry } from '../../utils/fetchWithRetry';

// Enhanced function to fetch variations for a product with timeout and retry logic
async function getProductVariations(productId: number): Promise<any[]> {
  try {
    const response = await fetchWithRetry(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/woo-products/${productId}/variations`);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.variations : [];
  } catch (error: any) {
    console.error(`Error fetching variations for product ${productId}:`, error.message || error);
    return [];
  }
}

// Transform WooCommerce products to concentrate format with proper variation handling
export async function getConcentrateProducts(): Promise<FeaturedProduct[]> {
  try {
    // Direct approach using known category ID
    const concentrateProducts = await wooCommerceServerAPI.getProducts({ 
      category: '1408', 
      per_page: 100, 
      status: 'publish' 
    });

    if (concentrateProducts.length === 0) {
      return [];
    }

    // Process products with their variations
    const processedProducts = await Promise.all(
      concentrateProducts.map(async (product, index) => {
        const categories = product.categories?.map(cat => cat.name.toLowerCase()) || [];
        const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];

        // Helper function to get ACF value from meta_data
        const getACFValue = (key: string): string | undefined => {
          const metaItem = product.meta_data?.find((meta: any) => meta.key === key);
          return metaItem?.value && typeof metaItem.value === 'string' ? metaItem.value.trim() : undefined;
        };

        // Extract ACF values from meta_data
        const thcaValue = getACFValue('thca_%');
        const strainType = getACFValue('strain_type');
        const nose = getACFValue('nose');
        const effects = getACFValue('effects');
        const dominentTerpene = getACFValue('dominent_terpene');
        const lineage = getACFValue('lineage');



        // Map strain type to category
        const getCategory = (): 'indica' | 'sativa' | 'hybrid' => {
          if (strainType) {
            const type = strainType.toLowerCase();
            if (type.includes('indica')) return 'indica';
            if (type.includes('sativa')) return 'sativa';
            if (type.includes('hybrid')) return 'hybrid';
          }
          // Fallback to categories/tags
          if (categories.includes('indica') || tags.includes('indica')) return 'indica';
          if (categories.includes('sativa') || tags.includes('sativa')) return 'sativa';
          return 'hybrid';
        };

        // Map effects to vibe
        const getVibe = (): 'relax' | 'energize' | 'balance' => {
          if (effects) {
            const effect = effects.toLowerCase();
            if (effect.includes('relax')) return 'relax';
            if (effect.includes('energize')) return 'energize';
            if (effect.includes('balance')) return 'balance';
          }
          // Fallback to tags
          if (tags.includes('relax') || tags.includes('relaxing')) return 'relax';
          if (tags.includes('energize') || tags.includes('energizing')) return 'energize';
          return 'balance';
        };

        // Extract nose characteristics from ACF nose field (exactly like flower page)
        const getNose = (): Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'> => {
          const noseOptions: Array<'candy' | 'gas' | 'cake' | 'funk' | 'sherb'> = [];
          
          const noseValue = nose; // Use the already extracted nose value
          if (noseValue) {
            const noseText = noseValue.toLowerCase();
            
            if (noseText.includes('candy') || noseText.includes('sweet')) noseOptions.push('candy');
            if (noseText.includes('gas') || noseText.includes('fuel') || noseText.includes('diesel')) noseOptions.push('gas');
            if (noseText.includes('cake') || noseText.includes('vanilla') || noseText.includes('cream')) noseOptions.push('cake');
            if (noseText.includes('funk') || noseText.includes('cheese') || noseText.includes('earthy')) noseOptions.push('funk');
            if (noseText.includes('sherb') || noseText.includes('citrus') || noseText.includes('lemon')) noseOptions.push('sherb');
            
            if (noseOptions.length > 0) return noseOptions;
          }
          
          // Fallback to tags
          tags.forEach(tag => {
            if (tag.includes('candy') || tag.includes('sweet')) noseOptions.push('candy');
            if (tag.includes('gas') || tag.includes('fuel')) noseOptions.push('gas');
            if (tag.includes('cake') || tag.includes('vanilla')) noseOptions.push('cake');
            if (tag.includes('funk') || tag.includes('cheese')) noseOptions.push('funk');
            if (tag.includes('sherb') || tag.includes('citrus')) noseOptions.push('sherb');
          });

          // Default nose profiles if none found
          if (noseOptions.length === 0) {
            const category = getCategory();
            if (category === 'indica') return ['sherb', 'cake'];
            if (category === 'sativa') return ['gas', 'candy'];
            return ['gas', 'sherb'];
          }

          return noseOptions;
        };

        // Parse THC percentage
        const getThc = (): number => {
          if (thcaValue) {
            const match = thcaValue.match(/(\d+\.?\d*)/);
            if (match) return parseFloat(match[1]);
          }
          // Fallback to description parsing
          const description = product.description || product.short_description || '';
          const match = description.match(/(\d+\.?\d*)%?\s*thc/i);
          return match ? parseFloat(match[1]) : 85.0; // Default high THC for concentrates
        };

        // Extract weight-based pricing from meta_data
        let variationPricing: Record<string, number> = {};
        
        // Check for _weight_pricing in meta_data (custom tiered pricing)
        const weightPricingMeta = product.meta_data?.find((meta: any) => meta.key === '_weight_pricing');
        if (weightPricingMeta && weightPricingMeta.value) {
          try {
            // Parse the JSON string containing weight pricing
            const parsedPricing = typeof weightPricingMeta.value === 'string' 
              ? JSON.parse(weightPricingMeta.value)
              : weightPricingMeta.value;
            
            if (typeof parsedPricing === 'object') {
              variationPricing = parsedPricing;
            }
          } catch (error) {
            console.error(`Error parsing weight pricing for product ${product.id}:`, error);
          }
        }
        
        // Check for variable product variations
        let variations: any[] = [];
        if (product.type === 'variable' && product.variations && product.variations.length > 0) {
          variations = await getProductVariations(product.id);
          
          // If we don't have custom pricing, extract from variations
          if (Object.keys(variationPricing).length === 0 && variations.length > 0) {
            // Map variations to weight-based pricing
            variations.forEach((variation: any) => {
              // Extract weight from variation attributes
              const weightAttr = variation.attributes?.find((attr: any) => 
                attr.slug === 'pa_concentrate-weight' ||
                attr.slug === 'pa_weight' ||
                attr.name?.toLowerCase().includes('weight')
              );
              
              if (weightAttr && weightAttr.option) {
                const weight = weightAttr.option.toLowerCase();
                const price = parseFloat(variation.price) || parseFloat(variation.regular_price) || 0;
                
                // Normalize weight format (e.g., "1 gram" -> "1g", "3-5g" -> "3.5g")
                let normalizedWeight = weight.replace(/\s*(gram|grams|g)\s*/gi, 'g');
                normalizedWeight = normalizedWeight.replace('-', '.');
                variationPricing[normalizedWeight] = price;
              }
            });
          }
        }

        const category = getCategory();
        const vibe = getVibe();
        const thc = getThc();
        const spotlight = effects || `Premium ${product.name} concentrate`;

        // Build terpenes array - ensure dominant terpene is properly included
        const terpenes = dominentTerpene ? 
          [dominentTerpene.toLowerCase().trim()] :
          category === 'indica' ? ['myrcene'] : 
          category === 'sativa' ? ['limonene'] : 
          ['caryophyllene'];

        // Debug log for first few concentrate products
        if (index < 3) {
          console.log(`🧪 Concentrate Product Debug - ${product.name}:`, {
            id: product.id,
            wooType: product.type,
            hasVariations: variations.length > 0 || Object.keys(variationPricing).length > 0,
            variationCount: variations.length,
            variationPricing,
            woocommerce_pricing: {
              price: product.price,
              regular_price: product.regular_price,
              sale_price: product.sale_price,
              parsed_price: parseFloat(product.price),
              parsed_regular_price: parseFloat(product.regular_price),
              final_price: parseFloat(product.price) || parseFloat(product.regular_price) || 0
            },
            stock_info: {
              stock_quantity: product.stock_quantity,
              stock_status: product.stock_status,
              manage_stock: product.manage_stock,
              inStock: product.stock_status === 'instock' && (product.stock_quantity === null || product.stock_quantity > 0)
            },
            acf_fields: {
              thca: getACFValue('thca_%'),
              strain_type: getACFValue('strain_type'),
              nose: getACFValue('nose'),
              effects: getACFValue('effects'),
              dominent_terpene: getACFValue('dominent_terpene'),
              lineage: getACFValue('lineage')
            },
            final_mapped: {
              category,
              thc,
              lineage: lineage || 'Premium concentrate extraction',
              terpenes,
              nose: nose ? [nose.toLowerCase()] : ['concentrate'],
              type: strainType || category,
              vibe,
              spotlight
            }
          });
        }

        // Determine base price - use variation pricing if available, otherwise product price
        const basePrice = Object.keys(variationPricing).length > 0 
          ? Math.min(...Object.values(variationPricing)) // Use lowest variation price as base
          : parseFloat(product.price) || parseFloat(product.regular_price) || 55; // Fallback to reasonable concentrate price

        return {
          id: product.id,
          title: product.name,
          description: product.description?.replace(/<[^>]*>/g, '') || product.short_description?.replace(/<[^>]*>/g, '') || 'Premium cannabis concentrate',
          price: basePrice,
          image: product.images?.[0]?.src || '/categories/WAX.png',
          category,
          vibe,
          thc,
          spotlight,
          featured: index < 4,
          lineage: lineage || 'Premium concentrate extraction',
          terpenes,
          nose: nose ? [nose.toLowerCase()] : ['concentrate'], // Use the extracted nose value
          type: strainType || category, // Add type field for display
          stockQuantity: product.stock_quantity,
          stockStatus: product.stock_status,
          inStock: product.stock_status === 'instock' && (product.stock_quantity === null || product.stock_quantity > 0),
          // Add variation data for weight-based pricing
          hasVariations: variations.length > 0 || Object.keys(variationPricing).length > 0,
          variationPricing: Object.keys(variationPricing).length > 0 ? variationPricing : undefined,
          variations: variations.length > 0 ? variations : undefined,
          wooType: product.type // Include WooCommerce product type for debugging
        };
      })
    );

    return processedProducts;
  } catch (error) {
    console.error('❌ Error fetching concentrate products:', error);
    return [];
  }
} 