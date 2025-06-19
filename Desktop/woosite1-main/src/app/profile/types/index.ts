import { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface EditableProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'card';
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
}

export interface NewCard {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  holderName: string;
}

export interface RewardsData {
  points: number;
  tier: string;
  nextTier: string;
  pointsToNextTier: number;
  referralCode: string;
  totalEarned: number;
  totalRedeemed: number;
}

export interface AvailableReward {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'discount' | 'product' | 'service' | 'credit';
  icon: LucideIcon;
}

export interface RewardsHistoryItem {
  id: string;
  date: string;
  type: 'earned' | 'redeemed' | 'bonus';
  amount: number;
  description: string;
  icon: LucideIcon;
}

export interface Subscription {
  id: string;
  name: string;
  products: string[];
  frequency: string;
  nextDelivery: string;
  price: number;
  retailValue: number;
  status: 'active' | 'paused' | 'cancelled';
  savings: number;
  startDate: string;
  category: string;
  icon: LucideIcon;
}

export interface AvailableSubscription {
  id: string;
  name: string;
  description: string;
  products: string[];
  frequency: string[];
  basePrice: number;
  subscriptionPrice: number;
  savings: number;
  category: string;
  addon: string;
  perk: string;
  highlight?: boolean;
  icon: LucideIcon;
}

export interface SubscriptionHistoryItem {
  id: string;
  date: string;
  subscription: string;
  action: string;
  amount: number;
  icon: LucideIcon;
}

export interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: string[];
}

export interface ToggleStates {
  orderUpdates: boolean;
  promotions: boolean;
  newProducts: boolean;
  smsNotifications: boolean;
  emailUpdates: boolean;
  leaveAtDoor: boolean;
}

export type TabType = 'profile' | 'orders' | 'payment' | 'rewards' | 'subscriptions' | 'settings' | null; 