import { useState } from 'react';
import { Tag, Gift, Truck, DollarSign, TrendingUp, Award, Box, Zap, Package } from 'lucide-react';
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
  // Payment methods data
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      lastFour: '4242',
      expiryMonth: '12',
      expiryYear: '26',
      holderName: 'John Doe',
      isDefault: true
    },
    {
      id: '2', 
      type: 'mastercard',
      lastFour: '5555',
      expiryMonth: '08',
      expiryYear: '25',
      holderName: 'John Doe',
      isDefault: false
    },
    {
      id: '3',
      type: 'amex',
      lastFour: '1234',
      expiryMonth: '03',
      expiryYear: '27',
      holderName: 'John Doe',
      isDefault: false
    }
  ]);

  const [newCard, setNewCard] = useState<NewCard>({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    holderName: ''
  });

  // Rewards data
  const [rewardsData] = useState<RewardsData>({
    points: 2847,
    tier: 'Gold',
    nextTier: 'Platinum',
    pointsToNextTier: 653,
    referralCode: 'FLORAFAM2024',
    totalEarned: 5234,
    totalRedeemed: 2387
  });

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

  // Subscriptions data
  const [activeSubscriptions] = useState<Subscription[]>([
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
      icon: Box
    },
    {
      id: 'SUB-002',
      name: 'Vault Vape Club',
      products: ['4 × 1g Disposable Vapes', '1 exclusive subscriber-only strain'],
      frequency: 'monthly',
      nextDelivery: '2024-01-22',
      price: 99.00,
      retailValue: 140.00,
      status: 'active',
      savings: 41.00,
      startDate: '2024-01-01',
      category: 'vapes',
      icon: Zap
    }
  ]);

  // Orders data
  const [mockOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: 'January 15, 2024',
      status: 'delivered',
      total: 89.99,
      items: ['Purple Punch 3.5g Flower', 'Blue Dream Pre-Roll (2-pack)']
    },
    {
      id: 'ORD-002', 
      date: 'January 10, 2024',
      status: 'processing',
      total: 156.50,
      items: ['OG Kush 7g Flower', 'Mixed Berry Gummies 100mg', 'Sativa Vape Cart 1g']
    },
    {
      id: 'ORD-003',
      date: 'January 5, 2024',
      status: 'shipped',
      total: 45.00,
      items: ['Gelato Disposable Vape 1g']
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

  // Actions
  const handleAddCard = () => {
    console.log('Add card functionality to be implemented');
  };

  const handleDeleteCard = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleRewardRedeem = (rewardId: string, pointsCost: number) => {
    if (rewardsData.points >= pointsCost) {
      console.log(`Redeeming reward ${rewardId} for ${pointsCost} points`);
      // Implementation would update points and add to history
    }
  };

  const handleSubscriptionAction = (action: string, subscriptionId: string) => {
    console.log(`${action} subscription ${subscriptionId}`);
    // Implementation would handle subscription modifications
  };

  const handleToggleChange = (key: keyof ToggleStates) => {
    setToggleStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return {
    // Data
    paymentMethods,
    newCard,
    rewardsData,
    availableRewards,
    rewardsHistory,
    activeSubscriptions,
    mockOrders,
    toggleStates,
    selectedOrder,
    
    // Actions
    handleAddCard,
    handleDeleteCard,
    handleSetDefault,
    handleRewardRedeem,
    handleSubscriptionAction,
    handleToggleChange,
    setSelectedOrder,
    
    // Setters (if needed for more complex operations)
    setPaymentMethods,
    setNewCard,
    setToggleStates
  };
} 