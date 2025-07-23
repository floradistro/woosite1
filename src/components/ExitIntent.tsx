"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFooterVisibility } from '@/hooks/useFooterVisibility';

export default function ExitIntent() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { shouldHidePopups } = useFooterVisibility();

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShown')) {
        setShowPopup(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Only add listener on desktop
    if (window.innerWidth > 768) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save email to localStorage for demo
    localStorage.setItem('userEmail', email);
    localStorage.setItem('discountCode', 'FLORA20');
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Close after showing success
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {showPopup && !shouldHidePopups && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-emerald-900/90 to-green-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!isSuccess ? (
              <div className="text-center">
                <div className="text-5xl mb-4">🎁</div>
                <h2 className="text-3xl font-bold text-white mb-2">Wait! Don't Miss Out</h2>
                <p className="text-white/80 mb-6">Get 20% off your first order + exclusive deals</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={!email || isSubmitting}
                    className="w-full py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-0"
                  >
                    {isSubmitting ? 'Claiming...' : 'Claim 15% Off'}
                  </button>
                </form>

                <p className="text-white/50 text-xs mt-4">No spam, unsubscribe anytime</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
                <p className="text-white/80 mb-4">Your code: <span className="text-emerald-400 font-bold text-xl">FLORA20</span></p>
                <p className="text-white/60 text-sm">Check your email for details</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 