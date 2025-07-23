import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;
    
    if (!customerId || isNaN(Number(customerId))) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL || 'https://distropass.wpcomstaging.com';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || 
                       process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY || '';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || 
                          process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET || '';

    const url = new URL(`${storeUrl}/wp-json/wc/v3/customers/${customerId}`);
    url.searchParams.append('consumer_key', consumerKey);
    url.searchParams.append('consumer_secret', consumerSecret);

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WooCommerce customer API error:', response.status, errorText);
      return NextResponse.json({ 
        error: `WooCommerce API error: ${response.status}` 
      }, { status: response.status });
    }

    const customerData = await response.json();

    return NextResponse.json(customerData);

  } catch (error) {
    console.error('WooCommerce customer API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch customer data' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;
    const updateData = await request.json();
    
    if (!customerId || isNaN(Number(customerId))) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL || 'https://distropass.wpcomstaging.com';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || 
                       process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY || '';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || 
                          process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET || '';

    const url = new URL(`${storeUrl}/wp-json/wc/v3/customers/${customerId}`);
    url.searchParams.append('consumer_key', consumerKey);
    url.searchParams.append('consumer_secret', consumerSecret);

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WooCommerce customer update API error:', response.status, errorText);
      return NextResponse.json({ 
        error: `WooCommerce API error: ${response.status}` 
      }, { status: response.status });
    }

    const customerData = await response.json();

    return NextResponse.json(customerData);

  } catch (error) {
    console.error('WooCommerce customer update API error:', error);
    return NextResponse.json({ 
      error: 'Failed to update customer data' 
    }, { status: 500 });
  }
} 