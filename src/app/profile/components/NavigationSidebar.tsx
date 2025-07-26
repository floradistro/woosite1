import { ChevronLeft, User, Package, CreditCard, Gift, Repeat } from 'lucide-react';
import { User as UserType, TabType } from '../types';
import UserInfoHeader from './UserInfoHeader';

interface NavigationSidebarProps {
  user: UserType | null;
  activeTab: TabType;
  isMobile: boolean;
  onTabClick: (tabId: string) => void;
  onBackClick: () => void;
}

const navigationItems = [
  { id: 'profile', label: 'General', icon: User, description: 'Manage your profile info' },
  { id: 'orders', label: 'Orders', icon: Package, description: 'View your order history' },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard, description: 'Manage payment cards' },
  { id: 'rewards', label: 'Rewards', icon: Gift, description: 'Points and rewards' },
  { id: 'subscriptions', label: 'Subscriptions', icon: Repeat, description: 'Manage subscriptions' },

];

export default function NavigationSidebar({ 
  user, 
  activeTab, 
  isMobile, 
  onTabClick, 
  onBackClick 
}: NavigationSidebarProps) {
  return (
    <div
      className={`
        ${isMobile && activeTab ? 'hidden' : 'block'}
        ${isMobile ? 'w-full' : 'w-80 flex-shrink-0'}
        bg-[#4a4a4a] backdrop-blur-xl 
        ${!isMobile ? 'border-r border-white/10' : ''}
        flex flex-col min-h-screen
      `}
    >
      {/* Desktop Search Bar - Hidden on mobile */}
      {!isMobile && (
        <div className="p-3 border-b border-white/10 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-8 py-1.5 text-sm bg-[#3a3a3a]/50 rounded-md text-white/90 placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
            <svg className="absolute left-2.5 top-2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* User Info */}
      <UserInfoHeader user={user} isMobile={isMobile} />

      {/* Mobile Back Button */}
      {isMobile && activeTab && (
        <div className="p-3 border-b border-white/10 flex-shrink-0">
          <button
            onClick={onBackClick}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to menu</span>
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-0">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabClick(item.id)}
                className={`
                  w-full text-left p-4 transition-all duration-200 group border-b border-white/5
                  ${isActive 
                    ? 'bg-gradient-to-r from-white/15 to-white/10 border-l-2 border-l-white/40' 
                    : 'hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                  <div className="flex-1">
                    <div className={`${isMobile ? 'text-base' : 'text-sm'} font-medium ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                      {item.label}
                    </div>
                    <div className={`${isMobile ? 'text-sm' : 'text-xs'} ${isActive ? 'text-white/70' : 'text-white/50 group-hover:text-white/70'} mt-0.5`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 