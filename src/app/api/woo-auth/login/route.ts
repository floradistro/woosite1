import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Use the WordPress URL from the existing test configuration
    const wpApiUrl = process.env.NEXT_PUBLIC_WP_API || 
                     process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL || 
                     'https://distropass.wpcomstaging.com';

    // Authenticate with WordPress JWT
    const response = await fetch(`${wpApiUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: email, 
        password: password 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress JWT error:', response.status, errorText);
      
      let errorMessage = 'Authentication failed';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        // Use default message if JSON parsing fails
      }
      
      return NextResponse.json({ 
        error: errorMessage 
      }, { status: 401 });
    }

    const jwtData = await response.json();

    // Get user data from WordPress
    const userResponse = await fetch(`${wpApiUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': `Bearer ${jwtData.token}`,
        'Content-Type': 'application/json',
      },
    });

    let userData = null;
    if (userResponse.ok) {
      userData = await userResponse.json();

    }

    return NextResponse.json({
      success: true,
      token: jwtData.token,
      user: {
        id: jwtData.user_id,
        user_id: jwtData.user_id,
        email: jwtData.user_email,
        user_email: jwtData.user_email,
        name: jwtData.user_display_name,
        user_display_name: jwtData.user_display_name,
        username: userData?.username || jwtData.user_email,
        user_nicename: userData?.user_nicename || jwtData.user_email,
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        avatar_urls: userData?.avatar_urls || {},
        roles: userData?.roles || ['customer'],
        ...userData
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Server error during authentication' 
    }, { status: 500 });
  }
} 