import { NextResponse } from 'next/server';

// Cache for product variations
const variationsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const storeUrl = process.env.WOOCOMMERCE_STORE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

    if (!storeUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ 
        error: 'Missing WooCommerce credentials' 
      }, { status: 500 });
    }

    const params = await context.params;
    const { id } = params;
    const cacheKey = `variations_${id}`;
    
    // Check cache first
    const cached = variationsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        }
      });
    }
    
    const url = `${storeUrl}/wp-json/wc/v3/products/${id}/variations?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=100`;
    
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

    const variations = await response.json();
    
    const result = { 
      success: true,
      status: response.status,
      variationCount: variations.length,
      variations: variations
    };
    
    // Cache the result
    variationsCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 