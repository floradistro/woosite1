import { NextResponse } from 'next/server';

// Simple cache for single products
const productCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for individual products

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
    
    const url = `${storeUrl}/wp-json/wc/v3/products/${id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&acf_format=standard`;
    
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

export async function PUT(
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
    const updateData = await request.json();
    
    const url = `${storeUrl}/wp-json/wc/v3/products/${id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: errorText
      }, { status: response.status });
    }

    const updatedProduct = await response.json();
    
    // Clear cache for this product
    const cacheKey = `product_${id}`;
    productCache.delete(cacheKey);
    
    return NextResponse.json({ 
      success: true,
      status: response.status,
      product: updatedProduct
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 