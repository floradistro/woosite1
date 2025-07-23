import { NextResponse } from 'next/server';

// Simple cache for single products
const productCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for individual products

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
    const consumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

    if (!storeUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ 
        error: 'Missing WooCommerce credentials' 
      }, { status: 500 });
    }

    const { id } = params;
    const cacheKey = `product_${id}`;
    
    // Check cache first
    const cached = productCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200', // 10min cache, 20min stale
        }
      });
    }
    
    const url = `${storeUrl}/wp-json/wc/v3/products/${id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
    
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

    const product = await response.json();
    
    const result = { 
      success: true,
      status: response.status,
      product: product
    };
    
    // Cache the result
    productCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
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