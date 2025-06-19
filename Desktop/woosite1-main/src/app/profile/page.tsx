"use client"

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

// Import types
import { TabType } from './types';

// Import components
import NavigationSidebar from './components/NavigationSidebar';
import ProfileTabContent from './components/ProfileTabContent';
import OrdersTabContent from './components/OrdersTabContent';
import PaymentMethodsTabContent from './components/PaymentMethodsTabContent';
import RewardsTabContent from './components/RewardsTabContent';
import SubscriptionsTabContent from './components/SubscriptionsTabContent';
import SettingsTabContent from './components/SettingsTabContent';
import { ProfileLoadingState, AuthRequiredState, SuspenseLoadingState } from './components/LoadingStates';

// Import hooks
import { useProfileData } from './hooks/useProfileData';

function ProfilePageContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Profile data from custom hook
  const profileData = useProfileData();
  
  // Tab and UI state
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tabParam = searchParams.get('tab');
    return (tabParam as TabType) || null;
  });
  
  const [isMobile, setIsMobile] = useState(false);

  // Navigation handlers
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as TabType);
    router.push(`/profile?tab=${tabId}`, { scroll: false });
  };

  const handleBackClick = () => {
    setActiveTab(null);
    router.push('/profile', { scroll: false });
  };

  // Effects for tab management and mobile detection
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam as TabType);
    } else {
      const checkMobile = window.innerWidth < 768;
      if (!checkMobile) {
        setActiveTab('profile');
      } else {
        setActiveTab(null);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileSize = window.innerWidth < 768;
      setIsMobile(isMobileSize);
      
      if (!isMobileSize && activeTab === null) {
        setActiveTab('profile');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [activeTab]);

  // Authentication redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirect=/profile');
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading states
  if (isLoading) {
    return <ProfileLoadingState />;
  }

  if (!isAuthenticated) {
    return <AuthRequiredState />;
  }

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTabContent user={user} isMobile={isMobile} />;
      
      case 'orders':
        return (
          <OrdersTabContent 
            isMobile={isMobile}
            orders={profileData.mockOrders}
            selectedOrder={profileData.selectedOrder}
            onOrderSelect={profileData.setSelectedOrder}
          />
        );
      
      case 'payment':
        return (
          <PaymentMethodsTabContent 
            isMobile={isMobile}
            paymentMethods={profileData.paymentMethods}
            onAddCard={profileData.handleAddCard}
            onDeleteCard={profileData.handleDeleteCard}
            onSetDefault={profileData.handleSetDefault}
          />
        );
      
      case 'rewards':
        return (
          <RewardsTabContent 
            isMobile={isMobile}
            rewardsData={profileData.rewardsData}
            availableRewards={profileData.availableRewards}
            rewardsHistory={profileData.rewardsHistory}
            onRewardRedeem={profileData.handleRewardRedeem}
          />
        );
      
      case 'subscriptions':
        return (
          <SubscriptionsTabContent 
            isMobile={isMobile}
            activeSubscriptions={profileData.activeSubscriptions}
            onSubscriptionAction={profileData.handleSubscriptionAction}
          />
        );
      
      case 'settings':
        return (
          <SettingsTabContent 
            isMobile={isMobile}
            toggleStates={profileData.toggleStates}
            onToggleChange={profileData.handleToggleChange}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#4a4a4a]">
      <div className={`${isMobile ? 'px-0' : ''}`}>
        <div className="flex gap-0 min-h-screen">
          
          {/* Navigation Sidebar */}
          <NavigationSidebar 
            user={user}
            activeTab={activeTab}
            isMobile={isMobile}
            onTabClick={handleTabClick}
            onBackClick={handleBackClick}
          />

          {/* Main Content Area */}
          <AnimatePresence mode="wait">
            {(!isMobile || activeTab) && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: isMobile ? 20 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isMobile ? -20 : 0 }}
                transition={{ duration: 0.2 }}
                className={`
                  flex-1 
                  ${!isMobile ? 'bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl' : ''}
                  overflow-y-auto
                `}
              >
                <div className={`${isMobile ? 'p-0' : 'py-12'}`}>
                  {renderTabContent()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<SuspenseLoadingState />}>
      <ProfilePageContent />
    </Suspense>
  );
} 