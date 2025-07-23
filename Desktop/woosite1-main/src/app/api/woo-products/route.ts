import { NextResponse } from 'next/server';

// In-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // Increased to 5 minutes for better performance
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
    const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    const consumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

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
    const params = new URLSearchParams();
    
    // Add query parameters
    if (searchParams.get('per_page')) params.append('per_page', searchParams.get('per_page')!);
    if (searchParams.get('page')) params.append('page', searchParams.get('page')!);
    if (searchParams.get('search')) params.append('search', searchParams.get('search')!);
    if (searchParams.get('category')) params.append('category', searchParams.get('category')!);
    if (searchParams.get('tag')) params.append('tag', searchParams.get('tag')!);
    if (searchParams.get('status')) params.append('status', searchParams.get('status')!);
    if (searchParams.get('featured')) params.append('featured', searchParams.get('featured')!);
    
    // Set defaults
    if (!params.get('per_page')) params.append('per_page', '100');
    if (!params.get('status')) params.append('status', 'publish');
    
    // Add authentication
    params.append('consumer_key', consumerKey);
    params.append('consumer_secret', consumerSecret);
    
    const url = `${storeUrl}/wp-json/wc/v3/products?${params.toString()}`;
    const cacheKey = getCacheKey(url);
    
    // Check cache first
    if (isValidCache(cacheKey)) {
      const cached = cache.get(cacheKey);
      return NextResponse.json(cached!.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5min cache, 10min stale
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
      
      const result = { 
        success: true,
        status: 200,
        productCount: products.length,
        products: products,
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
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 