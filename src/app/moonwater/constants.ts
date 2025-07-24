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
  indica: "bg-purple-600 border-purple-700",
  sativa: "bg-yellow-600 border-yellow-700",
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

// Import products from WooCommerce service
import { productService } from '../../services/productService';
import { wooCommerceServerAPI } from '../../lib/woocommerce-server';

// Enhanced moonwater product interface with variations
export interface MoonwaterVariation {
  id: number;
  flavor: string;
  packSize: string;
  price: number;
  image?: string;
  stockQuantity?: number;
  inStock: boolean;
}

export interface MoonwaterProductWithVariations extends FeaturedProduct {
  variations: MoonwaterVariation[];
  isVariable: boolean;
  baseProductId: number;
}

// Server-side function to fetch product variations
async function getProductVariations(productId: number): Promise<any[]> {
  try {
    const storeUrl = process.env.WOOCOMMERCE_STORE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

    if (!storeUrl || !consumerKey || !consumerSecret) {
      console.error('Missing WooCommerce credentials');
      return [];
    }

    const url = `${storeUrl}/wp-json/wc/v3/products/${productId}/variations?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=100`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch variations for product ${productId}: ${response.status}`);
      return [];
    }

    const variations = await response.json();
    return variations || [];
  } catch (error) {
    console.error(`Error fetching variations for product ${productId}:`, error);
    return [];
  }
}

// Transform WooCommerce products to moonwater format with variations
export async function getMoonwaterProducts(): Promise<MoonwaterProductWithVariations[]> {
  try {
    // Transform WooCommerce products to moonwater format
    // Try multiple category names to match WooCommerce categories
    const moonwaterCategories = ['moonwater', 'Moonwater', 'moon-water', 'Moon-water'];
    
    let moonwaterProducts = await wooCommerceServerAPI.getProductsByCategories(moonwaterCategories);
    
    // If no products found by category name, try getting all products and filtering
    if (moonwaterProducts.length === 0) {
      const allProducts = await wooCommerceServerAPI.getProducts({ per_page: 100 });
      moonwaterProducts = allProducts.filter(product => 
        product.categories?.some((cat: any) => 
          ['moonwater', 'Moonwater', 'moon-water', 'Moon-water'].includes(cat.name)
        )
      );
    }
    
    if (moonwaterProducts.length === 0) {
      console.log('💧 No moonwater products found in WooCommerce');
      return [];
    }
    
         // Process each product and fetch variations if it's a variable product
     const processedProducts = await Promise.all(moonwaterProducts.map(async (product, index) => {
      const categories = product.categories?.map(cat => cat.name.toLowerCase()) || [];
      const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
      const acf = product.acf || {};
      
      // Helper function to get ACF value from meta_data
      const getACFValue = (acfKey: string): string | undefined => {
        // ACF fields are stored in meta_data, not in a separate acf object
        const metaValue = product.meta_data?.find((m: any) => m.key === acfKey)?.value;
        if (metaValue && typeof metaValue === 'string' && metaValue.trim()) {
          return metaValue.trim();
        }
        
        return undefined;
      };
      
      // Extract category - for moonwater, check effects field first
      const getCategory = (): 'indica' | 'sativa' | 'hybrid' => {
        // Check ACF effects field to determine category
        const effects = getACFValue('effects');
        if (effects) {
          const effectsLower = effects.toLowerCase();
          if (effectsLower.includes('relax') || effectsLower.includes('calm') || effectsLower.includes('sleep') || effectsLower.includes('indica')) return 'indica';
          if (effectsLower.includes('energiz') || effectsLower.includes('uplifting') || effectsLower.includes('focus') || effectsLower.includes('sativa')) return 'sativa';
          if (effectsLower.includes('balanc') || effectsLower.includes('hybrid')) return 'hybrid';
        }
        
        // Fallback to categories/tags
        if (categories.includes('indica') || tags.includes('indica')) return 'indica';
        if (categories.includes('sativa') || tags.includes('sativa')) return 'sativa';
        return 'hybrid';
      };

      // Extract vibe from ACF effects field
      const getVibe = (): 'relax' | 'energize' | 'balance' => {
        const effects = getACFValue('effects');
        if (effects) {
          const effectsLower = effects.toLowerCase();
          if (effectsLower.includes('relax') || effectsLower.includes('calm') || effectsLower.includes('sleep')) return 'relax';
          if (effectsLower.includes('energiz') || effectsLower.includes('uplifting') || effectsLower.includes('focus')) return 'energize';
          if (effectsLower.includes('balanc')) return 'balance';
        }
        
        // Fallback to tags
        if (tags.includes('relax') || tags.includes('relaxing')) return 'relax';
        if (tags.includes('energize') || tags.includes('energizing')) return 'energize';
        return 'balance';
      };

      // Extract THC from product name for variable products (5MG, 10MG, 30MG, 60MG)
      const getThc = (): number => {
        // First check ACF strength_mg field (most reliable)
        const strengthMg = getACFValue('strength_mg');
        if (strengthMg) {
          const thcValue = parseFloat(strengthMg.replace(/[^0-9.]/g, ''));
          if (!isNaN(thcValue)) {
            console.log(`💧 Moonwater ${product.name} - Using ACF strength_mg: ${thcValue}mg`);
            return thcValue;
          }
        }
        
        // For variable products, extract from product name
        const nameMatch = product.name.match(/(\d+)MG/i);
        if (nameMatch) {
          const thcValue = parseInt(nameMatch[1]);
          console.log(`💧 Moonwater ${product.name} - Using name extraction: ${thcValue}mg`);
          return thcValue;
        }
        
        // Product-specific hardcoded values based on your specification
        const productName = product.name.toLowerCase();
        if (productName.includes('day drinker')) {
          console.log(`💧 Moonwater ${product.name} - Using hardcoded Day Drinker: 5mg`);
          return 5;
        }
        if (productName.includes('golden hour')) {
          console.log(`💧 Moonwater ${product.name} - Using hardcoded Golden Hour: 10mg`);
          return 10;
        }
        if (productName.includes('darkside')) {
          console.log(`💧 Moonwater ${product.name} - Using hardcoded Darkside: 30mg`);
          return 30;
        }
        if (productName.includes('riptide')) {
          console.log(`💧 Moonwater ${product.name} - Using hardcoded Riptide: 60mg`);
          return 60;
        }
        
        // Fallback to description parsing
        const description = product.description || product.short_description || '';
        const match = description.match(/(\d+\.?\d*)\s*mg/i);
        const fallbackValue = match ? parseFloat(match[1]) : 10.0;
        
        console.log(`💧 Moonwater ${product.name} - No strength found, using fallback: ${fallbackValue}mg`);
        return fallbackValue;
      };

      // Extract flavor from product name or tags
      const getFlavor = (): Array<'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint'> => {
        const name = product.name.toLowerCase();
        const description = product.short_description?.toLowerCase() || product.description?.toLowerCase() || '';
        const allText = `${name} ${description} ${tags.join(' ')}`;
        
        const flavors: Array<'citrus' | 'berry' | 'tropical' | 'herbal' | 'mint'> = [];
        
        if (allText.includes('berry') || allText.includes('berries')) flavors.push('berry');
        if (allText.includes('citrus') || allText.includes('lemon') || allText.includes('lime') || allText.includes('orange') || allText.includes('clementine')) flavors.push('citrus');
        if (allText.includes('tropical') || allText.includes('mango') || allText.includes('pineapple')) flavors.push('tropical');
        if (allText.includes('herbal') || allText.includes('ginger') || allText.includes('tea')) flavors.push('herbal');
        if (allText.includes('mint') || allText.includes('menthol')) flavors.push('mint');
        
        return flavors.length > 0 ? flavors : ['citrus']; // Default to citrus
      };

      // Get the effects for spotlight text - this is the key field for display
      const getSpotlight = (): string => {
        const effects = getACFValue('effects');
        if (effects && effects.trim()) {
          return effects;
        }
        return "Refreshing cannabis-infused beverage";
      };

      // Helper function to decode HTML entities and clean description
      const cleanDescription = (htmlString: string): string => {
        if (!htmlString || !htmlString.trim()) return '';
        
        // First remove HTML tags but preserve content
        let cleaned = htmlString.replace(/<[^>]*>/g, '');
        
        // Decode ALL common HTML entities (comprehensive list)
        cleaned = cleaned
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&#8217;/g, "'")  // Right single quotation mark
          .replace(/&#8216;/g, "'")  // Left single quotation mark
          .replace(/&#8220;/g, '"')  // Left double quotation mark
          .replace(/&#8221;/g, '"')  // Right double quotation mark
          .replace(/&#8230;/g, '...') // Horizontal ellipsis
          .replace(/&#8211;/g, '–')  // En dash
          .replace(/&#8212;/g, '—')  // Em dash
          .replace(/&nbsp;/g, ' ')
          .replace(/&hellip;/g, '...')
          .replace(/&ndash;/g, '–')
          .replace(/&mdash;/g, '—')
          .replace(/&lsquo;/g, "'")
          .replace(/&rsquo;/g, "'")
          .replace(/&ldquo;/g, '"')
          .replace(/&rdquo;/g, '"');
        
        // Clean up extra whitespace but preserve the full text
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        return cleaned;
      };

      // Get the actual product description - prioritize full description over short
      let productDescription = '';
      
      // Debug log to see what we're getting from WooCommerce
      if (index < 3) {
        console.log(`💧 Moonwater ${product.name} - Description fields:`, {
          hasDescription: !!product.description,
          descriptionLength: product.description?.length || 0,
          descriptionPreview: product.description?.substring(0, 100) + '...',
          hasShortDescription: !!product.short_description,
          shortDescriptionLength: product.short_description?.length || 0,
          shortDescriptionPreview: product.short_description?.substring(0, 100) + '...'
        });
      }
      
      // Prioritize full description over short description
      if (product.description && product.description.trim()) {
        productDescription = cleanDescription(product.description);
      } else if (product.short_description && product.short_description.trim()) {
        productDescription = cleanDescription(product.short_description);
      }

      // Fetch variations if this is a variable product
      let variations: MoonwaterVariation[] = [];
      const isVariable = product.type === 'variable';
      
      if (isVariable) {
        try {
          const variationData = await getProductVariations(product.id);
          variations = variationData.map((variation: any) => {
            // Extract flavor and pack size from variation attributes
            const flavorAttr = variation.attributes?.find((attr: any) => attr.name === 'Flavor');
            const packSizeAttr = variation.attributes?.find((attr: any) => attr.name === 'Pack Size');
            
            return {
              id: variation.id,
              flavor: flavorAttr?.option || 'Original',
              packSize: packSizeAttr?.option || 'Single',
              price: parseFloat(variation.price) || parseFloat(product.price) || 15,
              image: variation.image?.src || product.images?.[0]?.src || "/icons/Moonwater.png",
              stockQuantity: variation.stock_quantity,
              inStock: variation.stock_status === 'instock'
            };
          });
        } catch (error) {
          console.error(`Error processing variations for ${product.name}:`, error);
        }
      }

      // Debug log for first few moonwater products
      if (index < 3) {
        console.log(`💧 Moonwater product mapping:`, {
          name: product.name,
          id: product.id,
          type: product.type,
          isVariable,
          variationCount: variations.length,
          categories: categories,
          acf_fields: {
            strength_mg: getACFValue('strength_mg'),
            effects: getACFValue('effects'),
          },
          mapped_values: {
            thc: getThc(),
            category: getCategory(),
            vibe: getVibe(),
            spotlight: getSpotlight()
          }
        });
      }

      // For moonwater, we show: Strength (MG), Effects, and Description - same as edibles
      const effects = getACFValue('effects');
      const displayEffects = effects && effects.trim() ? effects : 'Refreshing Hydrating Uplifting';

      return {
        id: product.id,
        baseProductId: product.id,
        title: product.name,
        description: productDescription || 'Premium cannabis beverage', // Show actual product description
        price: parseFloat(product.price) || 15,
        image: product.images?.[0]?.src || "/icons/Moonwater.png",
        category: getCategory(),
        vibe: getVibe(),
        thc: getThc(),
        flavor: getFlavor(),
        spotlight: displayEffects, // Show ACF effects field here - same as edibles
        featured: index < 4,
        variations,
        isVariable
      } as MoonwaterProductWithVariations;
    }));

    return processedProducts;
    } catch (error) {
    console.error('Error fetching moonwater products from WooCommerce:', error);
    return [];
  }
}

// For backward compatibility during transition
export const MOONWATER_PRODUCTS: FeaturedProduct[] = []; 