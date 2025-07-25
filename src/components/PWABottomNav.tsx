'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '../app/context/CartContext';
import { useAuth } from '../app/context/AuthContext';
import { ReactNode } from 'react';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
  badge?: number;
}

export default function PWABottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCart();
  const { user } = useAuth();

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      )
    },
    {
      id: 'menu',
      label: 'Shop',
      path: '/flower',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="9" x2="9" y2="15"/>
          <line x1="15" y1="9" x2="15" y2="15"/>
        </svg>
      )
    },
    {
      id: 'cart',
      label: 'Cart',
      path: '/cart',
      badge: cartItemsCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      path: user ? '/profile' : '/auth/signin',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    // Add haptic feedback for iOS
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    router.push(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Bottom safe area padding for iPhone */}
      <div className="pwa-glass-blur border-t border-white/10 pwa-bottom-nav pwa-safe-area-bottom">
        <div className="flex items-center justify-around px-2 pt-1">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className="relative flex flex-col items-center justify-center p-2 min-w-[60px] group"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              {/* Active indicator */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 w-8 h-0.5 bg-emerald-400 rounded-full"
                  style={{ x: '-50%' }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              
              {/* Icon container with badge */}
              <div className="relative">
                <div className={`transition-colors duration-200 ${
                  isActive(item.path) 
                    ? 'text-emerald-400' 
                    : 'text-gray-400 group-active:text-emerald-300'
                }`}>
                  {item.icon}
                </div>
                
                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-medium rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
                    style={{ fontSize: '10px' }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.div>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs mt-0.5 font-medium transition-colors duration-200 ${
                isActive(item.path) 
                  ? 'text-emerald-400' 
                  : 'text-gray-500 group-active:text-emerald-300'
              }`}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
} 