import { NextResponse } from 'next/server';

export async function GET() {
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

    // Test direct fetch
    const url = `${storeUrl}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=3`;
    
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
        details: errorText,
        url: url.replace(consumerSecret, 'HIDDEN')
      }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true,
      status: response.status,
      productCount: data.length,
      products: data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        status: p.status
      }))
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 