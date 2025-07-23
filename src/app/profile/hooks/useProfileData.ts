import { useState, useEffect } from 'react';
import { Tag, Gift, Truck, DollarSign, TrendingUp, Award, Box, Zap, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile, useOrders, usePaymentMethods, useRewards, useSubscriptions } from '../../../hooks/useWordPressData';
import { 
  PaymentMethod, 
  NewCard, 
  RewardsData, 
  AvailableReward, 
  RewardsHistoryItem, 
  Subscription, 
  Order, 
  ToggleStates 
} from '../types';

export function useProfileData() {
  const { user, token } = useAuth();
  
  // Use real WordPress data hooks
  const { customer, loading: profileLoading, updateProfile: updateWPProfile } = useUserProfile(user?.id);
  const { orders, loading: ordersLoading } = useOrders(user?.id);
  const { paymentMethods, loading: paymentMethodsLoading, deleteMethod } = usePaymentMethods(user?.id);
  const rewardsData = useRewards();
  const { subscriptions: activeSubscriptions } = useSubscriptions(
    user?.id && user.id !== 'unknown' ? parseInt(user.id, 10) : undefined
  );

  const [newCard, setNewCard] = useState<NewCard>({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    holderName: ''
  });

  // Mock rewards data (until points system is implemented)
  const [availableRewards] = useState<AvailableReward[]>([
    {
      id: '1',
      title: '10% Off Next Order',
      description: 'Save on your next purchase',
      points: 500,
      type: 'discount',
      icon: Tag
    },
    {
      id: '2', 
      title: 'Free Pre-Roll',
      description: 'Choose any house pre-roll',
      points: 750,
      type: 'product',
      icon: Gift
    },
    {
      id: '3',
      title: 'Free Delivery',
      description: 'No delivery fee on your next order',
      points: 300,
      type: 'service',
      icon: Truck
    },
    {
      id: '4',
      title: '$25 Store Credit',
      description: 'Redeem for store credit',
      points: 2500,
      type: 'credit',
      icon: DollarSign
    }
  ]);

  const [rewardsHistory] = useState<RewardsHistoryItem[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'earned',
      amount: 157,
      description: 'Purchase order #ORD-001',
      icon: TrendingUp
    },
    {
      id: '2',
      date: '2024-01-10', 
      type: 'redeemed',
      amount: -500,
      description: 'Redeemed 10% off coupon',
      icon: Gift
    },
    {
      id: '3',
      date: '2024-01-05',
      type: 'earned',
      amount: 89,
      description: 'Purchase order #ORD-003',
      icon: TrendingUp
    },
    {
      id: '4',
      date: '2024-01-01',
      type: 'bonus',
      amount: 250,
      description: 'New Year bonus points',
      icon: Award
    }
  ]);

  // Toggle states
  const [toggleStates, setToggleStates] = useState<ToggleStates>({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    smsNotifications: true,
    emailUpdates: true,
    leaveAtDoor: false
  });

  // UI states
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Transform real data to match UI expectations
  const transformedPaymentMethods: PaymentMethod[] = paymentMethods.map(method => ({
    id: method.id,
    type: method.type as 'visa' | 'mastercard' | 'amex' | 'card',
    lastFour: method.lastFour,
    expiryMonth: method.expiryMonth,
    expiryYear: method.expiryYear,
    holderName: method.holderName || (user ? `${user.firstName} ${user.lastName}`.trim() : ''),
    isDefault: method.isDefault
  }));

  const transformedRewardsData: RewardsData = {
    points: rewardsData.points,
    tier: rewardsData.tier,
    nextTier: rewardsData.nextTier,
    pointsToNextTier: rewardsData.pointsToNextTier,
    referralCode: 'FLORAFAM2024',
    totalEarned: rewardsData.totalEarned,
    totalRedeemed: rewardsData.totalRedeemed
  };

  // Actions
  const handleAddCard = () => {
    // Add card functionality to be implemented with payment gateway

  };

  const handleDeleteCard = async (id: string) => {
    const success = await deleteMethod(id);
    if (!success) {
      console.error('Failed to delete payment method');
    }
  };

  const handleSetDefault = (id: string) => {
    // TODO: Implement set default payment method

  };

  const handleRewardRedeem = (rewardId: string, pointsCost: number) => {
    if (transformedRewardsData.points >= pointsCost) {
      // TODO: Implement reward redemption

    }
  };

  const handleSubscriptionAction = (action: string, subscriptionId: string) => {
    // TODO: Implement subscription actions

  };

  const handleToggleChange = (key: keyof ToggleStates) => {
    setToggleStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateProfile = async (updateData: any) => {
    if (!user?.id) return false;
    
    try {
      const success = await updateWPProfile(updateData);
      return success;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  return {
    // Data - now using real WordPress/WooCommerce data
    paymentMethods: transformedPaymentMethods,
    newCard,
    rewardsData: transformedRewardsData,
    availableRewards,
    rewardsHistory,
    activeSubscriptions,
    orders, // Real orders from WooCommerce
    toggleStates,
    selectedOrder,
    
    // Loading states - real loading from WordPress APIs
    paymentMethodsLoading,
    ordersLoading,
    profileLoading,
    
    // Actions
    handleAddCard,
    handleDeleteCard,
    handleSetDefault,
    handleRewardRedeem,
    handleSubscriptionAction,
    handleToggleChange,
    setSelectedOrder,
    updateProfile, // Real profile updates to WooCommerce
    
    // Additional data
    customer, // Real WooCommerce customer data
    
    // Refresh functions
    loadPaymentMethods: () => {
      // Will be handled by the hooks automatically
    },
    loadOrders: () => {
      // Will be handled by the hooks automatically
    },
    
    // Setters (if needed for more complex operations)
    setNewCard,
    setToggleStates
  };
} 