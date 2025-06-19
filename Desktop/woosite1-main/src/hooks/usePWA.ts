import { useState, useEffect } from 'react';

interface PWAState {
  isPWA: boolean;
  safeAreaTop: number;
  safeAreaBottom: number;
  isIOS: boolean;
  headerHeight: number;
}

export const usePWA = (): PWAState => {
  const [isPWA, setIsPWA] = useState(false);
  const [safeAreaTop, setSafeAreaTop] = useState(0);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);
  const [isIOS, setIsIOS] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(60);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const detectPWA = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      return isStandalone || isIOSStandalone;
    };

    const detectIOSDevice = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent);
    };

    const getSafeAreaTop = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      const safeAreaTopValue = computedStyle.getPropertyValue("env(safe-area-inset-top)");
      return parseInt(safeAreaTopValue.replace("px", "")) || 0;
    };

    const getSafeAreaBottom = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      const safeAreaBottomValue = computedStyle.getPropertyValue("env(safe-area-inset-bottom)");
      return parseInt(safeAreaBottomValue.replace("px", "")) || 0;
    };

    const pwaDetected = detectPWA();
    const iosDetected = detectIOSDevice();
    const safeTop = getSafeAreaTop();
    const safeBottom = getSafeAreaBottom();

    setIsPWA(pwaDetected);
    setIsIOS(iosDetected);
    setSafeAreaTop(safeTop);
    setSafeAreaBottom(safeBottom);
    setHeaderHeight(pwaDetected ? 60 + safeTop : 60);

    if (pwaDetected) {
      document.body.classList.add("pwa-body");
      
      // Ensure proper scrolling in PWA mode
      const ensureScrolling = () => {
        // Remove any styles that might prevent scrolling
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('position');
        document.body.style.removeProperty('top');
        document.body.style.removeProperty('width');
        document.body.style.removeProperty('height');
        
        // Ensure html and body can scroll
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        
        // Enable smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
        (document.documentElement.style as any).webkitOverflowScrolling = 'touch';
      };
      
      // Run immediately
      ensureScrolling();
      
      // Set up periodic check to ensure scrolling remains enabled
      const scrollCheckInterval = setInterval(ensureScrolling, 2000);
      
      // Also check when page visibility changes
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          ensureScrolling();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        clearInterval(scrollCheckInterval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.body.classList.remove("pwa-body");
      };
    }

    return () => {
      document.body.classList.remove("pwa-body");
    };
  }, []);

  return { isPWA, safeAreaTop, safeAreaBottom, isIOS, headerHeight };
};
