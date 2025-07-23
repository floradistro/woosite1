import { NextResponse } from 'next/server';

// Cache for categories (they change less frequently)
const categoriesCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes for categories

export async function GET() {
  try {
    const storeUrl = process.env.WOOCOMMERCE_STORE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

    if (!storeUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ 
        error: 'Missing WooCommerce credentials' 
      }, { status: 500 });
    }

    const cacheKey = 'all_categories';
    
    // Check cache first
    const cached = categoriesCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800', // 15min cache, 30min stale
        }
      });
    }

    const url = `${storeUrl}/wp-json/wc/v3/products/categories?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=100`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: errorText
      }, { status: response.status });
    }

    const categories = await response.json();
    
    const result = { 
      success: true,
      status: response.status,
      categoryCount: categories.length,
      categories: categories
    };
    
    // Cache the result
    categoriesCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 