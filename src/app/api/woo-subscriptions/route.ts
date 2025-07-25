import { NextResponse } from 'next/server';

// In-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const activeRequests = new Map<string, Promise<any>>();

function getCacheKey(url: string): string {
  return url;
}

function isValidCache(key: string): boolean {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
}

export async function GET(request: Request) {
  try {
    const storeUrl = process.env.WOOCOMMERCE_STORE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

    if (!storeUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ 
        error: 'Missing WooCommerce credentials',
        env: {
          storeUrl: !!storeUrl,
          consumerKey: !!consumerKey,
          consumerSecret: !!consumerSecret
        }
      }, { status: 500 });
    }

    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    
    // Build query parameters for subscription products
    const params = new URLSearchParams();
    params.append('consumer_key', consumerKey);
    params.append('consumer_secret', consumerSecret);
    params.append('per_page', '100');
    params.append('status', 'publish');
    params.append('acf_format', 'standard');
    
    // Try multiple approaches to find subscription products:
    // 1. Search for subscription-related terms
    // 2. Look for specific categories/tags if provided
    // 3. Fallback to all products and filter client-side
    
    const searchTerm = searchParams.get('search') || 'subscription';
    if (searchTerm !== 'all') {
      params.append('search', searchTerm);
    }
    
    // Allow filtering by category if specified
    if (searchParams.get('category')) {
      params.append('category', searchParams.get('category')!);
    }
    
    // Allow filtering by tag if specified  
    if (searchParams.get('tag')) {
      params.append('tag', searchParams.get('tag')!);
    }
    
    const url = `${storeUrl}/wp-json/wc/v3/products?${params.toString()}`;
    const cacheKey = getCacheKey(url);
    
    // Check cache first
    if (isValidCache(cacheKey)) {
      const cached = cache.get(cacheKey);
      return NextResponse.json(cached!.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        }
      });
    }
    
    // Check if request is already in progress (deduplication)
    if (activeRequests.has(cacheKey)) {
      const result = await activeRequests.get(cacheKey);
      return NextResponse.json(result, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        }
      });
    }
    
    // Create the request promise
    const requestPromise = fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    }).then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      return response.json();
    });
    
    // Store the active request
    activeRequests.set(cacheKey, requestPromise);
    
    try {
      const products = await requestPromise;
      
      // Process products to add subscription-specific data
      const subscriptionProducts = products
        .filter((product: any) => {
          // Filter for subscription products based on various criteria
          const name = product.name.toLowerCase();
          const description = (product.description || '').toLowerCase();
          const shortDescription = (product.short_description || '').toLowerCase();
          const categories = product.categories || [];
          const tags = product.tags || [];
          
          // Check if it's a subscription product
          const isSubscription = 
            name.includes('subscription') ||
            name.includes('club') ||
            name.includes('monthly') ||
            name.includes('drop') ||
            name.includes('vault') ||
            name.includes('bundle') ||
            description.includes('subscription') ||
            description.includes('monthly') ||
            shortDescription.includes('subscription') ||
            shortDescription.includes('monthly') ||
            categories.some((cat: any) => cat.name.toLowerCase().includes('subscription')) ||
            tags.some((tag: any) => tag.name.toLowerCase().includes('subscription'));
          
          return isSubscription;
        })
        .map((product: any) => {
          // Calculate savings based on regular vs sale price or use ACF field
          const regularPrice = parseFloat(product.regular_price) || 0;
          const salePrice = parseFloat(product.sale_price) || parseFloat(product.price) || 0;
          let savings = regularPrice > salePrice ? regularPrice - salePrice : 0;
          
          // Try to get savings from ACF fields if available
          if (product.acf && product.acf.subscription_savings) {
            savings = parseFloat(product.acf.subscription_savings) || savings;
          }
          
          // Default savings for subscription products if none calculated
          if (savings === 0) {
            savings = Math.round(salePrice * 0.15); // Default 15% savings
          }
          
          return {
            ...product,
            savings: savings,
            price: salePrice || regularPrice
          };
        });
      
      console.log('🔍 Subscription products found:', {
        total: subscriptionProducts.length,
        products: subscriptionProducts.map((p: any) => ({ id: p.id, name: p.name, price: p.price, savings: p.savings }))
      });
      
      const result = { 
        success: true,
        status: 200,
        productCount: subscriptionProducts.length,
        products: subscriptionProducts,
        cached: false
      };
      
      // Cache the result
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return NextResponse.json(result, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        }
      });
      
    } catch (error) {
      console.error('WooCommerce subscription API error:', error);
      return NextResponse.json({ 
        error: 'WooCommerce API error',
        details: error instanceof Error ? error.message : 'Unknown error',
        url: url.replace(consumerSecret, 'HIDDEN')
      }, { status: 500 });
    } finally {
      // Clean up active request
      activeRequests.delete(cacheKey);
    }

  } catch (error) {
    console.error('Server error in subscriptions API:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 