'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MoreHorizontal } from 'lucide-react';
import { useCart } from '../app/context/CartContext';

interface PWAHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
}

export default function PWAHeader({ 
  title, 
  showBack = false, 
  showSearch = false, 
  showMenu = true 
}: PWAHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCart();

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const getPageTitle = () => {
    if (title) return title;
    
    switch (pathname) {
      case '/':
        return 'Flora Distro';
      case '/flower':
        return 'Flower';
      case '/vape':
        return 'Vapes';
      case '/edible':
        return 'Edibles';
      case '/concentrate':
        return 'Concentrates';
      case '/cart':
        return 'Cart';
      case '/profile':
        return 'Profile';
      default:
        return 'Flora Distro';
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 md:hidden pwa-header pwa-safe-area-top"
    >
      <div className="relative pwa-glass-blur">
        {/* iPhone 15 Pro Dynamic Island area consideration */}
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left side */}
          <div className="flex items-center min-w-[60px]">
            {showBack ? (
              <motion.button
                onClick={handleBack}
                className="p-2 -ml-2 text-white/80 hover:text-white"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
            ) : (
              <div className="w-8" />
            )}
          </div>

          {/* Center - Title */}
          <div className="flex-1 flex justify-center">
            <motion.h1 
              className="text-lg font-semibold text-white truncate px-4"
              key={pathname} // This will trigger animation on route change
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {getPageTitle()}
            </motion.h1>
          </div>

          {/* Right side */}
          <div className="flex items-center justify-end min-w-[60px]">
            {showSearch && (
              <motion.button
                className="p-2 text-white/80 hover:text-white mr-1"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <Search size={20} />
              </motion.button>
            )}
            
            {showMenu && (
              <motion.button
                className="p-2 -mr-2 text-white/80 hover:text-white"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <MoreHorizontal size={20} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Subtle gradient overlay for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
} 