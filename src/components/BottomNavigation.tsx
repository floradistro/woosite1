'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

export default function BottomNavigation() {
  const pathname = usePathname();
  const { items } = useCart();
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-[90] md:hidden rounded-2xl overflow-hidden shadow-2xl" style={{
      marginBottom: 'env(safe-area-inset-bottom)'
    }}>
      <div 
        className="h-[70px] border border-white/[0.1]"
        style={{
          background: 'rgba(74, 74, 74, 0.9)',
          backdropFilter: 'blur(30px) saturate(200%)',
          WebkitBackdropFilter: 'blur(30px) saturate(200%)',
        }}
      >
        <div className="h-full flex items-center justify-around px-6">
          {/* Home */}
          <Link 
            href="/" 
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all ${
              isActive('/') ? 'text-white bg-white/10' : 'text-white/60 hover:text-white/80'
            }`}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={isActive('/') ? "2.5" : "2"}
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-[9px] font-semibold">Home</span>
          </Link>
          
          {/* Cart */}
          <Link 
            href="/cart" 
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all relative ${
              isActive('/cart') ? 'text-white bg-white/10' : 'text-white/60 hover:text-white/80'
            }`}
          >
            <div className="relative">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={isActive('/cart') ? "2.5" : "2"}
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M6 9h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"></path>
                <path d="M9 9V7a3 3 0 0 1 6 0v2"></path>
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[8px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-semibold">Cart</span>
          </Link>
          
          {/* Shop */}
          <Link 
            href="/flower" 
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all ${
              pathname?.startsWith('/flower') || pathname?.startsWith('/vape') || pathname?.startsWith('/edible') 
                ? 'text-white bg-white/10' : 'text-white/60 hover:text-white/80'
            }`}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={pathname?.startsWith('/flower') || pathname?.startsWith('/vape') || pathname?.startsWith('/edible') ? "2.5" : "2"}
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span className="text-[9px] font-semibold">Shop</span>
          </Link>
          
          {/* Profile */}
          <Link 
            href="/profile" 
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all ${
              isActive('/profile') || pathname?.startsWith('/profile') ? 'text-white bg-white/10' : 'text-white/60 hover:text-white/80'
            }`}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={isActive('/profile') || pathname?.startsWith('/profile') ? "2.5" : "2"}
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-[9px] font-semibold">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 