import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Use the WordPress URL from the existing test configuration
    const wpApiUrl = process.env.NEXT_PUBLIC_WP_API || 
                     process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL || 
                     'https://distropass.wpcomstaging.com';

    // Validate token with WordPress
    const response = await fetch(`${wpApiUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token validation error:', response.status, errorText);
      
      return NextResponse.json({ 
        valid: false,
        error: 'Token validation failed' 
      }, { status: 401 });
    }

    const validationData = await response.json();

    // Get user data from WordPress using the validated token
    let userData = null;
    try {
      const userResponse = await fetch(`${wpApiUrl}/wp-json/wp/v2/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (userResponse.ok) {
        userData = await userResponse.json();

      }
    } catch (error) {
      console.warn('Could not fetch user data during validation:', error);
    }

    return NextResponse.json({
      valid: true,
      data: {
        ...validationData,
        user_id: userData?.id || validationData.data?.user_id,
        user_email: userData?.email || validationData.data?.user_email,
        user_display_name: userData?.name || userData?.display_name || validationData.data?.user_display_name,
        ...userData
      }
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ 
      valid: false,
      error: 'Server error during token validation' 
    }, { status: 500 });
  }
} 