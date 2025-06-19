"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useFooterVisibility } from '@/hooks/useFooterVisibility';
import { usePWA } from '../hooks/usePWA';

export default function MobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  
  const { shouldHidePopups } = useFooterVisibility();
  const { isPWA } = usePWA();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200 && !hasScrolled) {
        setHasScrolled(true);
        setTimeout(() => setIsVisible(true), 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  // Add countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(14, 0, 0, 0);
      
      if (now > deadline) {
        deadline.setDate(deadline.getDate() + 1);
      }
      
      const diff = deadline.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleTap = () => {
    // Haptic feedback for supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && !shouldHidePopups && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`md:hidden fixed left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/20 ${
            isPWA ? 'bottom-16' : 'bottom-0'
          }`}
        >
          <div className="flex items-center justify-between p-3 gap-3">
            <div className="flex-1">
              <p className="text-xs text-emerald-400 font-medium">⚡ {timeLeft} left for same-day</p>
              <p className="text-[10px] text-white/60">Code: FLORA15 • Free ship $100+</p>
            </div>
            <Link
              href="/flower"
              onClick={handleTap}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white text-sm font-bold rounded-full transition-all duration-300 transform active:scale-95 shadow-lg whitespace-nowrap"
            >
              Shop Now
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 text-white/40 hover:text-white/60 transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 