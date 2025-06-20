'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function BottomNavBar() {
  const pathname = usePathname();
  const { items } = useCart();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const itemCount = items.reduce((total: number, item: any) => total + item.quantity, 0);

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Shop',
      href: '/flower',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      name: 'Subscribe',
      href: '/subscriptions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: (
        <div className="relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
      )
    },
    {
      name: 'Profile',
      href: user ? '/profile' : '/auth/signin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  if (!mounted) return null;

  const navContent = (
    <nav 
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        width: '100%',
        height: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid #e5e7eb',
        zIndex: 999999,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)'
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '56px',
          padding: '0 8px'
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1',
              height: '100%',
              textDecoration: 'none',
              borderRadius: '8px',
              margin: '0 4px',
              transition: 'all 0.2s ease',
              backgroundColor: isActive(item.href) ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
              color: isActive(item.href) ? '#000000' : '#6b7280'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {item.icon}
              <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: '500' }}>
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );

  // Use portal to render outside component tree
  return createPortal(navContent, document.body);
}
