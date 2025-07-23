import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authorization.replace('Bearer ', '');
    const wpApiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL || 'https://distropass.wpcomstaging.com';

    const response = await fetch(`${wpApiUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress user API error:', response.status, errorText);
      return NextResponse.json({ 
        error: `WordPress API error: ${response.status}` 
      }, { status: response.status });
    }

    const userData = await response.json();

    return NextResponse.json(userData);

  } catch (error) {
    console.error('WordPress user API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user data' 
    }, { status: 500 });
  }
} 