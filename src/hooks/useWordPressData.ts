import { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getCustomer, 
  getCustomerOrders, 
  getPaymentMethods,
  updateCustomer,
  deletePaymentMethod,
  WPUser,
  WooCustomer
} from '../lib/wordpress-api';

// Hook for user profile data
export function useUserProfile(userId?: string) {
  const [user, setUser] = useState<WPUser | null>(null);
  const [customer, setCustomer] = useState<WooCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get WordPress user data
        const wpUser = await getCurrentUser();
        setUser(wpUser);

        // Get WooCommerce customer data
        const numericUserId = parseInt(userId, 10);
        if (isNaN(numericUserId)) {
          throw new Error('Invalid user ID');
        }
        const wooCustomer = await getCustomer(numericUserId);
        setCustomer(wooCustomer);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user data';
        setError(errorMessage);
        console.error('Error loading user data:', err);
        
        // If it's a connection error, provide more specific guidance
        if (errorMessage.includes('Unable to connect')) {
          setError('Unable to connect to the server. Please check your internet connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const updateProfile = async (data: Partial<WooCustomer>) => {
    if (!userId) return false;

    try {
      const numericUserId = parseInt(userId, 10);
      if (isNaN(numericUserId)) {
        throw new Error('Invalid user ID');
      }
      const updatedCustomer = await updateCustomer(numericUserId, data);
      setCustomer(updatedCustomer);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    }
  };

  return {
    user,
    customer,
    loading,
    error,
    updateProfile,
    refetch: () => {
      if (userId) {
        // Trigger re-fetch by updating the effect dependency
        setLoading(true);
      }
    }
  };
}

// Hook for customer orders
export function useOrders(customerId?: string) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const numericCustomerId = parseInt(customerId, 10);
        if (isNaN(numericCustomerId) || customerId === 'unknown') {
          console.warn('Invalid or unknown customer ID, skipping order load:', customerId);
          setOrders([]);
          setLoading(false);
          return;
        }
        
        const orderData = await getCustomerOrders(numericCustomerId, {
          per_page: 20,
        });

        // Transform orders to match our UI expectations
        const transformedOrders = orderData.map((order: any) => ({
          id: order.number || order.id.toString(),
          date: new Date(order.date_created).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          status: order.status,
          total: parseFloat(order.total),
          items: order.line_items.map((item: any) => `${item.name} (${item.quantity}x)`),
          billing: order.billing,
          shipping: order.shipping,
          payment_method: order.payment_method_title,
          line_items: order.line_items,
          raw: order // Keep raw data for detailed views
        }));

        setOrders(transformedOrders);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [customerId]);

  return {
    orders,
    loading,
    error,
    refetch: () => {
      if (customerId) {
        setLoading(true);
      }
    }
  };
}

// Hook for payment methods
export function usePaymentMethods(customerId?: string) {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    const loadPaymentMethods = async () => {
      try {
        setLoading(true);
        setError(null);

        const numericCustomerId = parseInt(customerId, 10);
        if (isNaN(numericCustomerId) || customerId === 'unknown') {
          console.warn('Invalid or unknown customer ID, skipping payment methods load:', customerId);
          setPaymentMethods([]);
          setLoading(false);
          return;
        }

        const methods = await getPaymentMethods(numericCustomerId);

        // Transform payment methods to match our UI expectations
        const transformedMethods = methods.map((method: any) => ({
          id: method.id.toString(),
          type: method.card_type?.toLowerCase() || 'card',
          lastFour: method.last4 || '****',
          expiryMonth: method.expiry_month || '',
          expiryYear: method.expiry_year || '',
          holderName: method.card_holder_name || '',
          isDefault: method.is_default || false,
          raw: method // Keep raw data
        }));

        setPaymentMethods(transformedMethods);

      } catch (err) {
        // Payment methods might not be available, don't treat as error
        console.warn('Payment methods not available:', err);
        setPaymentMethods([]);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, [customerId]);

  const deleteMethod = async (tokenId: string) => {
    if (!customerId) return false;

    const numericCustomerId = parseInt(customerId, 10);
    if (isNaN(numericCustomerId) || customerId === 'unknown') {
      console.warn('Invalid or unknown customer ID, cannot delete payment method:', customerId);
      return false;
    }

    try {
      await deletePaymentMethod(numericCustomerId, tokenId);
      setPaymentMethods(prev => prev.filter(method => method.id !== tokenId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete payment method');
      return false;
    }
  };

  return {
    paymentMethods,
    loading,
    error,
    deleteMethod,
    refetch: () => {
      if (customerId) {
        setLoading(true);
      }
    }
  };
}

// Hook for rewards/points (placeholder - requires custom endpoint)
export function useRewards() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implement when points system is set up
    // For now, return mock data
    setTimeout(() => {
      setPoints(2847);
      setLoading(false);
    }, 1000);
  }, []);

  return {
    points,
    loading,
    error,
    tier: 'Gold',
    nextTier: 'Platinum',
    pointsToNextTier: 653,
    totalEarned: 5234,
    totalRedeemed: 2387
  };
}

// Hook for subscriptions (requires WooCommerce Subscriptions plugin)
export function useSubscriptions(customerId?: number) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    // TODO: Implement when WooCommerce Subscriptions is set up
    // For now, return mock data
    setTimeout(() => {
      setSubscriptions([
        {
          id: 'SUB-001',
          name: 'Real Flower Club',
          products: ['4 × 7g Flower Jars (28g total)', '4 premium exotic strains'],
          frequency: 'monthly',
          nextDelivery: '2024-02-15',
          price: 180.00,
          retailValue: 200.00,
          status: 'active',
          savings: 20.00,
          startDate: '2023-11-15',
          category: 'flower',
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [customerId]);

  return {
    subscriptions,
    loading,
    error,
    refetch: () => {
      if (customerId) {
        setLoading(true);
      }
    }
  };
} 