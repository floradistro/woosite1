"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useFooterVisibility } from '@/hooks/useFooterVisibility';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showUrgency, setShowUrgency] = useState(false);
  const [variant, setVariant] = useState<'timer' | 'discount'>('timer');
  
  const { shouldHidePopups } = useFooterVisibility();

  // Check localStorage for dismissed state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissedData = localStorage.getItem('floatingCTADismissed');
      if (dismissedData) {
        try {
          const { dismissed, timestamp } = JSON.parse(dismissedData);
          const now = new Date().getTime();
          const dayInMs = 24 * 60 * 60 * 1000; // 24 hours
          
          // Check if dismissed and within 24 hours
          if (dismissed && (now - timestamp) < dayInMs) {
            setIsDismissed(true);
          } else {
            // Clear expired data
            localStorage.removeItem('floatingCTADismissed');
          }
        } catch (e) {
          // Handle old format or corrupted data
          localStorage.removeItem('floatingCTADismissed');
        }
      }
    }
  }, []);

  useEffect(() => {
    // Simple A/B test - 50/50 split
    setVariant(Math.random() > 0.5 ? 'timer' : 'discount');
  }, []);

  useEffect(() => {
    // Don't set up scroll listener if already dismissed
    if (isDismissed) return;

    // Show after 5 seconds of scrolling
    const timer = setTimeout(() => {
      const handleScroll = () => {
        if (window.scrollY > 300) {
          setIsVisible(true);
          // Remove listener after showing
          window.removeEventListener('scroll', handleScroll);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      // Cleanup function
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, 5000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  // Calculate time until 2PM for same-day shipping
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(14, 0, 0, 0); // 2PM
      
      // If past 2PM, set for next day
      if (now > deadline) {
        deadline.setDate(deadline.getDate() + 1);
      }
      
      const diff = deadline.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
      
      // Show urgency when less than 2 hours left
      setShowUrgency(hours < 2);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Persist the dismissed state to localStorage with timestamp
    if (typeof window !== 'undefined') {
      localStorage.setItem('floatingCTADismissed', JSON.stringify({
        dismissed: true,
        timestamp: new Date().getTime()
      }));
    }
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && !shouldHidePopups && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm hidden md:block"
        >
          <div className={`bg-black/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border ${
            showUrgency ? 'border-red-500/50' : 'border-white/10'
          }`}>
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Timer */}
            <div className="mb-4">
              <p className={`text-sm font-medium mb-2 ${
                showUrgency ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {showUrgency ? '⚡ Hurry!' : '🚚'} Same-Day Shipping Ends In:
              </p>
              <div className="flex gap-3 text-2xl font-bold text-white">
                <div className="text-center">
                  <div className={`${showUrgency ? 'text-red-400' : ''}`}>
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-white/50 font-normal">hrs</div>
                </div>
                <span className={showUrgency ? 'text-red-400' : ''}>:</span>
                <div className="text-center">
                  <div className={`${showUrgency ? 'text-red-400' : ''}`}>
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-white/50 font-normal">min</div>
                </div>
                <span className={showUrgency ? 'text-red-400' : ''}>:</span>
                <div className="text-center">
                  <div className={`${showUrgency ? 'text-red-400 animate-pulse' : ''}`}>
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-white/50 font-normal">sec</div>
                </div>
              </div>
            </div>

            {/* Offer */}
            <div className="mb-4">
              <p className="text-white font-medium mb-1">First Order Special</p>
              <p className="text-white/70 text-sm">Get 15% off + free shipping on orders over $100</p>
            </div>

            {/* CTA with variant testing */}
            <Link
              href="/flower"
              className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
                showUrgency 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white animate-pulse'
                  : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white'
              }`}
            >
              {variant === 'timer' ? 'Shop Now & Save' : 'Claim 15% Off'}
            </Link>

            {/* Social proof */}
            <div className="text-center mt-3">
              <p className="text-xs text-emerald-400">🔥 23 people ordered in last hour</p>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-white/50">
              <span>✓ Lab Tested</span>
              <span>✓ Fast Shipping</span>
              <span>✓ Secure</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 