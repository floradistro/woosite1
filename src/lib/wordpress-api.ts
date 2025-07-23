// WordPress/WooCommerce API helper
// Following ground rules: JWT auth, REST only, stateless

const WP_API_BASE = process.env.NEXT_PUBLIC_WP_API || 
                   process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL || 
                   'https://distropass.wpcomstaging.com';

if (!WP_API_BASE) {
  console.error('WordPress API URL not configured. Set NEXT_PUBLIC_WP_API or NEXT_PUBLIC_WOOCOMMERCE_STORE_URL');
} else {

}

// Types
export interface WPUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  roles: string[];
}

export interface JWTResponse {
  token: string;
  user_id: number;
  user_email: string;
  user_display_name: string;
}

export interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  billing: any;
  shipping: any;
  is_paying_customer: boolean;
  orders_count: number;
  total_spent: string;
  avatar_url: string;
  date_created: string;
  date_modified: string;
}

// Auth functions
export async function login(username: string, password: string): Promise<JWTResponse> {
  const response = await fetch(`${WP_API_BASE}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Authentication failed');
  }

  return response.json();
}

export async function validateToken(token: string): Promise<{ valid: boolean; data?: any }> {
  try {
    const response = await fetch(`${WP_API_BASE}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { valid: false };
    }

    const data = await response.json();
    return { valid: true, data };
  } catch (error) {
    return { valid: false };
  }
}

// Generic API fetch helper
export async function wpFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('flora-jwt') : null;
  
  try {

    const response = await fetch(`${WP_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`WordPress API Error: ${response.status} - ${error}`);
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error('WordPress API fetch failed:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to WordPress API. Please check your connection.');
    }
    throw error;
  }
}

// WooCommerce API helper (uses consumer key/secret for server-side calls)
export async function wooFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error('WooCommerce API credentials not configured');
  }

  const url = new URL(`${WP_API_BASE}${endpoint}`);
  url.searchParams.append('consumer_key', consumerKey);
  url.searchParams.append('consumer_secret', consumerSecret);

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WooCommerce API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

// User registration via WooCommerce
export async function registerCustomer(customerData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<WooCustomer> {
  return wooFetch<WooCustomer>('/wp-json/wc/v3/customers', {
    method: 'POST',
    body: JSON.stringify({
      ...customerData,
      username: customerData.email, // Use email as username
      billing: {
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        email: customerData.email,
      },
      shipping: {
        first_name: customerData.first_name,
        last_name: customerData.last_name,
      },
    }),
  });
}

// Get current user profile
export async function getCurrentUser(): Promise<WPUser> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('flora-jwt') : null;
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch('/api/wp-user', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch user data');
  }

  return response.json();
}

// Get WooCommerce customer data
export async function getCustomer(customerId: number): Promise<WooCustomer> {
  const response = await fetch(`/api/woo-customer/${customerId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch customer data');
  }

  return response.json();
}

// Update customer data
export async function updateCustomer(customerId: number, data: Partial<WooCustomer>): Promise<WooCustomer> {
  const response = await fetch(`/api/woo-customer/${customerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update customer data');
  }

  return response.json();
}

// Get customer orders
export async function getCustomerOrders(customerId: number, params: {
  page?: number;
  per_page?: number;
  status?: string;
} = {}): Promise<any[]> {
  const queryParams = new URLSearchParams({
    customer: customerId.toString(),
    page: (params.page || 1).toString(),
    per_page: (params.per_page || 10).toString(),
    ...(params.status ? { status: params.status } : {}),
  });

  return wooFetch<any[]>(`/wp-json/wc/v3/orders?${queryParams.toString()}`);
}

// Get single order
export async function getOrder(orderId: number): Promise<any> {
  return wooFetch<any>(`/wp-json/wc/v3/orders/${orderId}`);
}

// Get customer payment methods
export async function getPaymentMethods(customerId: number): Promise<any[]> {
  try {
    return await wooFetch<any[]>(`/wp-json/wc/v3/customers/${customerId}/payment-tokens`);
  } catch (error) {
    // Payment tokens might not be available, return empty array
    console.warn('Payment tokens not available:', error);
    return [];
  }
}

// Delete payment method
export async function deletePaymentMethod(customerId: number, tokenId: string): Promise<void> {
  await wooFetch(`/wp-json/wc/v3/customers/${customerId}/payment-tokens/${tokenId}?force=true`, {
    method: 'DELETE',
  });
}

// Token management
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('flora-jwt');
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('flora-jwt', token);
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('flora-jwt');
} 