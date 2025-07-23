import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ 
        error: 'Email, password, first name, and last name are required' 
      }, { status: 400 });
    }

    // Use the WooCommerce configuration from existing test files
    const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL || 'https://distropass.wpcomstaging.com';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || 
                       process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY || '';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || 
                          process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET || '';

    // Create customer via WooCommerce API
    const customerData = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      username: email, // Use email as username
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: email,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
      },
    };

    const url = new URL(`${storeUrl}/wp-json/wc/v3/customers`);
    url.searchParams.append('consumer_key', consumerKey);
    url.searchParams.append('consumer_secret', consumerSecret);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WooCommerce registration error:', response.status, errorText);
      
      let errorMessage = 'Registration failed';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        // Use default message if JSON parsing fails
      }
      
      return NextResponse.json({ 
        error: errorMessage 
      }, { status: response.status });
    }

    const customer = await response.json();

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Server error during registration' 
    }, { status: 500 });
  }
} 